import firebase from 'firebase/compat/app'; 
import 'firebase/compat/auth'; 
import 'firebase/compat/firestore';
import 'firebase/compat/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBm7n0RcCYavR5ErtjKC-tVkf6uDBenFv8",
  authDomain: "smartorder-6b044.firebaseapp.com",
  projectId: "smartorder-6b044",
  storageBucket: "smartorder-6b044.appspot.com",
  messagingSenderId: "343056468114",
  appId: "1:343056468114:web:c427fe97a6a05356703e4b"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);