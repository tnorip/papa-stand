// ============================================================
// PAPA STAND - 静的ページ（利用規約・プライバシーポリシー・お問い合わせ）
// ============================================================

import React from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Linking,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, fontSize, fontWeight } from '../config/theme'

type Props = {
  type: 'terms' | 'privacy' | 'contact'
  onGoBack: () => void
}

// ============================================================
// 利用規約
// ============================================================
function TermsContent() {
  return (
    <>
      <Text style={styles.intro}>
        本規約は、PAPA STAND（以下「本サービス」）の利用条件を定めるものです。
        ご利用の前に必ずお読みください。
      </Text>

      {[
        {
          title: '第1条（利用資格）',
          body: '本サービスは、育児に関わる父親を主な対象としています。利用者は本規約に同意した上でサービスを利用するものとします。',
        },
        {
          title: '第2条（禁止事項）',
          body: '以下の行為を禁止します。\n・誹謗中傷・ハラスメント行為\n・マウント行為・過度な営業\n・出会い目的での利用\n・個人情報の過剰な開示\n・危険・違法行為の助長\n・その他運営が不適切と判断する行為',
        },
        {
          title: '第3条（コンテンツの扱い）',
          body: '投稿されたコンテンツの著作権は投稿者に帰属しますが、本サービスはサービス改善・宣伝のために利用できるものとします。不適切なコンテンツは管理者が非表示にできます。',
        },
        {
          title: '第4条（免責事項）',
          body: '本サービスは現状有姿で提供されます。サービスの中断・終了・データの損失等について、運営は責任を負いません。',
        },
        {
          title: '第5条（規約の変更）',
          body: '運営は予告なく本規約を変更できます。変更後も継続して利用した場合、変更後の規約に同意したものとみなします。',
        },
      ].map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionBody}>{section.body}</Text>
        </View>
      ))}
    </>
  )
}

// ============================================================
// プライバシーポリシー
// ============================================================
function PrivacyContent() {
  return (
    <>
      <Text style={styles.intro}>
        PAPA STANDは、ユーザーのプライバシーを尊重し、個人情報の適切な取り扱いに努めます。
      </Text>

      {[
        {
          title: '収集する情報',
          body: '・Googleアカウント情報（メールアドレス・表示名）\n・ニックネーム・居住地域（都道府県・市区町村）\n・子どもの月齢グループ・誕生年月\n・自己紹介・興味タグ\n・投稿・コメント・リアクションの内容',
        },
        {
          title: '情報の利用目的',
          body: '・サービスの提供・運営\n・ユーザー同士のコミュニティ形成\n・サービスの改善・分析\n・不正利用の防止',
        },
        {
          title: '情報の共有',
          body: '収集した個人情報は、法令に基づく場合を除き、第三者に提供しません。ただし、ニックネーム・地域・月齢グループは他ユーザーに表示されます。',
        },
        {
          title: '情報の保管',
          body: 'データはGoogle Firebase（米国）に保存されます。Firebaseのプライバシーポリシーに従い管理されます。',
        },
        {
          title: 'Cookieの使用',
          body: '認証状態の維持のためにローカルストレージを使用します。',
        },
        {
          title: 'お問い合わせ',
          body: 'プライバシーに関するお問い合わせは、本アプリ内のお問い合わせフォームからご連絡ください。',
        },
      ].map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionBody}>{section.body}</Text>
        </View>
      ))}
    </>
  )
}

// ============================================================
// お問い合わせ
// ============================================================
function ContactContent() {
  const handleEmail = () => {
    Linking.openURL('mailto:contact@papastand.app?subject=PAPA STAND お問い合わせ')
  }

  return (
    <>
      <Text style={styles.intro}>
        ご意見・ご要望・不具合報告など、お気軽にご連絡ください。
      </Text>

      <View style={styles.contactCard}>
        <Text style={styles.contactIcon}>☕</Text>
        <Text style={styles.contactTitle}>PAPA STAND 運営事務局</Text>
        <Text style={styles.contactDesc}>
          いただいたお問い合わせには、順次ご返信いたします。{'\n'}
          返信まで数日かかる場合があります。
        </Text>
        <TouchableOpacity style={styles.emailBtn} onPress={handleEmail}>
          <Text style={styles.emailBtnText}>📧 メールで問い合わせる</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>よくあるお問い合わせ</Text>
        {[
          { q: 'アカウントを削除したい', a: 'お問い合わせフォームよりご連絡ください。確認後、対応いたします。' },
          { q: '不適切な投稿を報告したい', a: 'メールにて投稿の内容と日時をお知らせください。速やかに対応いたします。' },
          { q: 'イベントを主催したい', a: '現在は運営主催のイベントのみ対応しています。ご希望の方はお問い合わせください。' },
        ].map((faq) => (
          <View key={faq.q} style={styles.faqItem}>
            <Text style={styles.faqQ}>Q. {faq.q}</Text>
            <Text style={styles.faqA}>A. {faq.a}</Text>
          </View>
        ))}
      </View>
    </>
  )
}

// ============================================================
// メインコンポーネント
// ============================================================
const TITLES = {
  terms:   '利用規約',
  privacy: 'プライバシーポリシー',
  contact: 'お問い合わせ',
}

export default function StaticPageScreen({ type, onGoBack }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{TITLES[type]}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {type === 'terms'   && <TermsContent />}
        {type === 'privacy' && <PrivacyContent />}
        {type === 'contact' && <ContactContent />}
        <View style={{ height: spacing.xxl * 2 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.beige },
  header: {
    backgroundColor: colors.navy, paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
  },
  backBtn: { color: colors.white, fontSize: fontSize.xl },
  headerTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.white },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg },
  intro: { fontSize: fontSize.sm, color: colors.textMuted, lineHeight: 20, marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  sectionTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.navy, marginBottom: spacing.sm },
  sectionBody: { fontSize: fontSize.sm, color: colors.text, lineHeight: 22 },
  contactCard: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.xl, alignItems: 'center',
    borderWidth: 0.5, borderColor: colors.border, marginBottom: spacing.lg,
  },
  contactIcon: { fontSize: 40, marginBottom: spacing.sm },
  contactTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.navy, marginBottom: spacing.sm },
  contactDesc: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: 'center', lineHeight: 20, marginBottom: spacing.lg },
  emailBtn: {
    backgroundColor: colors.navy, borderRadius: radius.lg,
    paddingVertical: spacing.md, paddingHorizontal: spacing.xl,
  },
  emailBtnText: { color: colors.white, fontSize: fontSize.md, fontWeight: fontWeight.bold },
  faqItem: {
    backgroundColor: colors.white, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.sm,
    borderWidth: 0.5, borderColor: colors.border,
  },
  faqQ: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.navy, marginBottom: spacing.xs },
  faqA: { fontSize: fontSize.sm, color: colors.text, lineHeight: 20 },
})
