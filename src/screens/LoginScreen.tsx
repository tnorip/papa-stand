// ============================================================
// PAPA STAND - ログイン画面
// ============================================================

import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  StatusBar,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, fontSize, fontWeight } from '../config/theme'

type Props = {
  onSignIn: () => Promise<void>
}

export default function LoginScreen({ onSignIn }: Props) {
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    try {
      setLoading(true)
      await onSignIn()
    } catch (err: any) {
      // キャンセルは無視
      if (err?.code !== 'SIGN_IN_CANCELLED') {
        Alert.alert('ログインエラー', 'ログインに失敗しました。もう一度お試しください。')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navy} />

      {/* 背景の装飾円 */}
      <View style={[styles.circle, styles.circleTopLeft]} />
      <View style={[styles.circle, styles.circleBottomRight]} />

      {/* ロゴエリア */}
      <View style={styles.logoArea}>
        <Text style={styles.coffeeIcon}>☕</Text>
        <Text style={styles.logoText}>PAPA STAND</Text>
        <Text style={styles.tagline}>パパがふらっと立ち寄れる、子育ての居場所</Text>
      </View>

      {/* ログインボタン */}
      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={[styles.googleButton, loading && styles.googleButtonDisabled]}
          onPress={handleSignIn}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={colors.navy} />
          ) : (
            <>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleButtonText}>Googleでログイン</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* 利用規約 */}
      <View style={styles.termsArea}>
        <Text style={styles.termsText}>
          ログインすることで
          <Text style={styles.termsLink}>利用規約</Text>
          および
          {'\n'}
          <Text style={styles.termsLink}>プライバシーポリシー</Text>
          に同意したことになります
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    overflow: 'hidden',
  },

  // 背景装飾
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  circleTopLeft: {
    width: 320,
    height: 320,
    top: -100,
    left: -80,
  },
  circleBottomRight: {
    width: 220,
    height: 220,
    bottom: 40,
    right: -60,
  },

  // ロゴ
  logoArea: {
    alignItems: 'center',
    marginBottom: spacing.xxl * 1.5,
  },
  coffeeIcon: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  logoText: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    color: colors.white,
    letterSpacing: 4,
    marginBottom: spacing.md,
  },
  tagline: {
    fontSize: fontSize.sm,
    color: colors.orangeLight,
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: 0.5,
  },

  // ボタン
  buttonArea: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  googleButton: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleIcon: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.navy,
  },
  googleButtonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.navy,
  },

  // 利用規約
  termsArea: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? spacing.xxl : spacing.xl,
  },
  termsText: {
    fontSize: fontSize.xs,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: colors.sageLight,
  },
})
