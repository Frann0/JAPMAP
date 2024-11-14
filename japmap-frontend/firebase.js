import { initializeApp } from "firebase/app";
import { defaultNoopBatch } from "mobx-react-lite/dist/utils/observerBatching";

const firebaseConfig = {
  apiKey: "AIzaSyAhzH7U2hE6oluNkjNtn0W0qZgdP8Yi2hs",
  authDomain: "japmap-1d707.firebaseapp.com",
  projectId: "japmap-1d707",
  storageBucket: "japmap-1d707.firebasestorage.app",
  messagingSenderId: "494042965988",
  appId: "1:494042965988:web:83184cf9507391b63f09f1"
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp
