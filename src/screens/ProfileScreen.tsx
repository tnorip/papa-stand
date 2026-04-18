// ============================================================
// PAPA STAND - マイページ（ヘッダー統一・複数こども表示・←ボタン削除版）
// ============================================================

import React, { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Alert, ActivityIndicator, Modal,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import { colors, spacing, radius, fontSize, fontWeight } from '../config/theme'
import { UserProfile, CHILD_AGE_GROUP_LABELS, ChildInfo } from '../types'
import { usePosts, useSavedPosts } from '../hooks/usePosts'
import PostCard from '../components/PostCard'
import { Avatar, AvatarPicker, AvatarId } from '../components/Avatars'
import { EditIcon } from '../components/Icons'

type Props = {
  profile: UserProfile
  onGoToPost: (postId: string) => void
  onGoBack: () => void
  onSignOut: () => void
  onProfileUpdated: (updated: UserProfile) => void
}

const TAG_SUGGESTIONS = [
  '育休中', '公園あそび好き', 'アウトドア', '料理好き',
  '読書', 'スポーツ', 'ゲーム', '音楽', 'DIY', '犬・猫好き',
]

export default function ProfileScreen({
  profile, onGoToPost, onGoBack, onSignOut, onProfileUpdated,
}: Props) {
  const [editing, setEditing]     = useState(false)
  const [bio, setBio]             = useState(profile.bio)
  const [tags, setTags]           = useState<string[]>(profile.tags)
  const [avatarId, setAvatarId]   = useState<AvatarId>((profile as any).avatarId ?? 'bear')
  const [avatarPickerVisible, setAvatarPickerVisible] = useState(false)
  const [saving, setSaving]       = useState(false)

  const { posts } = usePosts()
  const myPosts = posts.filter((p) => p.authorId === profile.uid).slice(0, 5)
  const { posts: savedPosts, loading: savedLoading } = useSavedPosts(profile.uid)

  // 子ども情報（後方互換）
  const children: ChildInfo[] = profile.children?.length
    ? profile.children
    : [{ birthMonth: profile.childBirthMonth, ageGroup: profile.childAgeGroup }]

  const toggleTag = (tag: string) => {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await updateDoc(doc(db, 'users', profile.uid), {
        bio: bio.trim(), tags, avatarId, updatedAt: serverTimestamp(),
      })
      onProfileUpdated({ ...profile, bio: bio.trim(), tags, avatarId } as any)
      setEditing(false)
      Alert.alert('保存しました！')
    } catch {
      Alert.alert('エラー', '保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = () => {
    Alert.alert('サインアウト', 'サインアウトしますか？', [
      { text: 'キャンセル' },
      { text: 'サインアウト', style: 'destructive', onPress: onSignOut },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* アプリバー（←ボタンなし・英語サブタイトル追加） */}
      <View style={styles.appBar}>
        <View style={{ width: 32 }} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.logo}>マイページ</Text>
          <Text style={styles.logoSub}>MY PROFILE</Text>
        </View>
        <TouchableOpacity onPress={() => editing ? handleSave() : setEditing(true)}>
          {saving ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : editing ? (
            <Text style={styles.editBtnText}>保存</Text>
          ) : (
            <EditIcon size={20} color={colors.orangeLight} />
          )}
        </TouchableOpacity>
      </View>

      {/* プロフィールカード（appBarと線で分離） */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          {/* アバター */}
          <TouchableOpacity
            style={styles.avatarWrap}
            onPress={() => editing && setAvatarPickerVisible(true)}
            activeOpacity={editing ? 0.7 : 1}
          >
            <Avatar id={avatarId} size={80} />
            {editing && (
              <View style={styles.avatarEditBadge}>
                <Text style={styles.avatarEditText}>変更</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.displayName}>{profile.displayName}</Text>
          <Text style={styles.area}>📍 {profile.prefecture} {profile.area}</Text>

          {/* 子ども情報（複数表示） */}
          <View style={styles.childrenRow}>
            {children.map((child, i) => (
              <View key={i} style={styles.ageTag}>
                <Text style={styles.ageTagText}>
                  {i + 1}子：{CHILD_AGE_GROUP_LABELS[child.ageGroup]}
                </Text>
              </View>
            ))}
          </View>

          {editing ? (
            <TextInput
              style={styles.bioInput} value={bio} onChangeText={setBio}
              multiline maxLength={200}
              placeholder="自己紹介を入力してください"
              placeholderTextColor="rgba(255,255,255,0.4)"
            />
          ) : (
            <Text style={styles.bio}>{profile.bio || '自己紹介はまだありません'}</Text>
          )}
        </View>

        {/* 興味タグ */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>興味タグ</Text>
          <View style={styles.tagGrid}>
            {editing ? (
              TAG_SUGGESTIONS.map((tag) => (
                <TouchableOpacity key={tag} style={[styles.tag, tags.includes(tag) && styles.tagActive]} onPress={() => toggleTag(tag)}>
                  <Text style={[styles.tagText, tags.includes(tag) && styles.tagTextActive]}>{tag}</Text>
                </TouchableOpacity>
              ))
            ) : tags.length > 0 ? (
              tags.map((tag) => (
                <View key={tag} style={styles.tagActive}>
                  <Text style={styles.tagTextActive}>{tag}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>タグはまだありません</Text>
            )}
          </View>
        </View>

        {/* 統計 */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{myPosts.length}</Text>
            <Text style={styles.statLabel}>投稿</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{myPosts.reduce((s, p) => s + p.reactionCount, 0)}</Text>
            <Text style={styles.statLabel}>もらった共感</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{myPosts.reduce((s, p) => s + p.commentCount, 0)}</Text>
            <Text style={styles.statLabel}>コメント</Text>
          </View>
        </View>

        {/* 直近の投稿 */}
        {myPosts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>直近の投稿</Text>
            {myPosts.map((post) => (
              <PostCard key={post.postId} post={post} userId={profile.uid} onPress={() => onGoToPost(post.postId)} />
            ))}
          </View>
        )}

        {/* 保存した投稿 */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>保存した投稿</Text>
          {savedLoading ? (
            <ActivityIndicator color={colors.orange} style={{ marginTop: spacing.sm }} />
          ) : savedPosts.length === 0 ? (
            <Text style={styles.emptyText}>保存した投稿はありません</Text>
          ) : (
            savedPosts.map((post) => (
              <PostCard key={post.postId} post={post} userId={profile.uid} onPress={() => onGoToPost(post.postId)} />
            ))
          )}
        </View>

        {/* メニュー */}
        <View style={styles.menuSection}>
          {['利用規約', 'プライバシーポリシー', 'お問い合わせ'].map((item) => (
            <TouchableOpacity key={item} style={styles.menuItem}>
              <Text style={styles.menuLabel}>{item}</Text>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.menuItem, styles.menuItemDanger]} onPress={handleSignOut}>
            <Text style={styles.menuLabelDanger}>サインアウト</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: spacing.xxl * 2 }} />
      </ScrollView>

      {/* アバター選択モーダル */}
      <Modal visible={avatarPickerVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>アイコンを選ぶ</Text>
              <TouchableOpacity onPress={() => setAvatarPickerVisible(false)}>
                <Text style={styles.modalClose}>完了</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <AvatarPicker selected={avatarId} onSelect={(id) => setAvatarId(id)} />
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
    minHeight: 56,
  },
  logo: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.white, letterSpacing: 1, textAlign: 'center', flex: 1 },
  logoSub: { fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, marginTop: -2, textAlign: 'center' },
  editBtnText: { color: colors.orangeLight, fontSize: fontSize.md, fontWeight: fontWeight.bold },

  scroll: { flex: 1 },
  profileCard: {
    backgroundColor: colors.navy, padding: spacing.xl, alignItems: 'center',
    borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.15)',
  },
  avatarWrap: { marginBottom: spacing.md, position: 'relative' },
  avatarEditBadge: { position: 'absolute', bottom: -4, right: -4, backgroundColor: colors.orange, borderRadius: radius.full, paddingVertical: 2, paddingHorizontal: spacing.sm },
  avatarEditText: { color: colors.white, fontSize: 10, fontWeight: fontWeight.bold },
  displayName: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.white, marginBottom: spacing.xs },
  area: { fontSize: fontSize.xs, color: colors.orangeLight, marginBottom: spacing.sm },
  childrenRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, justifyContent: 'center', marginBottom: spacing.md },
  ageTag: { paddingVertical: 3, paddingHorizontal: spacing.md, borderRadius: radius.full, backgroundColor: 'rgba(255,255,255,0.1)' },
  ageTagText: { fontSize: fontSize.xs, color: 'rgba(255,255,255,0.8)', fontWeight: fontWeight.bold },
  bio: { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 20 },
  bioInput: { width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: radius.md, padding: spacing.md, color: colors.white, fontSize: fontSize.sm, lineHeight: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },

  section: { padding: spacing.lg },
  sectionLabel: { fontSize: 10, fontWeight: fontWeight.bold, color: colors.textMuted, letterSpacing: 2, marginBottom: spacing.sm },
  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tag: { paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md, borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white },
  tagActive: { paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md, borderRadius: radius.full, backgroundColor: colors.navy },
  tagText: { fontSize: fontSize.sm, color: colors.textMuted, fontWeight: fontWeight.bold },
  tagTextActive: { fontSize: fontSize.sm, color: colors.white, fontWeight: fontWeight.bold },
  emptyText: { fontSize: fontSize.sm, color: colors.textMuted },

  statsRow: { backgroundColor: colors.white, flexDirection: 'row', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: colors.border },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  statDivider: { width: 0.5, backgroundColor: colors.border },
  statNum: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.navy },
  statLabel: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },

  menuSection: { backgroundColor: colors.white, marginTop: spacing.md, borderTopWidth: 0.5, borderColor: colors.border },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  menuItemDanger: { borderBottomWidth: 0 },
  menuLabel: { fontSize: fontSize.md, color: colors.text },
  menuArrow: { fontSize: fontSize.md, color: colors.textMuted },
  menuLabelDanger: { fontSize: fontSize.md, color: '#e53935' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: colors.navy, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.15)' },
  modalTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.white },
  modalClose: { fontSize: fontSize.md, color: colors.orange, fontWeight: fontWeight.bold },
  modalContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
})
