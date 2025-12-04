import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// TODO: Move these to environment variables for production
const firebaseConfig = {
    apiKey: "AIzaSyANEUpD7n2KEzhMgALvdNM8TBWGPZuEHO8",
    authDomain: "springvilleguests.firebaseapp.com",
    projectId: "springvilleguests",
    storageBucket: "springvilleguests.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
