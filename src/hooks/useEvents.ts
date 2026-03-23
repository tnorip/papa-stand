// ============================================================
// PAPA STAND - イベントフック
// ============================================================

import { useState, useEffect } from 'react'
import {
  collection, query, orderBy, onSnapshot,
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  serverTimestamp, where,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { Event, EventParticipant } from '../types'

// ============================================================
// イベント一覧取得
// ============================================================
export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'events'),
      where('status', '==', 'published'),
      orderBy('startAt', 'asc')
    )
    const unsubscribe = onSnapshot(q, (snap) => {
      setEvents(snap.docs.map((d) => ({ eventId: d.id, ...d.data() } as Event)))
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return { events, loading }
}

// ============================================================
// イベント詳細取得
// ============================================================
export function useEvent(eventId: string) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'events', eventId), (snap) => {
      if (snap.exists()) setEvent({ eventId: snap.id, ...snap.data() } as Event)
      setLoading(false)
    })
    return unsubscribe
  }, [eventId])

  return { event, loading }
}

// ============================================================
// 参加状況取得
// ============================================================
export function useParticipation(eventId: string, userId: string) {
  const [status, setStatus] = useState<'joined' | 'cancelled' | null>(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'events', eventId, 'participants', userId),
      (snap) => {
        setStatus(snap.exists() ? snap.data().status : null)
      }
    )
    return unsubscribe
  }, [eventId, userId])

  return status
}

// ============================================================
// 参加表明
// ============================================================
export async function joinEvent(eventId: string, userId: string, displayName: string) {
  const eventRef = doc(db, 'events', eventId)
  const participantRef = doc(db, 'events', eventId, 'participants', userId)

  const eventSnap = await getDoc(eventRef)
  if (!eventSnap.exists()) throw new Error('イベントが見つかりません')

  const event = eventSnap.data() as Event
  if (event.participantCount >= event.capacity) throw new Error('定員に達しています')

  const existing = await getDoc(participantRef)
  if (existing.exists() && existing.data().status === 'joined') return

  await setDoc(participantRef, {
    userId,
    displayName,
    status: 'joined',
    joinedAt: serverTimestamp(),
  })

  const increment = (!existing.exists() || existing.data().status === 'cancelled') ? 1 : 0
  if (increment > 0) {
    await updateDoc(eventRef, { participantCount: event.participantCount + 1 })
  }
}

// ============================================================
// キャンセル
// ============================================================
export async function cancelEvent(eventId: string, userId: string) {
  const eventRef = doc(db, 'events', eventId)
  const participantRef = doc(db, 'events', eventId, 'participants', userId)

  const existing = await getDoc(participantRef)
  if (!existing.exists() || existing.data().status === 'cancelled') return

  await updateDoc(participantRef, { status: 'cancelled' })

  const eventSnap = await getDoc(eventRef)
  if (eventSnap.exists()) {
    const count = Math.max(0, (eventSnap.data().participantCount ?? 1) - 1)
    await updateDoc(eventRef, { participantCount: count })
  }
}
