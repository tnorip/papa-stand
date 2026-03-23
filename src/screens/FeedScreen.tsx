// ============================================================
// PAPA STAND - 投稿一覧画面（ヘッダー統一・←ボタン削除版）
// ============================================================

import React, { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, fontSize, fontWeight } from '../config/theme'
import { usePosts } from '../hooks/usePosts'
import { PostType } from '../types'
import PostCard from '../components/PostCard'
import { PlusIcon } from '../components/Icons'

type Props = {
  onGoToPost: (postId: string) => void
  onGoToCreate: () => void
  onGoBack: () => void
}

const FILTERS: { label: string; value: PostType | null }[] = [
  { label: 'すべて',   value: null },
  { label: 'しんどい', value: 'struggle' },
  { label: '聞きたい', value: 'question' },
  { label: '成功した', value: 'small_win' },
  { label: '共有',     value: 'share' },
]

export default function FeedScreen({ onGoToPost, onGoToCreate, onGoBack }: Props) {
  const [filter, setFilter] = useState<PostType | null>(null)
  const { posts, loading } = usePosts(filter ?? undefined)

  return (
    <SafeAreaView style={styles.container}>
      {/* アプリバー（←ボタンなし・ヘッダー統一） */}
      <View style={styles.appBar}>
        <View>
          <Text style={styles.logo}>みんなの声</Text>
          <Text style={styles.logoSub}>COMMUNITY FEED</Text>
        </View>
      </View>

      {/* フィルター（appBarと分離した別領域） */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={String(f.value)}
              style={[styles.filterChip, filter === f.value && styles.filterChipActive]}
              onPress={() => setFilter(f.value)}
            >
              <Text style={[styles.filterText, filter === f.value && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 投稿一覧 */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator color={colors.orange} style={{ marginTop: spacing.xxl }} />
        ) : posts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>まだ投稿がありません。{'\n'}最初の投稿をしてみましょう！</Text>
          </View>
        ) : (
          posts.map((post) => (
            <PostCard key={post.postId} post={post} onPress={() => onGoToPost(post.postId)} />
          ))
        )}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* FAB */}
      <View style={styles.fabContainer} pointerEvents="box-none">
        <TouchableOpacity style={styles.fab} onPress={onGoToCreate}>
          <PlusIcon size={28} color={colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.beige },
  appBar: {
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    minHeight: 56,
    alignItems: 'center',
  },
  logo: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.white, letterSpacing: 1, textAlign: 'center' },
  logoSub: { fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, marginTop: -2 },

  // フィルターは別領域
  filterBar: {
    backgroundColor: colors.navyLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  filterChip: {
    paddingVertical: spacing.xs, paddingHorizontal: spacing.md,
    borderRadius: radius.full, marginRight: spacing.sm,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  filterChipActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  filterText: { color: 'rgba(255,255,255,0.7)', fontSize: fontSize.xs, fontWeight: fontWeight.bold },
  filterTextActive: { color: colors.white },

  scroll: { flex: 1 },
  scrollContent: { padding: spacing.md },
  emptyCard: {
    backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.xl,
    alignItems: 'center', borderWidth: 1, borderColor: colors.border, marginTop: spacing.xl,
  },
  emptyText: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },

  fabContainer: {
    position: 'absolute', right: spacing.lg, bottom: spacing.xl, zIndex: 10,
  },
  fab: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.orange,
    justifyContent: 'center', alignItems: 'center',
  },
})
