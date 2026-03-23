// ============================================================
// PAPA STAND - App.tsx（オリジナルアイコン版）
// ============================================================

import React, { useState } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { TouchableOpacity, Text } from 'react-native'
import { colors, spacing, fontSize, fontWeight } from './src/config/theme'
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
// メインアプリ
// ============================================================
function MainApp({ profile: initialProfile, onSignOut }: {
  profile: UserProfile
  onSignOut: () => void
}) {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [subScreen, setSubScreen] = useState<SubScreen>({ name: 'none' })
  const [profile, setProfile] = useState<UserProfile>(initialProfile)

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
          onComplete={closeSub}
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
