// firebase.js
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore';

// Firebase congig
const firebaseConfig = {
  apiKey: "AIzaSyD_EuTHXYDUnKMd0QV9XejbkYgznYSIHM4",
  authDomain: "unibe-goncourt2025.firebaseapp.com",
  projectId: "unibe-goncourt2025",
  storageBucket: "unibe-goncourt2025.firebasestorage.app",
  messagingSenderId: "601469594241",
  appId: "1:601469594241:web:9606b94fb573f23f867b80",
  measurementId: "G-GWVMXDZLRR"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
export const db = getFirestore(app);

// Export functions for offline handling
export { enableNetwork, disableNetwork };