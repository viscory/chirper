import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDlqs6AiJoRHdWeWbqS-mP2fJuwkTci2p4",
  authDomain: "chirper-csci3100.firebaseapp.com",
  projectId: "chirper-csci3100",
  storageBucket: "chirper-csci3100.appspot.com",
  messagingSenderId: "911066515796",
  appId: "1:911066515796:web:6d63e0689cfcf4ac2760c1",
  measurementId: "G-16N2WFPJYZ"
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
// app did not initially exist
const db = getFirestore(app)
const storage = getStorage(app)

export default app
export { db, storage }
