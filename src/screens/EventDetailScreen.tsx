// ============================================================
// PAPA STAND - イベント詳細画面
// ============================================================

import React, { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, fontSize, fontWeight } from '../config/theme'
import { useEvent, useParticipation, joinEvent, cancelEvent } from '../hooks/useEvents'
import { CHILD_AGE_GROUP_LABELS } from '../types'

type Props = {
  eventId: string
  userId: string
  userDisplayName: string
  onGoBack: () => void
}

function formatFullDate(date: any): string {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  const months = ['1','2','3','4','5','6','7','8','9','10','11','12']
  const days = ['日','月','火','水','木','金','土']
  return `${d.getFullYear()}年${months[d.getMonth()]}月${d.getDate()}日（${days[d.getDay()]}）${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

export default function EventDetailScreen({ eventId, userId, userDisplayName, onGoBack }: Props) {
  const { event, loading } = useEvent(eventId)
  const participation = useParticipation(eventId, userId)
  const [processing, setProcessing] = useState(false)

  const isFull    = event ? event.participantCount >= event.capacity : false
  const isJoined  = participation === 'joined'

  const handleJoin = async () => {
    try {
      setProcessing(true)
      await joinEvent(eventId, userId, userDisplayName)
      Alert.alert('参加表明しました！', 'イベント当日お会いしましょう ☕')
    } catch (e: any) {
      Alert.alert('エラー', e.message ?? '参加表明に失敗しました')
    } finally {
      setProcessing(false)
    }
  }

  const handleCancel = async () => {
    Alert.alert('参加をキャンセル', '本当にキャンセルしますか？', [
      { text: 'いいえ' },
      {
        text: 'キャンセルする',
        style: 'destructive',
        onPress: async () => {
          try {
            setProcessing(true)
            await cancelEvent(eventId, userId)
            Alert.alert('キャンセルしました')
          } catch {
            Alert.alert('エラー', 'キャンセルに失敗しました')
          } finally {
            setProcessing(false)
          }
        },
      },
    ])
  }

  if (loading || !event) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={colors.orange} style={{ flex: 1 }} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← 戻る</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{event.title}</Text>
        <Text style={styles.headerArea}>📍 {event.area} {event.venueName}</Text>

        {/* バッジ */}
        <View style={styles.badgeRow}>
          {event.isFirstTimeFriendly && (
            <View style={styles.badge}><Text style={styles.badgeText}>✨ 初参加歓迎</Text></View>
          )}
          {event.isKidsWelcome && (
            <View style={styles.badge}><Text style={styles.badgeText}>👶 子連れOK</Text></View>
          )}
          {isFull && (
            <View style={[styles.badge, styles.badgeFull]}><Text style={styles.badgeText}>満員</Text></View>
          )}
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* 基本情報 */}
        <View style={styles.infoCard}>
          {[
            { label: '開始',   value: formatFullDate(event.startAt) },
            { label: '終了',   value: formatFullDate(event.endAt) },
            { label: '定員',   value: `${event.capacity}名` },
            { label: '参加中', value: `${event.participantCount}名` },
            { label: '主催',   value: event.hostDisplayName },
          ].map((item) => (
            <View key={item.label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* 対象月齢 */}
        {event.childAgeGroups?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>対象月齢</Text>
            <View style={styles.tagRow}>
              {event.childAgeGroups.map((g) => (
                <View key={g} style={styles.tag}>
                  <Text style={styles.tagText}>{CHILD_AGE_GROUP_LABELS[g]}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* イベント説明 */}
        {event.description && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>イベント内容</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>
        )}

        {/* 参加状況バー */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionLabel}>参加状況</Text>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${Math.min(100, event.participantCount / event.capacity * 100)}%` }]} />
          </View>
          <Text style={styles.progressText}>{event.participantCount} / {event.capacity} 名</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 参加ボタン */}
      <View style={styles.footer}>
        {isJoined ? (
          <View style={styles.joinedArea}>
            <View style={styles.joinedBadge}>
              <Text style={styles.joinedBadgeText}>✅ 参加予定</Text>
            </View>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} disabled={processing}>
              <Text style={styles.cancelBtnText}>キャンセル</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.joinBtn, (isFull || processing) && styles.joinBtnDisabled]}
            onPress={handleJoin}
            disabled={isFull || processing}
          >
            {processing ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.joinBtnText}>
                {isFull ? '満員のため参加できません' : '参加を表明する ☕'}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.beige },
  header: { backgroundColor: colors.navy, padding: spacing.lg },
  backBtn: { marginBottom: spacing.sm },
  backBtnText: { color: 'rgba(255,255,255,0.6)', fontSize: fontSize.sm },
  headerTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.white, marginBottom: spacing.xs },
  headerArea: { fontSize: fontSize.xs, color: colors.orangeLight, marginBottom: spacing.sm },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  badge: { paddingVertical: 2, paddingHorizontal: spacing.sm, borderRadius: radius.full, backgroundColor: 'rgba(255,255,255,0.15)' },
  badgeFull: { backgroundColor: 'rgba(255,100,100,0.3)' },
  badgeText: { fontSize: fontSize.xs, color: colors.white, fontWeight: fontWeight.bold },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg },
  infoCard: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.lg,
    borderWidth: 0.5, borderColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: spacing.sm, borderBottomWidth: 0.5, borderBottomColor: colors.border,
  },
  infoLabel: { fontSize: fontSize.sm, color: colors.textMuted, fontWeight: fontWeight.bold },
  infoValue: { fontSize: fontSize.sm, color: colors.text },
  section: { marginBottom: spacing.lg },
  sectionLabel: { fontSize: 10, fontWeight: fontWeight.bold, color: colors.textMuted, letterSpacing: 2, marginBottom: spacing.sm },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tag: { paddingVertical: 4, paddingHorizontal: spacing.md, borderRadius: radius.full, backgroundColor: colors.white, borderWidth: 0.5, borderColor: colors.border },
  tagText: { fontSize: fontSize.sm, color: colors.text },
  description: { fontSize: fontSize.md, color: colors.text, lineHeight: 22 },
  progressSection: { marginBottom: spacing.lg },
  progressBg: { height: 8, backgroundColor: colors.beigeDeep, borderRadius: radius.full, overflow: 'hidden', marginBottom: spacing.xs },
  progressFill: { height: '100%', backgroundColor: colors.orange, borderRadius: radius.full },
  progressText: { fontSize: fontSize.xs, color: colors.textMuted, textAlign: 'right' },
  footer: {
    backgroundColor: colors.white, padding: spacing.lg,
    borderTopWidth: 0.5, borderTopColor: colors.border,
  },
  joinBtn: {
    backgroundColor: colors.orange, borderRadius: radius.lg,
    padding: spacing.lg, alignItems: 'center',
  },
  joinBtnDisabled: { backgroundColor: colors.border },
  joinBtnText: { color: colors.white, fontSize: fontSize.lg, fontWeight: fontWeight.bold },
  joinedArea: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  joinedBadge: {
    flex: 1, backgroundColor: '#d8f0e0', borderRadius: radius.lg,
    padding: spacing.lg, alignItems: 'center',
  },
  joinedBadgeText: { color: '#176e38', fontSize: fontSize.lg, fontWeight: fontWeight.bold },
  cancelBtn: { paddingVertical: spacing.lg, paddingHorizontal: spacing.lg },
  cancelBtnText: { color: colors.textMuted, fontSize: fontSize.sm, textDecorationLine: 'underline' },
})
