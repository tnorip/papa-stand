// ============================================================
// PAPA STAND - 投稿カード
// ============================================================

import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Post, POST_TYPE_LABELS, CHILD_AGE_GROUP_LABELS } from '../types'
import { colors, spacing, radius, fontSize, fontWeight } from '../config/theme'
import { StruggleIcon, QuestionIcon, WinIcon, ShareIcon, CoffeeIcon, FeedIcon, BookmarkIcon } from './Icons'
import { useSavedPost, toggleSavedPost } from '../hooks/usePosts'

type Props = {
  post: Post
  onPress: () => void
  userId: string
}

const TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  struggle:  { bg: '#fde8d8', text: '#b84a09' },
  question:  { bg: '#d8e8f8', text: '#1a47a0' },
  small_win: { bg: '#d8f0e0', text: '#176e38' },
  share:     { bg: '#f0ead8', text: '#7a5e0e' },
}

function TypeIcon({ type, size = 14 }: { type: string; size?: number }) {
  switch (type) {
    case 'struggle':  return <StruggleIcon size={size} color="#b84a09" />
    case 'question':  return <QuestionIcon size={size} color="#1a47a0" />
    case 'small_win': return <WinIcon size={size} color="#176e38" />
    case 'share':     return <ShareIcon size={size} color="#7a5e0e" />
    default: return null
  }
}

export default function PostCard({ post, onPress, userId }: Props) {
  const typeStyle = TYPE_STYLES[post.type] ?? TYPE_STYLES.share
  const timeAgo = formatTimeAgo(post.createdAt)
  const isSaved = useSavedPost(post.postId, userId)

  const handleSave = async () => {
    await toggleSavedPost(post.postId, userId)
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* 1. カテゴリバッジ */}
      <View style={[styles.badge, { backgroundColor: typeStyle.bg }]}>
        <TypeIcon type={post.type} size={13} />
        <Text style={[styles.badgeText, { color: typeStyle.text }]}>
          {POST_TYPE_LABELS[post.type]}
        </Text>
      </View>

      {/* 2. 投稿者名 */}
      <Text style={styles.authorName}>{post.authorDisplayName}</Text>

      {/* 3. 居住地・月齢 */}
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{post.area}</Text>
        <Text style={styles.dot}>·</Text>
        <Text style={styles.infoText}>{CHILD_AGE_GROUP_LABELS[post.childAgeGroup]}</Text>
      </View>

      {/* 4. 投稿内容 */}
      <Text style={styles.text} numberOfLines={3}>{post.text}</Text>

      {/* 5. フッター: 時間 + アクション */}
      <View style={styles.footer}>
        <Text style={styles.timeText}>{timeAgo}</Text>
        <View style={styles.actions}>
          <View style={styles.pill}>
            <CoffeeIcon size={12} color={colors.textMuted} />
            <Text style={styles.pillText}>{post.reactionCount}</Text>
          </View>
          <View style={styles.pill}>
            <FeedIcon size={12} color={colors.textMuted} />
            <Text style={styles.pillText}>{post.commentCount}</Text>
          </View>
          <TouchableOpacity onPress={handleSave} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <BookmarkIcon size={16} color={isSaved ? colors.navy : colors.textMuted} filled={isSaved} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

function formatTimeAgo(createdAt: any): string {
  if (!createdAt) return ''
  const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt)
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60)    return 'たった今'
  if (diff < 3600)  return `${Math.floor(diff / 60)}分前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}時間前`
  return `${Math.floor(diff / 86400)}日前`
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.sm,
    borderWidth: 0.5, borderColor: colors.border,
  },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-start', paddingVertical: 3, paddingHorizontal: spacing.sm,
    borderRadius: radius.full, marginBottom: spacing.xs,
  },
  badgeText: { fontSize: fontSize.xs, fontWeight: fontWeight.bold },
  authorName: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.text, marginBottom: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.sm },
  infoText: { fontSize: fontSize.xs, color: colors.textMuted },
  dot: { fontSize: fontSize.xs, color: colors.beigeDeep },
  text: { fontSize: fontSize.sm, color: colors.text, lineHeight: 20, marginBottom: spacing.sm },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timeText: { fontSize: fontSize.xs, color: colors.textMuted },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 2, paddingHorizontal: spacing.sm, borderRadius: radius.full,
    backgroundColor: colors.beige, borderWidth: 0.5, borderColor: colors.border,
  },
  pillText: { fontSize: fontSize.xs, color: colors.textMuted },
})
