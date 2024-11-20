import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCJmT6vstg7HdnSmpSFkJasZLG_-ltW9zQ",
  authDomain: "drawing-app-a4ea4.firebaseapp.com",
  projectId: "drawing-app-a4ea4",
  storageBucket: "drawing-app-a4ea4.firebasestorage.app",
  messagingSenderId: "569167850706",
  appId: "1:569167850706:web:a2bcf7d8f2e63c8fa1110b",
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
