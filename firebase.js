import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBVX-niMY45zNPmXGsrn8_gEvG36Zb3I8o",
    authDomain: "notification-f2eee.firebaseapp.com",
    databaseURL: "https://notification-f2eee-default-rtdb.firebaseio.com",
    projectId: "notification-f2eee",
    storageBucket: "notification-f2eee.appspot.com",
    messagingSenderId: "774250814579",
    appId: "1:774250814579:web:49b154e3360e0a96c89e06",
    measurementId: "G-K7RD263RWD"
    };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };