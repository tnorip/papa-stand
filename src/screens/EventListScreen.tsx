// ============================================================
// PAPA STAND - イベント一覧画面（ヘッダー統一・←ボタン削除版）
// ============================================================

import React from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, fontSize, fontWeight } from '../config/theme'
import { useEvents } from '../hooks/useEvents'
import { Event, CHILD_AGE_GROUP_LABELS } from '../types'

type Props = {
  onGoToEvent: (eventId: string) => void
  onGoBack: () => void
}

function formatDate(date: any): { month: string; day: string; time: string } {
  if (!date) return { month: '', day: '', time: '' }
  const d = date.toDate ? date.toDate() : new Date(date)
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  return {
    month: months[d.getMonth()],
    day:   String(d.getDate()),
    time:  `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`,
  }
}

function EventCard({ event, onPress }: { event: Event; onPress: () => void }) {
  const { month, day, time } = formatDate(event.startAt)
  const isFull = event.participantCount >= event.capacity

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardHeader}>
        <View style={styles.dateBlock}>
          <Text style={styles.dateMonth}>{month}</Text>
          <Text style={styles.dateDay}>{day}</Text>
        </View>
        <View style={styles.cardHeaderInfo}>
          <Text style={styles.cardTitle}>{event.title}</Text>
          <Text style={styles.cardArea}>📍 {event.area} {event.venueName}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.tagRow}>
          {event.childAgeGroups?.map((g) => (
            <View key={g} style={styles.tag}><Text style={styles.tagText}>{CHILD_AGE_GROUP_LABELS[g]}</Text></View>
          ))}
          {event.isKidsWelcome && <View style={[styles.tag, styles.tagGreen]}><Text style={[styles.tagText, styles.tagTextGreen]}>👶 子連れOK</Text></View>}
          {event.isFirstTimeFriendly && <View style={[styles.tag, styles.tagGreen]}><Text style={[styles.tagText, styles.tagTextGreen]}>✨ 初参加歓迎</Text></View>}
        </View>
        <Text style={styles.metaText}>{time}〜 · 定員{event.capacity}名 / 参加{event.participantCount}名</Text>
        <View style={[styles.joinBtn, isFull && styles.joinBtnFull]}>
          <Text style={styles.joinBtnText}>{isFull ? '満員です' : '詳細を見る →'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default function EventListScreen({ onGoToEvent, onGoBack }: Props) {
  const { events, loading } = useEvents()

  return (
    <SafeAreaView style={styles.container}>
      {/* アプリバー（←ボタンなし・ヘッダー統一） */}
      <View style={styles.appBar}>
        <View>
          <Text style={styles.logo}>イベント</Text>
          <Text style={styles.logoSub}>LOCAL EVENTS</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator color={colors.orange} style={{ marginTop: spacing.xxl }} />
        ) : events.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🎪</Text>
            <Text style={styles.emptyTitle}>イベントはまだありません</Text>
            <Text style={styles.emptyText}>近日中に開催予定のイベントをお楽しみに！</Text>
          </View>
        ) : (
          events.map((event) => (
            <EventCard key={event.eventId} event={event} onPress={() => onGoToEvent(event.eventId)} />
          ))
        )}
        <View style={{ height: spacing.xxl * 2 }} />
      </ScrollView>
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
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.md },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, overflow: 'hidden', marginBottom: spacing.md, borderWidth: 0.5, borderColor: colors.border },
  cardHeader: { backgroundColor: colors.navy, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  dateBlock: { backgroundColor: colors.orange, borderRadius: radius.sm, padding: spacing.sm, alignItems: 'center', minWidth: 44 },
  dateMonth: { fontSize: 9, color: 'rgba(255,255,255,0.85)', fontWeight: fontWeight.bold },
  dateDay: { fontSize: fontSize.xxl, color: colors.white, fontWeight: fontWeight.bold, lineHeight: 26 },
  cardHeaderInfo: { flex: 1 },
  cardTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.white, lineHeight: 20 },
  cardArea: { fontSize: fontSize.xs, color: colors.orangeLight, marginTop: 2 },
  cardBody: { padding: spacing.md },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.sm },
  tag: { paddingVertical: 2, paddingHorizontal: spacing.sm, borderRadius: radius.sm, backgroundColor: colors.beige },
  tagGreen: { backgroundColor: '#d8f0e0' },
  tagText: { fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: colors.textMuted },
  tagTextGreen: { color: '#176e38' },
  metaText: { fontSize: fontSize.xs, color: colors.textMuted, marginBottom: spacing.sm },
  joinBtn: { backgroundColor: colors.orange, borderRadius: radius.md, padding: spacing.sm, alignItems: 'center' },
  joinBtnFull: { backgroundColor: colors.border },
  joinBtnText: { color: colors.white, fontSize: fontSize.sm, fontWeight: fontWeight.bold },
  emptyCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.xxl, alignItems: 'center', borderWidth: 0.5, borderColor: colors.border, marginTop: spacing.xl },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.navy, marginBottom: spacing.sm },
  emptyText: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
})
