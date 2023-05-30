// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from  "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwFhQiLkRqksY-ADlsa3B_VNZedf9E-14",
  authDomain: "blog-space-b4717.firebaseapp.com",
  projectId: "blog-space-b4717",
  storageBucket: "blog-space-b4717.appspot.com",
  messagingSenderId: "481966191158",
  appId: "1:481966191158:web:29ce3a671bee118cfc9e97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);