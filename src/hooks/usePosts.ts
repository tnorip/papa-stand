// ============================================================
// PAPA STAND - 投稿フック
// ============================================================

import { useState, useEffect } from 'react'
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
  where,
  getDocs,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { Post, Comment, Reaction, ReactionType, PostType, ChildAgeGroup } from '../types'

// ============================================================
// 投稿一覧取得
// ============================================================
export function usePosts(filterType?: PostType, filterAge?: ChildAgeGroup) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let q = query(
      collection(db, 'posts'),
      where('deleted', '==', false),
      where('visibility', '==', 'public'),
      orderBy('createdAt', 'desc'),
      limit(30)
    )

    const unsubscribe = onSnapshot(q, (snap) => {
      let data = snap.docs.map((d) => ({ postId: d.id, ...d.data() } as Post))
      if (filterType) data = data.filter((p) => p.type === filterType)
      if (filterAge)  data = data.filter((p) => p.childAgeGroup === filterAge)
      setPosts(data)
      setLoading(false)
    })

    return unsubscribe
  }, [filterType, filterAge])

  return { posts, loading }
}

// ============================================================
// 投稿詳細取得
// ============================================================
export function usePost(postId: string) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'posts', postId), (snap) => {
      if (snap.exists()) {
        setPost({ postId: snap.id, ...snap.data() } as Post)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [postId])

  return { post, loading }
}

// ============================================================
// 投稿作成
// ============================================================
export async function createPost(params: {
  authorId: string
  authorDisplayName: string
  type: PostType
  text: string
  imageUrl: string | null
  prefecture: string
  area: string
  childAgeGroup: ChildAgeGroup
  tags: string[]
}) {
  const ref = await addDoc(collection(db, 'posts'), {
    ...params,
    reactionCount: 0,
    commentCount: 0,
    visibility: 'public',
    deleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

// ============================================================
// 投稿削除（論理削除）
// ============================================================
export async function deletePost(postId: string) {
  await updateDoc(doc(db, 'posts', postId), {
    deleted: true,
    updatedAt: serverTimestamp(),
  })
}

// ============================================================
// コメント取得
// ============================================================
export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'posts', postId, 'comments'),
      where('deleted', '==', false),
      orderBy('createdAt', 'asc')
    )
    const unsubscribe = onSnapshot(q, (snap) => {
      setComments(snap.docs.map((d) => ({ commentId: d.id, ...d.data() } as Comment)))
      setLoading(false)
    })
    return unsubscribe
  }, [postId])

  return { comments, loading }
}

// ============================================================
// コメント投稿
// ============================================================
export async function addComment(postId: string, params: {
  authorId: string
  authorDisplayName: string
  text: string
}) {
  await addDoc(collection(db, 'posts', postId, 'comments'), {
    ...params,
    deleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  await updateDoc(doc(db, 'posts', postId), {
    commentCount: (await getDoc(doc(db, 'posts', postId))).data()?.commentCount + 1,
  })
}

// ============================================================
// 保存（ブックマーク）
// ============================================================
export function useSavedPost(postId: string, userId: string) {
  const [isSaved, setIsSaved] = useState(false)
  useEffect(() => {
    if (!userId || !postId) return
    const unsubscribe = onSnapshot(
      doc(db, 'users', userId, 'savedPosts', postId),
      (snap) => setIsSaved(snap.exists())
    )
    return unsubscribe
  }, [postId, userId])
  return isSaved
}

export function useSavedPosts(userId: string) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!userId) return
    const unsubscribe = onSnapshot(
      query(collection(db, 'users', userId, 'savedPosts'), orderBy('savedAt', 'desc')),
      async (snap) => {
        if (snap.empty) { setPosts([]); setLoading(false); return }
        const fetched = await Promise.all(snap.docs.map(d => getDoc(doc(db, 'posts', d.id))))
        setPosts(
          fetched
            .filter(d => d.exists() && !d.data()?.deleted)
            .map(d => ({ postId: d.id, ...d.data() } as Post))
        )
        setLoading(false)
      }
    )
    return unsubscribe
  }, [userId])
  return { posts, loading }
}

export async function toggleSavedPost(postId: string, userId: string) {
  const ref = doc(db, 'users', userId, 'savedPosts', postId)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    await deleteDoc(ref)
  } else {
    await setDoc(ref, { postId, savedAt: serverTimestamp() })
  }
}

// ============================================================
// リアクション取得
// ============================================================
export function useReaction(postId: string, userId: string) {
  const [reaction, setReaction] = useState<ReactionType | null>(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'posts', postId, 'reactions', userId),
      (snap) => {
        setReaction(snap.exists() ? snap.data().type : null)
      }
    )
    return unsubscribe
  }, [postId, userId])

  return reaction
}

// ============================================================
// リアクション送信
// ============================================================
export async function sendReaction(postId: string, userId: string, type: ReactionType) {
  const reactionRef = doc(db, 'posts', postId, 'reactions', userId)
  const postRef = doc(db, 'posts', postId)
  const existing = await getDoc(reactionRef)

  if (existing.exists() && existing.data().type === type) {
    // 同じリアクションをもう一度押したらキャンセル
    await deleteDoc(reactionRef)
    const postSnap = await getDoc(postRef)
    const count = Math.max(0, (postSnap.data()?.reactionCount ?? 1) - 1)
    await updateDoc(postRef, { reactionCount: count })
  } else {
    await setDoc(reactionRef, { userId, type, createdAt: serverTimestamp() })
    if (!existing.exists()) {
      const postSnap = await getDoc(postRef)
      await updateDoc(postRef, { reactionCount: (postSnap.data()?.reactionCount ?? 0) + 1 })
    }
  }
}
