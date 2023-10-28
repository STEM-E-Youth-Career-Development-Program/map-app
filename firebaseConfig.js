// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyDRWI0-jpFRTA3D8kmqall48uh68yW3u74",
    authDomain: "map-app-a506e.firebaseapp.com",
    projectId: "map-app-a506e",
    storageBucket: "map-app-a506e.appspot.com",
    messagingSenderId: "65587161926",
    appId: "1:65587161926:web:16133ee2392586939c1347",
    measurementId: "G-7217H35J5G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);