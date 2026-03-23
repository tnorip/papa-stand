// ============================================================
// PAPA STAND - 認証フック（Web・ネイティブ両対応版）
// ============================================================

import { useState, useEffect } from 'react'
import { Platform } from 'react-native'
import {
  User,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getApp } from 'firebase/app'
import { db } from '../config/firebase'
import { UserProfile } from '../types'

// WebはgetAuth、ネイティブはinitializeAuthを使う
const auth = Platform.OS === 'web'
  ? getAuth(getApp())
  : initializeAuth(getApp(), {
      persistence: getReactNativePersistence(AsyncStorage),
    })

// ネイティブのみGoogleSigninを使う
let GoogleSignin: any = null
if (Platform.OS !== 'web') {
  GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin
  GoogleSignin.configure({
    webClientId: '21959260795-ksk986n6ra7e6vrpucumaof4le2v9sgj.apps.googleusercontent.com',
  })
}

type AuthState = {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  isNewUser: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    isNewUser: false,
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ user: null, profile: null, loading: false, isNewUser: false })
        return
      }

      try {
        const profileRef = doc(db, 'users', user.uid)
        const profileSnap = await getDoc(profileRef)

        if (profileSnap.exists()) {
          const data = profileSnap.data() as UserProfile
          await setDoc(profileRef, { lastLoginAt: serverTimestamp() }, { merge: true })
          setState({ user, profile: data, loading: false, isNewUser: false })
        } else {
          setState({ user, profile: null, loading: false, isNewUser: true })
        }
      } catch (err) {
        console.error('Profile fetch error:', err)
        setState({ user, profile: null, loading: false, isNewUser: true })
      }
    })

    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    if (Platform.OS === 'web') {
      // Web用：ポップアップでGoogleログイン
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } else {
      // ネイティブ用：GoogleSignin
      await GoogleSignin.hasPlayServices()
      const { data } = await GoogleSignin.signIn()
      const credential = GoogleAuthProvider.credential(data?.idToken ?? null)
      await signInWithCredential(auth, credential)
    }
  }

  const signOut = async () => {
    if (Platform.OS !== 'web') {
      await GoogleSignin.signOut()
    }
    await firebaseSignOut(auth)
  }

  const refreshProfile = async () => {
    if (!state.user) return
    try {
      const profileRef = doc(db, 'users', state.user.uid)
      const snap = await getDoc(profileRef)
      if (snap.exists()) {
        setState((prev) => ({
          ...prev,
          profile: snap.data() as UserProfile,
          isNewUser: false,
        }))
      }
    } catch (err) {
      console.error('Refresh profile error:', err)
    }
  }

  return {
    ...state,
    signInWithGoogle,
    signOut,
    refreshProfile,
  }
}
