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
      const docs = snap.docs.map(d => ({ ...d.data(), id: d.id }));
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
  const cleanItems = items.map(({ _curWarehouseStock, _warehouseStockKey, ...rest }) => rest);
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
    batch.set(prodRef, {
      stock: INC(-item.qty),
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

async function fbCollectCredit(saleId, collectedAt) {
  return fbDB.doc('sales/' + saleId).set({ isCredit: false, creditCollectedAt: collectedAt, updatedAt: TS() }, { merge: true });
}

// İadeler

function fbStreamReturns(onData, onError) {
  const userId = fbAuth.currentUser?.uid;
  if (!userId) { onData([]); return; }
  const q = fbDB.collection('returns').where('ownerId', '==', userId);
  return q.onSnapshot(snap => {
      const docs = snap.docs.map(d => ({ ...d.data(), id: d.id }));
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
    const docRef = fbDB.doc('returns/' + id);
    await docRef.delete();
    return true;
  } catch (error) {
    console.error('[FB] Silme hatası:', error.code, error.message);
    throw error;
  }
}

// Transferlər

function fbStreamTransfers(onData, onError) {
  const q = fbDB.collection('transfers').where('ownerId', '==', uid());
  return q.onSnapshot(snap => {
      const docs = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      docs.sort((a, b) => {
        const ta = a.createdAt?.seconds ?? new Date(a.createdAt || 0).getTime() / 1000;
        const tb = b.createdAt?.seconds ?? new Date(b.createdAt || 0).getTime() / 1000;
        return tb - ta;
      });
      onData(docs);
    },
    onError || (err => console.error('[FB] streamTransfers:', err))
  );
}

async function fbSaveTransfer(transfer) {
  const ownerId = uid();
  const ref = fbDB.collection('transfers').doc(transfer.id);
  await ref.set({ ...transfer, ownerId, createdAt: TS() });
  return ref.id;
}

async function fbDeleteTransfer(id) {
  return fbDB.doc('transfers/' + id).delete();
}

async function fbClearTransfers() {
  const ownerId = uid();
  const snap = await fbDB.collection('transfers').where('ownerId', '==', ownerId).get();
  const batch = fbDB.batch();
  snap.docs.forEach(d => batch.delete(d.ref));
  return batch.commit();
}
