// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwoLGvOGtZYUxtwnSHiITSB_xa2mHc_K0",
  authDomain: "flashcardsaas-dae78.firebaseapp.com",
  projectId: "flashcardsaas-dae78",
  storageBucket: "flashcardsaas-dae78.appspot.com",
  messagingSenderId: "647163215785",
  appId: "1:647163215785:web:d90e016bf0e00fd6db8eb8",
  measurementId: "G-LW8RKGYVM0"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }