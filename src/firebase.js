// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBtV2MPKrHTxrL8rR7QjPb6BB6YQKmt-Y4',
  authDomain: 'runlogr.firebaseapp.com',
  projectId: 'runlogr',
  storageBucket: 'runlogr.firebasestorage.app',
  messagingSenderId: '574877625307',
  appId: '1:574877625307:web:f859dc008b4bad8bde95fe',
  measurementId: 'G-BJ3T7FLVJR',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const db = getFirestore(app)

export { db }
