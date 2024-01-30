import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAYRkY7rXNiUq-IcNpLRds-XFPFdiP6jmQ',
  authDomain: 'corinthians-89045.firebaseapp.com',
  projectId: 'corinthians-89045',
  storageBucket: 'corinthians-89045.appspot.com',
  messagingSenderId: '697087937142',
  appId: '1:697087937142:web:ae607e909210d602f2ad57',
  measurementId: 'G-4KLT7J8SE3'
}

const firebaseApp = initializeApp(firebaseConfig)

const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

export { db, auth }
