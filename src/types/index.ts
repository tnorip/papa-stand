// ============================================================
// PAPA STAND - 型定義
// ============================================================

export type ChildAgeGroup =
  | '0-3m'
  | '4-6m'
  | '7-12m'
  | '1-2y'
  | '2y+'

export const CHILD_AGE_GROUP_LABELS: Record<ChildAgeGroup, string> = {
  '0-3m':  '0〜3ヶ月',
  '4-6m':  '4〜6ヶ月',
  '7-12m': '7〜12ヶ月',
  '1-2y':  '1〜2歳',
  '2y+':   '2歳以上',
}

// 子ども1人分の情報
export interface ChildInfo {
  birthMonth: string    // YYYY-MM
  ageGroup: ChildAgeGroup
}

export type UserRole = 'user' | 'admin'
export type UserStatus = 'active' | 'suspended' | 'withdrawn'

export interface UserProfile {
  uid: string
  displayName: string
  photoURL: string | null
  prefecture: string
  area: string
  // 後方互換のため残す（最初の子どもの情報）
  childAgeGroup: ChildAgeGroup
  childBirthMonth: string
  // 複数の子ども情報
  children: ChildInfo[]
  bio: string
  tags: string[]
  role: UserRole
  createdAt: Date
  updatedAt: Date
  lastLoginAt: Date
  status: UserStatus
  avatarId?: string
}

export type PostType = 'struggle' | 'question' | 'small_win' | 'share'

export const POST_TYPE_LABELS: Record<PostType, string> = {
  struggle:  '😮‍💨 しんどい',
  question:  '🙋 聞きたい',
  small_win: '🌱 成功した',
  share:     '📢 共有',
}

export type ReactionType = 'wakaru' | 'otsukare' | 'nice' | 'helpful'

export const REACTION_LABELS: Record<ReactionType, string> = {
  wakaru:   '☕ わかる',
  otsukare: '💪 おつかれ',
  nice:     '👏 ナイス',
  helpful:  '🌱 参考になった',
}

export interface Post {
  postId: string
  authorId: string
  authorDisplayName: string
  type: PostType
  text: string
  imageUrl: string | null
  prefecture: string
  area: string
  childAgeGroup: ChildAgeGroup
  tags: string[]
  reactionCount: number
  commentCount: number
  visibility: 'public' | 'hidden'
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  commentId: string
  authorId: string
  authorDisplayName: string
  text: string
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Reaction {
  userId: string
  type: ReactionType
  createdAt: Date
}

export interface Event {
  eventId: string
  title: string
  description: string
  prefecture: string
  area: string
  venueName: string
  startAt: Date
  endAt: Date
  capacity: number
  childAgeGroups: ChildAgeGroup[]
  hostUserId: string
  hostDisplayName: string
  isKidsWelcome: boolean
  isFirstTimeFriendly: boolean
  status: 'draft' | 'published' | 'cancelled'
  participantCount: number
  createdAt: Date
  updatedAt: Date
}

export interface EventParticipant {
  userId: string
  displayName: string
  status: 'joined' | 'cancelled'
  joinedAt: Date
}
