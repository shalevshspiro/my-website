// טעינת Firebase (אין צורך ב-import/export)
const firebaseConfig = {
  apiKey: "AIzaSyCQ6IhT215CKJBMr8gkvnKuyJLqJe63fZk",
  authDomain: "my-mind-bdd8d.firebaseapp.com",
  projectId: "my-mind-bdd8d",
  storageBucket: "my-mind-bdd8d.appspot.com",
  messagingSenderId: "377040977122",
  appId: "1:377040977122:web:b833bb0f0fe2d685b2b2bb"
};

// אתחול Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// בדיקה אם Firebase נטען
if (typeof firebase === 'undefined') {
    console.error("❌ Firebase לא נטען כראוי. בדוק את הסקריפטים ב-HTML.");
} else {
    console.log("🔥 Firebase נטען בהצלחה!", firebase);
}
