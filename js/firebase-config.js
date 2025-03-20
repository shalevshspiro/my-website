// חיבור האתר ל-Firebase
const firebaseConfig = {
  apiKey: "הכנס-את-ה-API-KEY-שלך",
  authDomain: "my-mind.firebaseapp.com",
  projectId: "my-mind",
  storageBucket: "my-mind.appspot.com",
  messagingSenderId: "123456789",
  appId: "הכנס-את-ה-APP-ID-שלך"
};

// אתחול Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
