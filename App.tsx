// ============================================================
// PAPA STAND - App.tsx（オリジナルアイコン版）
// ============================================================

import React, { useState, useEffect, useRef } from 'react'
import { View, StyleSheet, ActivityIndicator, Animated } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { TouchableOpacity, Text } from 'react-native'
import { colors, spacing, radius, fontSize, fontWeight } from './src/config/theme'
import { useAuth } from './src/hooks/useAuth'
import { UserProfile } from './src/types'
import { HomeIcon, FeedIcon, EventIcon, ProfileIcon } from './src/components/Icons'

import LoginScreen       from './src/screens/LoginScreen'
import RegisterScreen    from './src/screens/RegisterScreen'
import HomeScreen        from './src/screens/HomeScreen'
import FeedScreen        from './src/screens/FeedScreen'
import PostDetailScreen  from './src/screens/PostDetailScreen'
import CreatePostScreen  from './src/screens/CreatePostScreen'
import EventListScreen   from './src/screens/EventListScreen'
import EventDetailScreen from './src/screens/EventDetailScreen'
import ProfileScreen     from './src/screens/ProfileScreen'
import StaticPageScreen  from './src/screens/StaticPageScreen'

type Tab = 'home' | 'feed' | 'events' | 'profile'
type StaticPageType = 'terms' | 'privacy' | 'contact'

type SubScreen =
  | { name: 'none' }
  | { name: 'post_detail'; postId: string }
  | { name: 'create_post' }
  | { name: 'event_detail'; eventId: string }
  | { name: 'static'; pageType: StaticPageType }

// ============================================================
// ボトムナビ（オリジナルアイコン）
// ============================================================
function BottomNav({ activeTab, onPress }: {
  activeTab: Tab
  onPress: (tab: Tab) => void
}) {
  const items: { tab: Tab; label: string; Icon: React.FC<{ size?: number; color?: string }> }[] = [
    { tab: 'home',    label: 'ホーム',     Icon: HomeIcon },
    { tab: 'feed',    label: '投稿',       Icon: FeedIcon },
    { tab: 'events',  label: 'イベント',   Icon: EventIcon },
    { tab: 'profile', label: 'マイページ', Icon: ProfileIcon },
  ]

  return (
    <View style={navStyles.container}>
      {items.map((item) => {
        const active = activeTab === item.tab
        const iconColor = active ? colors.navy : colors.textMuted
        return (
          <TouchableOpacity key={item.tab} style={navStyles.item} onPress={() => onPress(item.tab)}>
            <item.Icon size={24} color={iconColor} />
            <Text style={[navStyles.label, active && navStyles.labelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const navStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopWidth: 0.5, borderTopColor: colors.border,
    flexDirection: 'row', justifyContent: 'space-around',
    paddingBottom: spacing.sm, paddingTop: spacing.sm,
  },
  item: { alignItems: 'center', gap: 2, paddingHorizontal: spacing.md },
  label: { fontSize: 10, color: colors.textMuted },
  labelActive: { color: colors.navy, fontWeight: fontWeight.bold },
})

// ============================================================
// トースト通知
// ============================================================
function Toast({ message }: { message: string }) {
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1400),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start()
  }, [])

  return (
    <Animated.View style={[toastStyles.container, { opacity }]}>
      <Text style={toastStyles.text}>{message}</Text>
    </Animated.View>
  )
}

const toastStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '35%',
    alignSelf: 'center',
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  text: { color: colors.white, fontSize: fontSize.md, fontWeight: fontWeight.bold },
})

// ============================================================
// メインアプリ
// ============================================================
function MainApp({ profile: initialProfile, onSignOut }: {
  profile: UserProfile
  onSignOut: () => void
}) {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [subScreen, setSubScreen] = useState<SubScreen>({ name: 'none' })
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToastMessage(msg)
    toastTimer.current = setTimeout(() => setToastMessage(null), 2000)
  }

  const goSub = (s: SubScreen) => setSubScreen(s)
  const closeSub = () => setSubScreen({ name: 'none' })

  const handleTabPress = (tab: Tab) => {
    setActiveTab(tab)
    setSubScreen({ name: 'none' })
  }

  const renderSubScreen = () => {
    if (subScreen.name === 'post_detail') {
      return (
        <PostDetailScreen
          postId={subScreen.postId}
          userId={profile.uid}
          userDisplayName={profile.displayName}
          onGoBack={closeSub}
        />
      )
    }
    if (subScreen.name === 'create_post') {
      return (
        <CreatePostScreen
          profile={profile}
          onComplete={() => { closeSub(); showToast('投稿しました ☕') }}
          onGoBack={closeSub}
        />
      )
    }
    if (subScreen.name === 'event_detail') {
      return (
        <EventDetailScreen
          eventId={subScreen.eventId}
          userId={profile.uid}
          userDisplayName={profile.displayName}
          onGoBack={closeSub}
        />
      )
    }
    if (subScreen.name === 'static') {
      return (
        <StaticPageScreen
          type={subScreen.pageType}
          onGoBack={closeSub}
        />
      )
    }
    return null
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            userId={profile.uid}
            onGoToPost={(postId) => goSub({ name: 'post_detail', postId })}
            onGoToCreate={() => goSub({ name: 'create_post' })}
            onGoToFeed={() => handleTabPress('feed')}
            onGoToEvents={() => handleTabPress('events')}
            onGoToProfile={() => handleTabPress('profile')}
            onSignOut={onSignOut}
          />
        )
      case 'feed':
        return (
          <FeedScreen
            userId={profile.uid}
            onGoToPost={(postId) => goSub({ name: 'post_detail', postId })}
            onGoToCreate={() => goSub({ name: 'create_post' })}
            onGoBack={() => handleTabPress('home')}
          />
        )
      case 'events':
        return (
          <EventListScreen
            onGoToEvent={(eventId) => goSub({ name: 'event_detail', eventId })}
            onGoBack={() => handleTabPress('home')}
          />
        )
      case 'profile':
        return (
          <ProfileScreen
            profile={profile}
            onGoToPost={(postId) => goSub({ name: 'post_detail', postId })}
            onGoBack={() => handleTabPress('home')}
            onSignOut={onSignOut}
            onProfileUpdated={(updated) => setProfile(updated)}
          />
        )
    }
  }

  const sub = renderSubScreen()

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <View style={[styles.screen, sub ? styles.hidden : styles.visible]}>
          {renderTab()}
        </View>
        {sub && <View style={styles.screen}>{sub}</View>}
        {toastMessage && <Toast message={toastMessage} />}
      </View>
      <BottomNav activeTab={activeTab} onPress={handleTabPress} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { flex: 1 },
  screen: { flex: 1 },
  hidden: { display: 'none' },
  visible: { display: 'flex' },
})

// ============================================================
// App ルート
// ============================================================
export default function App() {
  const { user, profile, loading, isNewUser, signInWithGoogle, signOut, refreshProfile } = useAuth()

  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={rootStyles.loading}>
          <ActivityIndicator size="large" color={colors.orange} />
        </View>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider>
      {!user ? (
        <LoginScreen onSignIn={signInWithGoogle} />
      ) : isNewUser ? (
        <RegisterScreen user={user} onComplete={refreshProfile} />
      ) : profile ? (
        <MainApp profile={profile} onSignOut={signOut} />
      ) : (
        <View style={rootStyles.loading}>
          <ActivityIndicator size="large" color={colors.orange} />
        </View>
      )}
    </SafeAreaProvider>
  )
}

const rootStyles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.navy },
})
