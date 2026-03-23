// ============================================================
// PAPA STAND - Firebase 設定
// ============================================================
// ⚠️ Firebaseコンソールで取得した値に書き換えてください
// https://console.firebase.google.com/
// ============================================================

import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey:            'AIzaSyDelUWgdsa5EfSwX6oxcTmz2tcuVVSze_U',
  authDomain:        'papa-stand.firebaseapp.com',
  projectId:         'papa-stand',
  storageBucket:     'papa-stand.firebasestorage.app',
  messagingSenderId: '21959260795',
  appId:             '1:21959260795:web:50ccbb6a6d28eb129640de',
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// authはuseAuth.tsでinitializeAuthを使って初期化するため、ここではexportしない
export const db      = getFirestore(app)
export const storage = getStorage(app)

export default app