// Firebase Configuration
// REPLACE WITH YOUR ACTUAL FIREBASE CONFIG FROM FIREBASE CONSOLE

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtIUYS50AsQyIr5tESDHoftu5RR4W95fE",
  authDomain: "nictm-lost-found.firebaseapp.com",
  projectId: "nictm-lost-found",
  storageBucket: "nictm-lost-found.firebasestorage.app",
  messagingSenderId: "1094114203075",
  appId: "1:1094114203075:web:3037e16bc9e6e64cf31976"
};

// Initialize Firebase (compat mode)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage ? firebase.storage() : null;