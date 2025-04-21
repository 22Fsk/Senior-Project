import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAl7Ml9H5Gx8HGX2CFfjGQs0asIVsyCH4k",
    authDomain: "senior-1d9ad.firebaseapp.com",
    projectId: "senior-1d9ad",
    storageBucket: "senior-1d9ad.firebasestorage.app",
    messagingSenderId: "991411431127",
    appId: "1:991411431127:web:1621665f2bfaf87598f292",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
