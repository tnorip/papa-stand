// ============================================================
// PAPA STAND - オリジナルアイコンコンポーネント
// ============================================================

import React from 'react'
import Svg, {
  Path, Circle, Rect, Line, Polyline, Polygon,
  G, Ellipse, ClipPath, Defs,
} from 'react-native-svg'

type IconProps = {
  size?: number
  color?: string
  strokeWidth?: number
}

// ホーム
export function HomeIcon({ size = 24, color = '#1a2744', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H15v-5h-6v5H4a1 1 0 01-1-1V9.5z"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </Svg>
  )
}

// 投稿（ふきだし）
export function FeedIcon({ size = 24, color = '#1a2744', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <Line x1="9" y1="9" x2="15" y2="9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="9" y1="13" x2="13" y2="13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  )
}

// イベント（カレンダー）
export function EventIcon({ size = 24, color = '#1a2744', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="18" rx="2"
        stroke={color} strokeWidth={strokeWidth} />
      <Line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth={strokeWidth} />
      <Circle cx="8" cy="15" r="1" fill={color} />
      <Circle cx="12" cy="15" r="1" fill={color} />
      <Circle cx="16" cy="15" r="1" fill={color} />
    </Svg>
  )
}

// マイページ（人物）
export function ProfileIcon({ size = 24, color = '#1a2744', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  )
}

// コーヒー（ロゴ・わかるリアクション）
export function CoffeeIcon({ size = 24, color = '#1a2744', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M17 8h1a4 4 0 010 8h-1"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <Line x1="6" y1="1" x2="6" y2="4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="10" y1="1" x2="10" y2="4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  )
}

// ハート（おつかれリアクション）
export function HeartIcon({ size = 24, color = '#1a2744', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </Svg>
  )
}

// 拍手（ナイスリアクション）
export function ClapIcon({ size = 24, color = '#1a2744', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M7 11.5V6a1.5 1.5 0 013 0v4.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M10 10V4.5a1.5 1.5 0 013 0V10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M13 10V6a1.5 1.5 0 013 0v4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M16 10v2a6 6 0 01-6 6H9a6 6 0 01-6-6v-2.5a1.5 1.5 0 013 0V11" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

// 葉っぱ（成功・参考になったリアクション）
export function LeafIcon({ size = 24, color = '#1a2744', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C6 2 4 8 4 12c0 4 3 8 8 8s8-4 8-8c0-5-3-10-8-10z"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <Path d="M12 22V12M12 12C10 10 7 9 4 12"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  )
}

// しんどい（波線）
export function StruggleIcon({ size = 24, color = '#b84a09', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M8 15s1-2 4-2 4 2 4 2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="9" y1="9" x2="9.01" y2="9" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <Line x1="15" y1="9" x2="15.01" y2="9" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  )
}

// 聞きたい（はてな）
export function QuestionIcon({ size = 24, color = '#1a47a0', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M9.5 9a2.5 2.5 0 015 0c0 2-2.5 2.5-2.5 4.5"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="12" y1="17" x2="12.01" y2="17" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  )
}

// 成功（星）
export function WinIcon({ size = 24, color = '#176e38', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </Svg>
  )
}

// 共有（メガホン）
export function ShareIcon({ size = 24, color = '#7a5e0e', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 11v2a6 6 0 006 6h1l2 3 2-3h1a6 6 0 006-6v-2a6 6 0 00-6-6H9a6 6 0 00-6 6z"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <Line x1="8" y1="12" x2="8.01" y2="12" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <Line x1="12" y1="12" x2="12.01" y2="12" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <Line x1="16" y1="12" x2="16.01" y2="12" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  )
}

// 場所（ピン）
export function LocationIcon({ size = 16, color = '#e8a070', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
        stroke={color} strokeWidth={strokeWidth} />
      <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  )
}

// 送信（矢印上）
export function SendIcon({ size = 20, color = '#ffffff', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="12" y1="19" x2="12" y2="5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Polyline points="5 12 12 5 19 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

// プラス（FAB）
export function PlusIcon({ size = 28, color = '#ffffff', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  )
}

// 戻る（矢印）
export function BackIcon({ size = 24, color = '#ffffff', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polyline points="15 18 9 12 15 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

// メニュー（ドット3つ）
export function MenuIcon({ size = 24, color = '#ffffff', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="5" r="1.2" fill={color} />
      <Circle cx="12" cy="12" r="1.2" fill={color} />
      <Circle cx="12" cy="19" r="1.2" fill={color} />
    </Svg>
  )
}

// 編集（ペン）
export function EditIcon({ size = 20, color = '#e8a070', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </Svg>
  )
}

// カメラ（画像添付）
export function CameraIcon({ size = 24, color = '#6b6b6b', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  )
}
