const firebaseConfig = {
  apiKey:            "AIzaSyAQxwcfpgXHyECNSVsynzMoanws5jf9TWg",
  authDomain:        "marketpos-43504.firebaseapp.com",
  projectId:         "marketpos-43504",
  storageBucket:     "marketpos-43504.firebasestorage.app",
  messagingSenderId: "115764564665",
  appId:             "1:115764564665:web:80289a8d2af0e2a7310168",
};

const app = firebase.initializeApp(firebaseConfig);

const fbAuth = firebase.auth(app);
const fbDB   = firebase.firestore(app);
