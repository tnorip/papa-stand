// ============================================================
// PAPA STAND - 投稿カード（オリジナルアイコン版）
// ============================================================

import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Post, POST_TYPE_LABELS } from '../types'
import { colors, spacing, radius, fontSize, fontWeight } from '../config/theme'
import { StruggleIcon, QuestionIcon, WinIcon, ShareIcon, CoffeeIcon, FeedIcon } from './Icons'

type Props = {
  post: Post
  onPress: () => void
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

export default function PostCard({ post, onPress }: Props) {
  const typeStyle = TYPE_STYLES[post.type] ?? TYPE_STYLES.share
  const timeAgo = formatTimeAgo(post.createdAt)

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.badge, { backgroundColor: typeStyle.bg }]}>
        <TypeIcon type={post.type} size={13} />
        <Text style={[styles.badgeText, { color: typeStyle.text }]}>
          {POST_TYPE_LABELS[post.type]}
        </Text>
      </View>
      <Text style={styles.text} numberOfLines={3}>{post.text}</Text>
      <View style={styles.meta}>
        <Text style={styles.metaText}>{post.authorDisplayName}</Text>
        <Text style={styles.dot}>·</Text>
        <Text style={styles.metaText}>{post.area}</Text>
        <Text style={styles.dot}>·</Text>
        <Text style={styles.metaText}>{timeAgo}</Text>
      </View>
      <View style={styles.reactions}>
        <View style={styles.pill}>
          <CoffeeIcon size={12} color={colors.textMuted} />
          <Text style={styles.pillText}>{post.reactionCount}</Text>
        </View>
        <View style={styles.pill}>
          <FeedIcon size={12} color={colors.textMuted} />
          <Text style={styles.pillText}>{post.commentCount}</Text>
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
    borderRadius: radius.full, marginBottom: spacing.sm,
  },
  badgeText: { fontSize: fontSize.xs, fontWeight: fontWeight.bold },
  text: { fontSize: fontSize.sm, color: colors.text, lineHeight: 20, marginBottom: spacing.sm },
  meta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 },
  metaText: { fontSize: fontSize.xs, color: colors.textMuted },
  dot: { fontSize: fontSize.xs, color: colors.beigeDeep },
  reactions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 2, paddingHorizontal: spacing.sm, borderRadius: radius.full,
    backgroundColor: colors.beige, borderWidth: 0.5, borderColor: colors.border,
  },
  pillText: { fontSize: fontSize.xs, color: colors.textMuted },
})
