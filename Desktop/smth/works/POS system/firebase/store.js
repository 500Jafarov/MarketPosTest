// ── firebase/store.js ────────────────────────────────────────────
// Tüm sorgular mevcut kullanıcının UID'siyle izole edilmiştir.
// Farklı mağazaların verileri birbirine asla karışmaz.

import { doc, deleteDoc, collection, getDoc, getDocs, setDoc, updateDoc, addDoc, query, where, onSnapshot, serverTimestamp, increment, writeBatch } from "firebase/firestore";
import { fbAuth, fbDB } from "./config.js";

const TS = () => serverTimestamp();
const INC = (n) => increment(n);

function uid() {
  const u = fbAuth.currentUser;
  if (!u) throw new Error('Oturum açık değil.');
  return u.uid;
}

// ── Mağaza ──────────────────────────────────────────────────────

async function fbGetStoreData() {
  const snap = await getDoc(doc(fbDB, 'stores', uid()));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

async function fbSaveStoreData(data) {
  return setDoc(doc(fbDB, 'stores', uid()), data, { merge: true });
}

// ── Ürünler ─────────────────────────────────────────────────────

// Dönen fonksiyonu çağırarak real-time listener'ı durdurabilirsiniz.
function fbStreamProducts(onData, onError) {
  const q = query(collection(fbDB, 'products'), where('ownerId', '==', uid()));
  return onSnapshot(q,
    snap => onData(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
    onError || (err => console.error('[FB] streamProducts:', err))
  );
}

async function fbSaveProduct(product) {
  const ownerId = uid();
  const data = { ...product, ownerId, updatedAt: TS() };
  delete data.id;

  if (product.id) {
    await setDoc(doc(fbDB, 'products', product.id), data, { merge: true });
    return product.id;
  }
  data.createdAt = TS();
  const ref = await addDoc(collection(fbDB, 'products'), data);
  return ref.id;
}

async function fbDeleteProduct(id) {
  return deleteDoc(doc(fbDB, 'products', id));
}

// ── Satışlar ─────────────────────────────────────────────────────

// orderBy kaldırıldı → composite index gerekmez
// Sıralama client-side yapılır (createdAt.seconds veya ISO string)
function fbStreamSales(onData, onError) {
  const q = query(collection(fbDB, 'sales'), where('ownerId', '==', uid()));
  return onSnapshot(q,
    snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => {
        const ta = a.createdAt?.seconds ?? new Date(a.createdAt || 0).getTime() / 1000;
        const tb = b.createdAt?.seconds ?? new Date(b.createdAt || 0).getTime() / 1000;
        return tb - ta; // en yeni önce
      });
      onData(docs);
    },
    onError || (err => console.error('[FB] streamSales:', err))
  );
}

// Satış tamamla: satışı kaydet + stok + warehouseStock atomik batch
async function fbCompleteSale(sale) {
  const ownerId = uid();
  const batch = writeBatch(fbDB);

  // Satış dokümanı — local id çıkar, Firestore id kullan
  const saleRef = doc(collection(fbDB, 'sales'));
  const { id: _localId, items, ...saleData } = sale;
  // items'tan _curWarehouseStock geçici alanını temizle
  const cleanItems = items.map(({ _curWarehouseStock, ...rest }) => rest);
  batch.set(saleRef, {
    ...saleData,
    items: cleanItems,
    id: saleRef.id,
    ownerId,
    createdAt: TS(),
  });

  // Her ürün için stock + warehouseStock tek batch'te güncelle
  for (const item of items) {
    if (!item.productId) continue;
    const prodRef = doc(fbDB, 'products', item.productId);
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
  return deleteDoc(doc(fbDB, 'sales', id));
}

async function fbUpdateSaleCustomer(saleId, customerName, customerPhone) {
  const data = { customerName: customerName || '', customerPhone: customerPhone || '', updatedAt: TS() };
  return setDoc(doc(fbDB, 'sales', saleId), data, { merge: true });
}

// ── İadeler ──────────────────────────────────────────────────────

function fbStreamReturns(onData, onError) {
  return onSnapshot(collection(fbDB, 'returns'),
    snap => {
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
  const batch = writeBatch(fbDB);

  const retRef = doc(fbDB, 'returns', ret.id);
  batch.set(retRef, { ...ret, ownerId, createdAt: TS() });

  // Stoku geri yükle
  if (ret.items) {
    for (const item of ret.items) {
      const prodRef = doc(fbDB, 'products', item.productId);
      batch.update(prodRef, { stock: INC(item.qty), updatedAt: TS() });
    }
  }

  await batch.commit();
  return retRef.id;
}

async function fbDeleteReturn(id) {
  const docRef = doc(fbDB, 'returns', id);
  await deleteDoc(docRef);
  console.log('Veritabanından başarıyla silindi:', id);
}
