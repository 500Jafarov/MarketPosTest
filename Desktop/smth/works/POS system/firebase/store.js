// Tüm sorgular mevcut kullanıcının UID'siyle izole edilmiştir.

const TS = () => firebase.firestore.FieldValue.serverTimestamp();
const INC = (n) => firebase.firestore.FieldValue.increment(n);

function uid() {
  const u = fbAuth.currentUser;
  if (!u) throw new Error('Oturum açık değil.');
  return u.uid;
}

// Mağaza

async function fbGetStoreData() {
  const snap = await fbDB.doc('stores/' + uid()).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
}

async function fbSaveStoreData(data) {
  return fbDB.doc('stores/' + uid()).set(data, { merge: true });
}

// Ürünler

function fbStreamProducts(onData, onError) {
  const q = fbDB.collection('products').where('ownerId', '==', uid());
  return q.onSnapshot(snap => {
      onData(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    },
    onError || (err => console.error('[FB] streamProducts:', err))
  );
}

async function fbSaveProduct(product) {
  const ownerId = uid();
  const data = { ...product, ownerId, updatedAt: TS() };
  delete data.id;

  if (product.id) {
    await fbDB.doc('products/' + product.id).set(data, { merge: true });
    return product.id;
  }
  data.createdAt = TS();
  const ref = await fbDB.collection('products').add(data);
  return ref.id;
}

async function fbDeleteProduct(id) {
  return fbDB.doc('products/' + id).delete();
}

// Satışlar

function fbStreamSales(onData, onError) {
  const q = fbDB.collection('sales').where('ownerId', '==', uid());
  return q.onSnapshot(snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => {
        const ta = a.createdAt?.seconds ?? new Date(a.createdAt || 0).getTime() / 1000;
        const tb = b.createdAt?.seconds ?? new Date(b.createdAt || 0).getTime() / 1000;
        return tb - ta;
      });
      onData(docs);
    },
    onError || (err => console.error('[FB] streamSales:', err))
  );
}

async function fbCompleteSale(sale) {
  const ownerId = uid();
  const batch = fbDB.batch();

  const saleRef = fbDB.collection('sales').doc();
  const { id: _localId, items, ...saleData } = sale;
  const cleanItems = items.map(({ _curWarehouseStock, ...rest }) => rest);
  batch.set(saleRef, {
    ...saleData,
    items: cleanItems,
    id: saleRef.id,
    ownerId,
    createdAt: TS(),
  });

  for (const item of items) {
    if (!item.productId) continue;
    const prodRef = fbDB.doc('products/' + item.productId);
    const newWarehouseStock = Math.max(0, (item._curWarehouseStock || 0) - item.qty);
    batch.set(prodRef, {
      stock: INC(-item.qty),
      warehouseStock: newWarehouseStock,
      updatedAt: TS(),
    }, { merge: true });
  }

  await batch.commit();
  return saleRef.id;
}

async function fbDeleteSale(id) {
  return fbDB.doc('sales/' + id).delete();
}

async function fbUpdateSaleCustomer(saleId, customerName, customerPhone) {
  const data = { customerName: customerName || '', customerPhone: customerPhone || '', updatedAt: TS() };
  return fbDB.doc('sales/' + saleId).set(data, { merge: true });
}

// İadeler

function fbStreamReturns(onData, onError) {
  return fbDB.collection('returns').onSnapshot(snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => {
        const ta = a.createdAt?.seconds ?? new Date(a.createdAt || 0).getTime() / 1000;
        const tb = b.createdAt?.seconds ?? new Date(b.createdAt || 0).getTime() / 1000;
        return tb - ta;
      });
      onData(docs);
    },
    onError || (err => console.error('[FB] streamReturns:', err))
  );
}

async function fbSaveReturn(ret) {
  const ownerId = uid();
  const batch = fbDB.batch();

  const retRef = fbDB.collection('returns').doc(ret.id);
  batch.set(retRef, { ...ret, ownerId, createdAt: TS() });

  if (ret.items) {
    for (const item of ret.items) {
      const prodRef = fbDB.doc('products/' + item.productId);
      batch.update(prodRef, { stock: INC(item.qty), updatedAt: TS() });
    }
  }

  await batch.commit();
  return retRef.id;
}

async function fbDeleteReturn(id) {
  try {
    console.log('[FB] Silme başladı, id:', id);
    console.log('[FB] fbDB:', fbDB);
    console.log('[FB] fbDB.collection:', fbDB.collection);
    
    const docRef = fbDB.doc('returns/' + id);
    console.log('[FB] docRef:', docRef.path);
    
    await docRef.delete();
    console.log('[FB] Silme başarılı, id:', id);
    return true;
  } catch (error) {
    console.error('[FB] Silme HATASI:', error.code, error.message, error);
    throw error;
  }
}
