import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAYtsNnY8X43eTWw0N51ohIIfMN5XXJmXs",
  authDomain: "alcotheque.firebaseapp.com",
  projectId: "alcotheque",
  storageBucket: "alcotheque.appspot.com", // Correction du storageBucket
  messagingSenderId: "271253422023",
  appId: "1:271253422023:web:8771785391421ee0c863e2",
  measurementId: "G-K38P9ZGLPQ"
};

// Initialiser Firebase uniquement côté client
const app = typeof window !== 'undefined' ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const analytics = app && typeof window !== 'undefined' ? getAnalytics(app) : null;

// Vérifier que l'initialisation s'est bien passée
if (!app || !auth || !db) {
  console.error('Erreur d\'initialisation Firebase');
}