// ============================================================
// PAPA STAND - 初期登録画面（複数こども対応版）
// ============================================================

import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView,
  Platform, Modal, FlatList,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { User } from 'firebase/auth'
import { db } from '../config/firebase'
import { ChildAgeGroup, CHILD_AGE_GROUP_LABELS, ChildInfo, UserProfile } from '../types'
import { colors, spacing, radius, fontSize, fontWeight } from '../config/theme'

const PREFECTURES = [
  '大阪府', '京都府', '兵庫県', '奈良県', '滋賀県', '和歌山県',
  '東京都', '神奈川県', '埼玉県', '千葉県', 'その他',
]

const TAG_SUGGESTIONS = [
  '育休中', '公園あそび好き', 'アウトドア', '料理好き', '読書',
  'スポーツ', 'ゲーム', '音楽', 'DIY', '犬・猫好き',
]

const now = new Date()
const YEARS = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i)
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)

type Props = { user: User; onComplete: () => void }

function calcAgeGroup(year: number, month: number): ChildAgeGroup {
  const months = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month)
  if (months <= 3)  return '0-3m'
  if (months <= 6)  return '4-6m'
  if (months <= 12) return '7-12m'
  if (months <= 24) return '1-2y'
  return '2y+'
}

// ピッカーモーダル
function PickerModal({ visible, title, items, selected, onSelect, onClose, renderLabel }: {
  visible: boolean; title: string; items: number[]; selected: number
  onSelect: (v: number) => void; onClose: () => void; renderLabel: (v: number) => string
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={pickerStyles.overlay}>
        <View style={pickerStyles.sheet}>
          <View style={pickerStyles.header}>
            <Text style={pickerStyles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={pickerStyles.close}>完了</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={items}
            keyExtractor={(item) => String(item)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[pickerStyles.item, item === selected && pickerStyles.itemSelected]}
                onPress={() => { onSelect(item); onClose() }}
              >
                <Text style={[pickerStyles.itemText, item === selected && pickerStyles.itemTextSelected]}>
                  {renderLabel(item)}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  )
}

const pickerStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, maxHeight: '60%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  title: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.navy },
  close: { fontSize: fontSize.md, color: colors.orange, fontWeight: fontWeight.bold },
  item: { padding: spacing.lg, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  itemSelected: { backgroundColor: colors.beige },
  itemText: { fontSize: fontSize.lg, color: colors.text },
  itemTextSelected: { color: colors.navy, fontWeight: fontWeight.bold },
})

