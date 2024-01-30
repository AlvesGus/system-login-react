import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDabefXqqnNOBgNZFdIk-P4SESk95obuTM',
  authDomain: 'curso-1066c.firebaseapp.com',
  projectId: 'curso-1066c',
  storageBucket: 'curso-1066c.appspot.com',
  messagingSenderId: '210313919492',
  appId: '1:210313919492:web:167b1b893d83c3b4c2c951',
  measurementId: 'G-B27DCM9B9Y'
}

const firebaseApp = initializeApp(firebaseConfig)

const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

export { db, auth }
