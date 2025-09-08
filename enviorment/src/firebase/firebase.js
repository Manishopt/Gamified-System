// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsmwHZBCmjNTBhA5CJjGFis3IVXuOQnK0",
  authDomain: "env-pro-94f53.firebaseapp.com",
  projectId: "env-pro-94f53",
  storageBucket: "env-pro-94f53.firebasestorage.app",
  messagingSenderId: "604415251107",
  appId: "1:604415251107:web:cf07c115dd636066f1e516",
  measurementId: "G-JJJP345JCB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

export {
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
};

export default app;