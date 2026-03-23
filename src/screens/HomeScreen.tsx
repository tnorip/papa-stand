// ============================================================
// PAPA STAND - ホーム画面（メニューモーダル・ヘッダー統一版）
// ============================================================

import React, { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Modal,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, fontSize, fontWeight } from '../config/theme'
import { usePosts } from '../hooks/usePosts'
import { PostType } from '../types'
import PostCard from '../components/PostCard'
import { MenuIcon, PlusIcon } from '../components/Icons'

type Props = {
  userId: string
  onGoToPost: (postId: string) => void
  onGoToCreate: () => void
  onGoToFeed: () => void
  onGoToEvents: () => void
  onGoToProfile: () => void
  onSignOut: () => void
}

const CTA_ITEMS: { label: string; type: PostType; color: string }[] = [
  { label: '😮‍💨 今日しんどい', type: 'struggle',  color: colors.orange },
  { label: '💬 ちょっと聞いて', type: 'question',  color: colors.navy },
  { label: '🎉 うれしかった',   type: 'small_win', color: colors.sage },
]

export default function HomeScreen({
  userId, onGoToPost, onGoToCreate, onGoToFeed, onGoToEvents, onGoToProfile, onSignOut,
}: Props) {
  const { posts, loading } = usePosts()
  const recentPosts = posts.slice(0, 3)
  const [menuVisible, setMenuVisible] = useState(false)

  const today = new Date()
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`

  const handleSignOut = () => {
    setMenuVisible(false)
    onSignOut()
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* アプリバー */}
      <View style={styles.appBar}>
        <View>
          <Text style={styles.logo}>PAPA STAND</Text>
          <Text style={styles.logoSub}>LOCAL PAPA COMMUNITY</Text>
        </View>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuVisible(true)}>
          <MenuIcon size={22} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* メニューモーダル */}
      <Modal visible={menuVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuSheet}>
            <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
              <Text style={styles.menuItemText}>サインアウト</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {/* グリーティングカード */}
          <View style={styles.greetingCard}>
            <Text style={styles.greetingDate}>{dateStr}</Text>
            <Text style={styles.greetingMsg}>
              今日も一日、おつかれさまでした。{'\n'}ふらっと立ち寄ってみてください ☕
            </Text>
            <Text style={styles.greetingCoffee}>☕</Text>
          </View>

          {/* CTAチップ */}
          <Text style={styles.sectionLabel}>今日の声</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {CTA_ITEMS.map((item) => (
              <TouchableOpacity key={item.type} style={[styles.chip, { backgroundColor: item.color }]} onPress={onGoToCreate}>
                <Text style={styles.chipText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.chipOutline} onPress={onGoToCreate}>
              <Text style={styles.chipOutlineText}>📢 共有したい</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* 近くのパパの投稿 */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>近くのパパの投稿</Text>
            <TouchableOpacity onPress={onGoToFeed}>
              <Text style={styles.seeAll}>すべて見る →</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color={colors.orange} style={{ marginTop: spacing.lg }} />
          ) : recentPosts.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>まだ投稿がありません。{'\n'}最初の投稿をしてみましょう！</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={onGoToCreate}>
                <Text style={styles.emptyBtnText}>投稿する</Text>
              </TouchableOpacity>
            </View>
          ) : (
            recentPosts.map((post) => (
              <PostCard key={post.postId} post={post} onPress={() => onGoToPost(post.postId)} />
            ))
          )}
        </View>
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* FAB（投稿ボタン）- 投稿画面と同じ位置 */}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 56,
  },
  logo: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.white, letterSpacing: 1 },
  logoSub: { fontSize: 9, color: colors.orangeLight, letterSpacing: 2, marginTop: -2 },
  menuBtn: { padding: spacing.sm },

  // メニューモーダル
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start', alignItems: 'flex-end',
  },
  menuSheet: {
    backgroundColor: colors.white, borderRadius: radius.md,
    marginTop: 60, marginRight: spacing.md,
    minWidth: 160,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }, elevation: 8,
    overflow: 'hidden',
  },
  menuItem: {
    padding: spacing.lg,
    borderBottomWidth: 0,
  },
  menuItemText: { fontSize: fontSize.md, color: '#e53935', fontWeight: fontWeight.medium },

  scroll: { flex: 1 },
  section: { padding: spacing.lg },
  greetingCard: {
    backgroundColor: colors.navy, borderRadius: radius.lg,
    padding: spacing.lg, marginBottom: spacing.lg, position: 'relative', overflow: 'hidden',
  },
  greetingDate: { fontSize: fontSize.xs, color: colors.orangeLight, fontWeight: fontWeight.bold, marginBottom: spacing.xs },
  greetingMsg: { fontSize: fontSize.md, color: colors.white, lineHeight: 22, fontWeight: fontWeight.medium },
  greetingCoffee: { position: 'absolute', right: spacing.lg, bottom: spacing.sm, fontSize: 36, opacity: 0.15 },
  sectionLabel: { fontSize: 10, fontWeight: fontWeight.bold, color: colors.textMuted, letterSpacing: 2, marginBottom: spacing.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  seeAll: { fontSize: fontSize.xs, color: colors.orange, fontWeight: fontWeight.bold },
  chipScroll: { marginBottom: spacing.lg },
  chip: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.full, marginRight: spacing.sm },
  chipText: { color: colors.white, fontSize: fontSize.sm, fontWeight: fontWeight.bold },
  chipOutline: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.full, marginRight: spacing.sm, borderWidth: 1.5, borderColor: colors.navy },
  chipOutlineText: { color: colors.navy, fontSize: fontSize.sm, fontWeight: fontWeight.bold },
  emptyCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.xl, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  emptyText: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: 'center', lineHeight: 20, marginBottom: spacing.lg },
  emptyBtn: { backgroundColor: colors.navy, borderRadius: radius.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.xl },
  emptyBtnText: { color: colors.white, fontWeight: fontWeight.bold, fontSize: fontSize.sm },

  // FAB - 右下固定
  fabContainer: {
    position: 'absolute', right: spacing.lg, bottom: spacing.xl,
    zIndex: 10,
  },
  fab: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.orange,
    justifyContent: 'center', alignItems: 'center',
  },
})