// 子ども入力欄
function ChildInput({ index, child, onChange, onRemove, canRemove }: {
  index: number
  child: { year: number; month: number; ageGroup: ChildAgeGroup | null }
  onChange: (year: number, month: number, ageGroup: ChildAgeGroup) => void
  onRemove: () => void
  canRemove: boolean
}) {
  const [yearPickerVisible, setYearPickerVisible] = useState(false)
  const [monthPickerVisible, setMonthPickerVisible] = useState(false)

  const handleYearSelect = (year: number) => {
    const ag = calcAgeGroup(year, child.month)
    onChange(year, child.month, ag)
  }
  const handleMonthSelect = (month: number) => {
    const ag = calcAgeGroup(child.year, month)
    onChange(child.year, month, ag)
  }

  return (
    <View style={childStyles.container}>
      <View style={childStyles.header}>
        <Text style={childStyles.title}>第{index + 1}子</Text>
        {canRemove && (
          <TouchableOpacity onPress={onRemove}>
            <Text style={childStyles.removeBtn}>削除</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={childStyles.dateRow}>
        <TouchableOpacity style={childStyles.dateBtn} onPress={() => setYearPickerVisible(true)}>
          <Text style={childStyles.dateValue}>{child.year}年</Text>
          <Text style={childStyles.dateArrow}>▼</Text>
        </TouchableOpacity>
        <Text style={childStyles.dateSep}>/</Text>
        <TouchableOpacity style={childStyles.dateBtn} onPress={() => setMonthPickerVisible(true)}>
          <Text style={childStyles.dateValue}>{child.month}月</Text>
          <Text style={childStyles.dateArrow}>▼</Text>
        </TouchableOpacity>
      </View>
      {child.ageGroup && (
        <Text style={childStyles.hint}>→ {CHILD_AGE_GROUP_LABELS[child.ageGroup]} として登録されます</Text>
      )}
      <PickerModal visible={yearPickerVisible} title="生まれた年" items={YEARS} selected={child.year}
        onSelect={handleYearSelect} onClose={() => setYearPickerVisible(false)} renderLabel={(v) => `${v}年`} />
      <PickerModal visible={monthPickerVisible} title="生まれた月" items={MONTHS} selected={child.month}
        onSelect={handleMonthSelect} onClose={() => setMonthPickerVisible(false)} renderLabel={(v) => `${v}月`} />
    </View>
  )
}

const childStyles = StyleSheet.create({
  container: { backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  title: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.navy },
  removeBtn: { fontSize: fontSize.sm, color: '#e53935' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dateBtn: { flex: 1, backgroundColor: colors.beige, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateValue: { fontSize: fontSize.lg, color: colors.text, fontWeight: fontWeight.medium },
  dateArrow: { fontSize: fontSize.xs, color: colors.textMuted },
  dateSep: { fontSize: fontSize.xl, color: colors.textMuted },
  hint: { fontSize: fontSize.xs, color: colors.sage, marginTop: spacing.xs, fontWeight: fontWeight.bold },
})

// メインコンポーネント
export default function RegisterScreen({ user, onComplete }: Props) {
  const [displayName, setDisplayName] = useState(user.displayName ?? '')
  const [prefecture, setPrefecture]   = useState('')
  const [area, setArea]               = useState('')
  const [children, setChildren]       = useState([
    { year: now.getFullYear(), month: now.getMonth() + 1, ageGroup: null as ChildAgeGroup | null }
  ])
  const [bio, setBio]                 = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [loading, setLoading]         = useState(false)

  const addChild = () => {
    if (children.length >= 5) return
    setChildren([...children, { year: now.getFullYear(), month: now.getMonth() + 1, ageGroup: null }])
  }

  const updateChild = (index: number, year: number, month: number, ageGroup: ChildAgeGroup) => {
    const updated = [...children]
    updated[index] = { year, month, ageGroup }
    setChildren(updated)
  }

  const removeChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index))
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])
  }

  const validate = () => {
    if (!displayName.trim()) return 'ニックネームを入力してください'
    if (!prefecture)          return '都道府県を選択してください'
    if (!area.trim())         return '市区町村を入力してください'
    if (children.some(c => !c.ageGroup)) return '子どもの誕生年月を設定してください'
    return null
  }

  const handleSubmit = async () => {
    const error = validate()
    if (error) { Alert.alert('入力エラー', error); return }

    try {
      setLoading(true)
      const childrenInfo: ChildInfo[] = children.map(c => ({
        birthMonth: `${c.year}-${String(c.month).padStart(2, '0')}`,
        ageGroup: c.ageGroup!,
      }))

      await setDoc(doc(db, 'users', user.uid), {
        uid:             user.uid,
        displayName:     displayName.trim(),
        photoURL:        user.photoURL,
        prefecture,
        area:            area.trim(),
        childAgeGroup:   childrenInfo[0].ageGroup,
        childBirthMonth: childrenInfo[0].birthMonth,
        children:        childrenInfo,
        bio:             bio.trim(),
        tags:            selectedTags,
        role:            'user',
        status:          'active',
        createdAt:       serverTimestamp(),
        updatedAt:       serverTimestamp(),
        lastLoginAt:     serverTimestamp(),
      })
      onComplete()
    } catch (err) {
      console.error(err)
      Alert.alert('エラー', '登録に失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>はじめまして！</Text>
          <Text style={styles.headerSub}>簡単な情報を教えてください ☕</Text>
        </View>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* ニックネーム */}
          <View style={styles.field}>
            <Text style={styles.label}>ニックネーム <Text style={styles.required}>必須</Text></Text>
            <TextInput style={styles.input} value={displayName} onChangeText={setDisplayName}
              placeholder="例: たっちゃんパパ" placeholderTextColor={colors.textMuted} maxLength={20} />
          </View>

          {/* 都道府県 */}
          <View style={styles.field}>
            <Text style={styles.label}>都道府県 <Text style={styles.required}>必須</Text></Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {PREFECTURES.map((pref) => (
                <TouchableOpacity key={pref} style={[styles.chip, prefecture === pref && styles.chipSelected]} onPress={() => setPrefecture(pref)}>
                  <Text style={[styles.chipText, prefecture === pref && styles.chipTextSelected]}>{pref}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* 市区町村 */}
          <View style={styles.field}>
            <Text style={styles.label}>市区町村 <Text style={styles.required}>必須</Text></Text>
            <TextInput style={styles.input} value={area} onChangeText={setArea}
              placeholder="例: 守口市" placeholderTextColor={colors.textMuted} maxLength={30} />
          </View>

          {/* 子どもの誕生年月 */}
          <View style={styles.field}>
            <Text style={styles.label}>子どもの誕生年月 <Text style={styles.required}>必須</Text></Text>
            {children.map((child, index) => (
              <ChildInput key={index} index={index} child={child}
                onChange={(y, m, ag) => updateChild(index, y, m, ag)}
                onRemove={() => removeChild(index)}
                canRemove={children.length > 1}
              />
            ))}
            {children.length < 5 && (
              <TouchableOpacity style={styles.addChildBtn} onPress={addChild}>
                <Text style={styles.addChildText}>＋ 子どもを追加する</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 自己紹介 */}
          <View style={styles.field}>
            <Text style={styles.label}>自己紹介 <Text style={styles.optional}>任意</Text></Text>
            <TextInput style={[styles.input, styles.textarea]} value={bio} onChangeText={setBio}
              placeholder="育休中のパパです。気軽に声かけてください！"
              placeholderTextColor={colors.textMuted} multiline numberOfLines={3} maxLength={200} />
            <Text style={styles.charCount}>{bio.length} / 200</Text>
          </View>

          {/* 興味タグ */}
          <View style={styles.field}>
            <Text style={styles.label}>興味タグ <Text style={styles.optional}>任意</Text></Text>
            <View style={styles.tagGrid}>
              {TAG_SUGGESTIONS.map((tag) => (
                <TouchableOpacity key={tag} style={[styles.chip, selectedTags.includes(tag) && styles.chipSelected]} onPress={() => toggleTag(tag)}>
                  <Text style={[styles.chipText, selectedTags.includes(tag) && styles.chipTextSelected]}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 送信ボタン */}
          <TouchableOpacity style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit} disabled={loading} activeOpacity={0.85}>
            {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.submitButtonText}>PAPA STANDに参加する 🎉</Text>}
          </TouchableOpacity>
          <View style={{ height: spacing.xxl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.beige },
  header: { backgroundColor: colors.navy, paddingVertical: spacing.xl, paddingHorizontal: spacing.lg },
  headerTitle: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.white, marginBottom: spacing.xs },
  headerSub: { fontSize: fontSize.sm, color: colors.orangeLight },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg },
  field: { marginBottom: spacing.xl },
  label: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.sm, letterSpacing: 0.5 },
  required: { color: colors.orange, fontSize: fontSize.xs },
  optional: { color: colors.textMuted, fontSize: fontSize.xs },
  input: { backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.md, fontSize: fontSize.md, color: colors.text },
  textarea: { minHeight: 80, textAlignVertical: 'top', paddingTop: spacing.md },
  charCount: { fontSize: fontSize.xs, color: colors.textMuted, textAlign: 'right', marginTop: spacing.xs },
  addChildBtn: { marginTop: spacing.sm, padding: spacing.md, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.orange, borderStyle: 'dashed', alignItems: 'center' },
  addChildText: { color: colors.orange, fontWeight: fontWeight.bold, fontSize: fontSize.sm },
  chip: { paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md, borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white, marginRight: spacing.xs },
  chipSelected: { backgroundColor: colors.navy, borderColor: colors.navy },
  chipText: { fontSize: fontSize.sm, color: colors.textMuted, fontWeight: fontWeight.bold },
  chipTextSelected: { color: colors.white },
  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  submitButton: { backgroundColor: colors.navy, borderRadius: radius.lg, paddingVertical: spacing.lg, alignItems: 'center', marginTop: spacing.md },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.white },
})
