import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-NUc-C4lwQ4c4dc8ELV9nOUGIdXOH1Uw",
  authDomain: "cuestionario-4bcd3.firebaseapp.com",
  projectId: "cuestionario-4bcd3",
  storageBucket: "cuestionario-4bcd3.firebasestorage.app",
  messagingSenderId: "557131309450",
  appId: "1:557131309450:web:4828e5edc1277b5b2ee873",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

