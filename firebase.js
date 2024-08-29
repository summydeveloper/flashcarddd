// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirebase, getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7_DI9teyxNsw2CjZBPkZp-AmkElwWxpQ",
  authDomain: "flashcarddd-c4cfc.firebaseapp.com",
  projectId: "flashcarddd-c4cfc",
  storageBucket: "flashcarddd-c4cfc.appspot.com",
  messagingSenderId: "1028496979302",
  appId: "1:1028496979302:web:976fd83145a707283344a7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db}