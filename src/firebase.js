import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyArfR7BLJzXPwFbk3DvjP6PB8i3REuucd0',
  authDomain: 'chirper-9f759.firebaseapp.com',
  projectId: 'chirper-9f759',
  storageBucket: 'chirper-9f759.appspot.com',
  messagingSenderId: '987059358129',
  appId: '1:987059358129:web:6bfeaae4d2e93963c65590',
  measurementId: 'G-6RTPZL3SCN'
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
// app did not initially exist
const db = getFirestore(app)
const storage = getStorage(app)

export default app
export { db, storage }
