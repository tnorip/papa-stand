// ============================================================
// PAPA STAND - 投稿詳細画面（オリジナルアイコン版）
// ============================================================

import React, { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, ActivityIndicator, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, fontSize, fontWeight } from '../config/theme'
import { usePost, useComments, useReaction, sendReaction, addComment } from '../hooks/usePosts'
import { POST_TYPE_LABELS, ReactionType } from '../types'
import { BackIcon, CoffeeIcon, HeartIcon, ClapIcon, LeafIcon, SendIcon } from '../components/Icons'

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

const REACTIONS: {
  type: ReactionType
  label: string
  Icon: React.FC<{ size?: number; color?: string }>
}[] = [
  { type: 'wakaru',   label: 'わかる',     Icon: CoffeeIcon },
  { type: 'otsukare', label: 'おつかれ',   Icon: HeartIcon },
  { type: 'nice',     label: 'ナイス',     Icon: ClapIcon },
  { type: 'helpful',  label: '参考になった', Icon: LeafIcon },
]

export default function PostDetailScreen({ postId, userId, userDisplayName, onGoBack }: Props) {
  const { post, loading: postLoading } = usePost(postId)
  const { comments, loading: commentsLoading } = useComments(postId)
  const myReaction = useReaction(postId, userId)
  const [commentText, setCommentText] = useState('')
  const [sending, setSending] = useState(false)

  const handleReaction = async (type: ReactionType) => {
    await sendReaction(postId, userId, type)
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

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn}>
          <BackIcon size={20} color="rgba(255,255,255,0.7)" />
          <Text style={styles.backBtnText}>戻る</Text>
        </TouchableOpacity>
        <View style={[styles.badge, { backgroundColor: typeStyle.bg }]}>
          <Text style={[styles.badgeText, { color: typeStyle.text }]}>
            {POST_TYPE_LABELS[post.type]}
          </Text>
        </View>
        <Text style={styles.postText}>{post.text}</Text>
        <View style={styles.postMeta}>
          <Text style={styles.metaText}>{post.authorDisplayName}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.metaText}>{post.area}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.metaText}>{post.childAgeGroup}</Text>
        </View>
      </View>

      {/* リアクションバー */}
      <View style={styles.reactionBar}>
        {REACTIONS.map((r) => {
          const active = myReaction === r.type
          const iconColor = active ? colors.white : colors.text
          return (
            <TouchableOpacity
              key={r.type}
              style={[styles.reactionBtn, active && styles.reactionBtnActive]}
              onPress={() => handleReaction(r.type)}
            >
              <r.Icon size={16} color={iconColor} />
              <Text style={[styles.reactionText, active && styles.reactionTextActive]}>
                {r.label}
              </Text>
            </TouchableOpacity>
          )
        })}
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
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.sm },
  backBtnText: { color: 'rgba(255,255,255,0.6)', fontSize: fontSize.sm },
  badge: {
    alignSelf: 'flex-start', paddingVertical: 2, paddingHorizontal: spacing.sm,
    borderRadius: radius.full, marginBottom: spacing.sm,
  },
  badgeText: { fontSize: fontSize.xs, fontWeight: fontWeight.bold },
  postText: { fontSize: fontSize.md, color: colors.white, lineHeight: 22, fontWeight: fontWeight.medium, marginBottom: spacing.sm },
  postMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: fontSize.xs, color: 'rgba(255,255,255,0.55)' },
  dot: { fontSize: fontSize.xs, color: 'rgba(255,255,255,0.3)' },
  reactionBar: {
    backgroundColor: colors.white, padding: spacing.sm,
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm,
    borderBottomWidth: 0.5, borderBottomColor: colors.border,
  },
  reactionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    borderRadius: radius.full, backgroundColor: colors.beige,
    borderWidth: 1, borderColor: colors.border, flex: 1,
    justifyContent: 'center',
  },
  reactionBtnActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  reactionText: { fontSize: fontSize.xs, color: colors.text, fontWeight: fontWeight.medium },
  reactionTextActive: { color: colors.white },
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
