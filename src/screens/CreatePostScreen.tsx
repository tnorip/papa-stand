// ============================================================
// PAPA STAND - 投稿作成画面（ヘッダー統一版）
// ============================================================

import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, fontSize, fontWeight } from '../config/theme'
import { createPost } from '../hooks/usePosts'
import { PostType, ChildAgeGroup, CHILD_AGE_GROUP_LABELS } from '../types'
import { UserProfile } from '../types'

type Props = {
  profile: UserProfile
  onComplete: () => void
  onGoBack: () => void
}

const POST_TYPES: { id: PostType; label: string; style: { bg: string; border: string; text: string } }[] = [
  { id: 'struggle',  label: '😮‍💨 しんどい', style: { bg: '#fde8d8', border: colors.orange, text: '#b84a09' } },
  { id: 'question',  label: '🙋 聞きたい',  style: { bg: '#d8e8f8', border: '#1a47a0',     text: '#1a47a0' } },
  { id: 'small_win', label: '🌱 成功した',  style: { bg: '#d8f0e0', border: '#176e38',     text: '#176e38' } },
  { id: 'share',     label: '📢 共有',      style: { bg: '#f0ead8', border: '#7a5e0e',     text: '#7a5e0e' } },
]

export default function CreatePostScreen({ profile, onComplete, onGoBack }: Props) {
  const [type, setType]       = useState<PostType>('struggle')
  const [text, setText]       = useState('')
  const [ageTag, setAgeTag]   = useState<ChildAgeGroup>(profile.childAgeGroup)
  const [loading, setLoading] = useState(false)

  const placeholder = {
    struggle:  '今日しんどかったこと、書いてみてください。',
    question:  'ちょっと聞きたいことはありますか？',
    small_win: '小さくてもOK！うれしかったことを共有して。',
    share:     'みんなに教えたいことを書いてください。',
  }[type]

  const handleSubmit = async () => {
    if (!text.trim()) { Alert.alert('入力エラー', '本文を入力してください'); return }
    try {
      setLoading(true)
      await createPost({
        authorId: profile.uid,
        authorDisplayName: profile.displayName,
        type, text: text.trim(), imageUrl: null,
        prefecture: profile.prefecture, area: profile.area,
        childAgeGroup: ageTag, tags: [],
      })
      Alert.alert('投稿しました！', '近くのパパに届きます ☕', [{ text: 'OK', onPress: onComplete }])
    } catch {
      Alert.alert('エラー', '投稿に失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>

        {/* アプリバー（ヘッダー統一） */}
        <View style={styles.appBar}>
          <TouchableOpacity onPress={onGoBack}>
            <Text style={styles.cancelBtn}>キャンセル</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.logo}>投稿する</Text>
            <Text style={styles.logoSub}>CREATE POST</Text>
          </View>
          <View style={{ width: 60 }} />
        </View>

        {/* 投稿タイプ選択（アプリバーと線で分離した別領域） */}
        <View style={styles.typeSection}>
          <Text style={styles.typeSectionLabel}>気持ちのタイプ</Text>
          <View style={styles.typeGrid}>
            {POST_TYPES.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[styles.typeBtn, type === t.id && { backgroundColor: t.style.bg, borderColor: t.style.border }]}
                onPress={() => setType(t.id)}
              >
                <Text style={[styles.typeBtnText, type === t.id && { color: t.style.text }]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* 本文 */}
          <View style={styles.section}>
            <TextInput
              style={styles.textarea}
              value={text} onChangeText={setText}
              placeholder={placeholder} placeholderTextColor={colors.textMuted}
              multiline numberOfLines={5} maxLength={500}
            />
            <Text style={styles.charCount}>{text.length} / 500</Text>
          </View>

          {/* 月齢タグ */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>月齢タグ（任意）</Text>
            <View style={styles.ageGrid}>
              {(Object.keys(CHILD_AGE_GROUP_LABELS) as ChildAgeGroup[]).map((key) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.ageBtn, ageTag === key && styles.ageBtnActive]}
                  onPress={() => setAgeTag(key)}
                >
                  <Text style={[styles.ageBtnText, ageTag === key && styles.ageBtnTextActive]}>
                    {CHILD_AGE_GROUP_LABELS[key]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 投稿ボタン */}
          <TouchableOpacity
            style={[styles.submitBtn, (!text.trim() || loading) && styles.submitBtnDisabled]}
            onPress={handleSubmit} disabled={!text.trim() || loading}
          >
            {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.submitBtnText}>投稿する ☕</Text>}
          </TouchableOpacity>
          <View style={{ height: spacing.xxl * 2 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },

  appBar: {
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
  },
  cancelBtn: { color: 'rgba(255,255,255,0.7)', fontSize: fontSize.sm, width: 60 },
  logo: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.white, letterSpacing: 1 },
  logoSub: { fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, marginTop: -2 },

  // タイプ選択は別領域（線で分離）
  typeSection: {
    backgroundColor: colors.navyLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  typeSectionLabel: { fontSize: 9, fontWeight: fontWeight.bold, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, marginBottom: spacing.sm },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  typeBtn: {
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    borderRadius: radius.full, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'transparent', flex: 1, minWidth: '45%', alignItems: 'center',
  },
  typeBtnText: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: 'rgba(255,255,255,0.7)' },

  scroll: { flex: 1 },
  section: { padding: spacing.lg, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  sectionLabel: { fontSize: 10, fontWeight: fontWeight.bold, color: colors.textMuted, letterSpacing: 2, marginBottom: spacing.sm },
  textarea: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    padding: spacing.md, fontSize: fontSize.md, color: colors.text,
    lineHeight: 22, minHeight: 120, textAlignVertical: 'top',
  },
  charCount: { fontSize: fontSize.xs, color: colors.textMuted, textAlign: 'right', marginTop: spacing.xs },
  ageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  ageBtn: { paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md, borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white },
  ageBtnActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  ageBtnText: { fontSize: fontSize.sm, color: colors.textMuted, fontWeight: fontWeight.bold },
  ageBtnTextActive: { color: colors.white },
  submitBtn: { margin: spacing.lg, padding: spacing.lg, backgroundColor: colors.navy, borderRadius: radius.lg, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: colors.white, fontSize: fontSize.lg, fontWeight: fontWeight.bold },
})
