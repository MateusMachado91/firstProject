// firebase-config.js

import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js'; // Importando apenas o necessário
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAGwBZ1i9PsOvYyOOXGjgyLPJDYyZhAz04",
  authDomain: "good-daughter-5b753.firebaseapp.com",
  databaseURL: "https://good-daughter-5b753-default-rtdb.firebaseio.com",
  projectId: "good-daughter-5b753",
  storageBucket: "good-daughter-5b753.appspot.com",
  messagingSenderId: "465664685420",
  appId: "1:465664685420:web:d277e30b477eb52dcf6f49",
  measurementId: "G-JZWTYTPSC9"
};
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const onAuthStateChangedListener = (callback) => {
  if (auth) {
    return onAuthStateChanged(auth, callback);
  } else {
    console.error("Erro: auth não está definido.");
  }
};