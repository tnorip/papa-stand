// ============================================================
// PAPA STAND - 投稿詳細画面
// ============================================================

import React, { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, ActivityIndicator, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, fontSize, fontWeight } from '../config/theme'
import {
  usePost, useComments, useReaction, sendReaction, addComment,
  deletePost, useSavedPost, toggleSavedPost,
} from '../hooks/usePosts'
import { POST_TYPE_LABELS, CHILD_AGE_GROUP_LABELS } from '../types'
import { BackIcon, CoffeeIcon, FeedIcon, SendIcon, BookmarkIcon } from '../components/Icons'

type Props = {
  postId: string
  userId: string
  userDisplayName: string
  onGoBack: () => void
}

const TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  struggle:  { bg: '#fde8d8', text: '#b84a09' },
  question:  { bg: '#d8e8f8', text: '#1a47a0' },
  small_win: { bg: '#d8f0e0', text: '#176e38' },
  share:     { bg: '#f0ead8', text: '#7a5e0e' },
}

export default function PostDetailScreen({ postId, userId, userDisplayName, onGoBack }: Props) {
  const { post, loading: postLoading } = usePost(postId)
  const { comments, loading: commentsLoading } = useComments(postId)
  const myReaction = useReaction(postId, userId)
  const isSaved = useSavedPost(postId, userId)
  const [commentText, setCommentText] = useState('')
  const [sending, setSending] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleReaction = async () => {
    await sendReaction(postId, userId, 'wakaru')
  }

  const handleSave = async () => {
    await toggleSavedPost(postId, userId)
  }

  const handleDelete = () => {
    Alert.alert('投稿を削除しますか？', 'この操作は元に戻せません。', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除する', style: 'destructive', onPress: async () => {
          try {
            setDeleting(true)
            await deletePost(postId)
            onGoBack()
          } catch {
            Alert.alert('エラー', '削除に失敗しました。もう一度お試しください。')
            setDeleting(false)
          }
        },
      },
    ])
  }

  const handleComment = async () => {
    if (!commentText.trim()) return
    try {
      setSending(true)
      await addComment(postId, {
        authorId: userId,
        authorDisplayName: userDisplayName,
        text: commentText.trim(),
      })
      setCommentText('')
    } catch {
      Alert.alert('エラー', 'コメントの送信に失敗しました')
    } finally {
      setSending(false)
    }
  }

  if (postLoading || !post) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={colors.orange} style={{ flex: 1 }} />
      </SafeAreaView>
    )
  }

  const typeStyle = TYPE_STYLES[post.type] ?? TYPE_STYLES.share
  const active = myReaction === 'wakaru'

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        {/* 戻る / 削除ボタン行 */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onGoBack} style={styles.backBtn}>
            <BackIcon size={20} color="rgba(255,255,255,0.7)" />
            <Text style={styles.backBtnText}>戻る</Text>
          </TouchableOpacity>
          {userId === post.authorId && (
            <TouchableOpacity onPress={handleDelete} disabled={deleting} style={styles.deleteBtn}>
              <Text style={styles.deleteBtnText}>{deleting ? '削除中…' : '削除'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 1. カテゴリバッジ */}
        <View style={[styles.badge, { backgroundColor: typeStyle.bg }]}>
          <Text style={[styles.badgeText, { color: typeStyle.text }]}>
            {POST_TYPE_LABELS[post.type]}
          </Text>
        </View>

        {/* 2. 投稿者名 */}
        <Text style={styles.authorName}>{post.authorDisplayName}</Text>

        {/* 3. 居住地・月齢 */}
        <View style={styles.postMeta}>
          <Text style={styles.metaText}>{post.area}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.metaText}>{CHILD_AGE_GROUP_LABELS[post.childAgeGroup]}</Text>
        </View>

        {/* 4. 投稿内容 */}
        <Text style={styles.postText}>{post.text}</Text>
      </View>

      {/* アクションバー（わかる + 保存） */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.wakuruBtn, active && styles.wakuruBtnActive]}
          onPress={handleReaction}
        >
          <CoffeeIcon size={18} color={active ? colors.white : colors.text} />
          <Text style={[styles.wakuruCount, active && styles.wakuruCountActive]}>
            {post.reactionCount}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionRight}>
          <View style={styles.commentPill}>
            <FeedIcon size={14} color={colors.textMuted} />
            <Text style={styles.commentPillText}>{post.commentCount}</Text>
          </View>
          <TouchableOpacity
            style={[styles.saveBtn, isSaved && styles.saveBtnActive]}
            onPress={handleSave}
          >
            <BookmarkIcon size={18} color={isSaved ? colors.white : colors.text} filled={isSaved} />
          </TouchableOpacity>
        </View>
      </View>

      {/* コメント一覧 */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.commentHeader}>コメント {comments.length}件</Text>
        {commentsLoading ? (
          <ActivityIndicator color={colors.orange} />
        ) : comments.length === 0 ? (
          <Text style={styles.noComment}>まだコメントはありません。最初のコメントをしてみましょう！</Text>
        ) : (
          comments.map((c) => (
            <View key={c.commentId} style={styles.commentItem}>
              <View style={styles.commentAvatar}>
                <ProfileAvatar size={28} />
              </View>
              <View>
                <Text style={styles.commentAuthor}>{c.authorDisplayName}</Text>
                <View style={styles.commentBubble}>
                  <Text style={styles.commentText}>{c.text}</Text>
                </View>
              </View>
            </View>
          ))
        )}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      {/* コメント入力 */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={commentText}
          onChangeText={setCommentText}
          placeholder="コメントを入力…"
          placeholderTextColor={colors.textMuted}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!commentText.trim() || sending) && styles.sendBtnDisabled]}
          onPress={handleComment}
          disabled={!commentText.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <SendIcon size={18} color={colors.white} />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

function ProfileAvatar({ size }: { size: number }) {
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: colors.beigeDeep,
      justifyContent: 'center', alignItems: 'center',
    }}>
      <View style={{ width: size * 0.35, height: size * 0.35, borderRadius: size * 0.175, backgroundColor: colors.textMuted }} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.beige },

  header: { backgroundColor: colors.navy, padding: spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backBtnText: { color: 'rgba(255,255,255,0.6)', fontSize: fontSize.sm },
  deleteBtn: { paddingVertical: 4, paddingHorizontal: spacing.sm },
  deleteBtnText: { color: '#ff6b6b', fontSize: fontSize.sm, fontWeight: fontWeight.bold },

  badge: {
    alignSelf: 'flex-start', paddingVertical: 2, paddingHorizontal: spacing.sm,
    borderRadius: radius.full, marginBottom: spacing.xs,
  },
  badgeText: { fontSize: fontSize.xs, fontWeight: fontWeight.bold },
  authorName: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.white, marginBottom: 4 },
  postMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.sm },
  metaText: { fontSize: fontSize.xs, color: 'rgba(255,255,255,0.55)' },
  dot: { fontSize: fontSize.xs, color: 'rgba(255,255,255,0.3)' },
  postText: { fontSize: fontSize.md, color: colors.white, lineHeight: 22, fontWeight: fontWeight.medium },

  actionBar: {
    backgroundColor: colors.white, padding: spacing.sm,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 0.5, borderBottomColor: colors.border,
  },
  wakuruBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    borderRadius: radius.full, backgroundColor: colors.beige,
    borderWidth: 1, borderColor: colors.border,
  },
  wakuruBtnActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  wakuruCount: { fontSize: fontSize.sm, color: colors.text, fontWeight: fontWeight.medium },
  wakuruCountActive: { color: colors.white },
  actionRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  commentPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: spacing.xs, paddingHorizontal: spacing.sm,
    borderRadius: radius.full, backgroundColor: colors.beige,
    borderWidth: 0.5, borderColor: colors.border,
  },
  commentPillText: { fontSize: fontSize.xs, color: colors.textMuted },
  saveBtn: {
    padding: spacing.sm, borderRadius: radius.full,
    backgroundColor: colors.beige, borderWidth: 1, borderColor: colors.border,
  },
  saveBtnActive: { backgroundColor: colors.navy, borderColor: colors.navy },

  scroll: { flex: 1 },
  scrollContent: { padding: spacing.md },
  commentHeader: { fontSize: 10, fontWeight: fontWeight.bold, color: colors.textMuted, letterSpacing: 2, marginBottom: spacing.md },
  noComment: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
  commentItem: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  commentAvatar: { flexShrink: 0 },
  commentAuthor: { fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: colors.navy, marginBottom: 3 },
  commentBubble: {
    backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.sm,
    borderWidth: 0.5, borderColor: colors.border,
  },
  commentText: { fontSize: fontSize.sm, color: colors.text, lineHeight: 18 },
  inputBar: {
    backgroundColor: colors.white, borderTopWidth: 0.5, borderTopColor: colors.border,
    padding: spacing.sm, flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-end',
  },
  input: {
    flex: 1, backgroundColor: colors.beige, borderRadius: radius.xl,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    fontSize: fontSize.md, color: colors.text,
    borderWidth: 1, borderColor: colors.border, maxHeight: 80,
  },
  sendBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.orange, justifyContent: 'center', alignItems: 'center',
  },
  sendBtnDisabled: { backgroundColor: colors.border },
})
