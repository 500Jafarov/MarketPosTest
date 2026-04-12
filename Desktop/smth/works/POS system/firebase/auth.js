// ── firebase/auth.js ─────────────────────────────────────────────

const FB_AUTH_ERRORS = {
  'auth/user-not-found':     'Kullanıcı bulunamadı.',
  'auth/wrong-password':     'Şifre hatalı.',
  'auth/invalid-email':      'Geçersiz e-posta adresi.',
  'auth/invalid-credential': 'E-posta veya şifre hatalı.',
  'auth/user-disabled':      'Bu hesap devre dışı bırakılmış.',
  'auth/too-many-requests':  'Çok fazla başarısız deneme. Lütfen bekleyin.',
  'auth/network-request-failed': 'Ağ bağlantısı hatası.',
};

async function fbLogin(email, password) {
  try {
    const { user } = await fbAuth.signInWithEmailAndPassword(email, password);
    return { ok: true, user };
  } catch (err) {
    return { ok: false, error: FB_AUTH_ERRORS[err.code] || 'Giriş başarısız.' };
  }
}

function fbLogout() {
  return fbAuth.signOut();
}

function fbOnAuthChange(callback) {
  return fbAuth.onAuthStateChanged(callback);
}
