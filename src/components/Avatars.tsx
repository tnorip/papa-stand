// ============================================================
// PAPA STAND - アバターアイコン（8種類）
// ============================================================

import React from 'react'
import { View, TouchableOpacity, StyleSheet, ScrollView, Text } from 'react-native'
import Svg, { Circle, Path, Ellipse, Rect, G } from 'react-native-svg'
import { colors, spacing, radius } from '../config/theme'

export type AvatarId = 'bear' | 'fox' | 'panda' | 'lion' | 'rabbit' | 'dog' | 'cat' | 'koala'

// ============================================================
// 各アバターSVG
// ============================================================

function BearAvatar({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* 耳 */}
      <Circle cx="25" cy="28" r="14" fill="#8B6914" />
      <Circle cx="75" cy="28" r="14" fill="#8B6914" />
      <Circle cx="25" cy="28" r="8" fill="#C49A3C" />
      <Circle cx="75" cy="28" r="8" fill="#C49A3C" />
      {/* 顔 */}
      <Circle cx="50" cy="55" r="35" fill="#C49A3C" />
      {/* 目 */}
      <Circle cx="38" cy="47" r="5" fill="#3D2B1F" />
      <Circle cx="62" cy="47" r="5" fill="#3D2B1F" />
      <Circle cx="40" cy="45" r="2" fill="white" />
      <Circle cx="64" cy="45" r="2" fill="white" />
      {/* 鼻・口 */}
      <Ellipse cx="50" cy="60" rx="10" ry="7" fill="#8B6914" />
      <Circle cx="50" cy="58" r="4" fill="#3D2B1F" />
      <Path d="M46 63 Q50 67 54 63" stroke="#3D2B1F" strokeWidth="2" fill="none" strokeLinecap="round" />
    </Svg>
  )
}

function FoxAvatar({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* 耳（とがった） */}
      <Path d="M22 40 L15 15 L38 32" fill="#D4602A" />
      <Path d="M78 40 L85 15 L62 32" fill="#D4602A" />
      <Path d="M24 37 L19 20 L35 33" fill="#F5A05A" />
      <Path d="M76 37 L81 20 L65 33" fill="#F5A05A" />
      {/* 顔 */}
      <Circle cx="50" cy="58" r="33" fill="#D4602A" />
      {/* 白い顔の中央部 */}
      <Ellipse cx="50" cy="65" rx="18" ry="20" fill="#FAE0C8" />
      {/* 目 */}
      <Circle cx="37" cy="50" r="5" fill="#3D2B1F" />
      <Circle cx="63" cy="50" r="5" fill="#3D2B1F" />
      <Circle cx="39" cy="48" r="2" fill="white" />
      <Circle cx="65" cy="48" r="2" fill="white" />
      {/* 鼻 */}
      <Ellipse cx="50" cy="63" rx="5" ry="4" fill="#3D2B1F" />
      {/* 口 */}
      <Path d="M45 67 Q50 72 55 67" stroke="#3D2B1F" strokeWidth="2" fill="none" strokeLinecap="round" />
    </Svg>
  )
}

function PandaAvatar({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* 耳 */}
      <Circle cx="25" cy="28" r="14" fill="#2D2D2D" />
      <Circle cx="75" cy="28" r="14" fill="#2D2D2D" />
      {/* 顔 */}
      <Circle cx="50" cy="55" r="35" fill="#F5F5F5" />
      {/* 目の黒部分 */}
      <Ellipse cx="36" cy="46" rx="10" ry="9" fill="#2D2D2D" />
      <Ellipse cx="64" cy="46" rx="10" ry="9" fill="#2D2D2D" />
      {/* 目 */}
      <Circle cx="37" cy="46" r="5" fill="white" />
      <Circle cx="63" cy="46" r="5" fill="white" />
      <Circle cx="38" cy="46" r="3" fill="#2D2D2D" />
      <Circle cx="64" cy="46" r="3" fill="#2D2D2D" />
      <Circle cx="39" cy="44" r="1.5" fill="white" />
      <Circle cx="65" cy="44" r="1.5" fill="white" />
      {/* 鼻 */}
      <Ellipse cx="50" cy="61" rx="6" ry="4" fill="#2D2D2D" />
      {/* 口 */}
      <Path d="M44 65 Q50 70 56 65" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round" />
    </Svg>
  )
}

function LionAvatar({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* たてがみ */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const x = 50 + 38 * Math.cos(rad)
        const y = 55 + 38 * Math.sin(rad)
        return <Circle key={i} cx={x} cy={y} r="10" fill="#C49A3C" />
      })}
      {/* 顔 */}
      <Circle cx="50" cy="55" r="30" fill="#F0C060" />
      {/* 目 */}
      <Circle cx="38" cy="47" r="5" fill="#3D2B1F" />
      <Circle cx="62" cy="47" r="5" fill="#3D2B1F" />
      <Circle cx="40" cy="45" r="2" fill="white" />
      <Circle cx="64" cy="45" r="2" fill="white" />
      {/* 鼻・口 */}
      <Ellipse cx="50" cy="60" rx="8" ry="6" fill="#E8A040" />
      <Circle cx="50" cy="58" r="3.5" fill="#3D2B1F" />
      <Path d="M46 63 Q50 68 54 63" stroke="#3D2B1F" strokeWidth="2" fill="none" strokeLinecap="round" />
    </Svg>
  )
}

function RabbitAvatar({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* 長い耳 */}
      <Ellipse cx="33" cy="22" rx="10" ry="22" fill="#F0E0E0" />
      <Ellipse cx="67" cy="22" rx="10" ry="22" fill="#F0E0E0" />
      <Ellipse cx="33" cy="22" rx="5" ry="17" fill="#E8A0A0" />
      <Ellipse cx="67" cy="22" rx="5" ry="17" fill="#E8A0A0" />
      {/* 顔 */}
      <Circle cx="50" cy="58" r="32" fill="#F8F0F0" />
      {/* 目 */}
      <Circle cx="38" cy="50" r="5" fill="#E06080" />
      <Circle cx="62" cy="50" r="5" fill="#E06080" />
      <Circle cx="40" cy="48" r="2" fill="white" />
      <Circle cx="64" cy="48" r="2" fill="white" />
      {/* 鼻 */}
      <Ellipse cx="50" cy="62" rx="4" ry="3" fill="#E06080" />
      {/* 口 */}
      <Path d="M46 65 Q50 70 54 65" stroke="#C04060" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d="M50 62 L50 65" stroke="#C04060" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  )
}

function DogAvatar({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* 耳（たれ耳） */}
      <Ellipse cx="22" cy="45" rx="13" ry="20" fill="#A0784A" />
      <Ellipse cx="78" cy="45" rx="13" ry="20" fill="#A0784A" />
      {/* 顔 */}
      <Circle cx="50" cy="52" r="33" fill="#C8A060" />
      {/* 口周り */}
      <Ellipse cx="50" cy="66" rx="16" ry="12" fill="#E8C888" />
      {/* 目 */}
      <Circle cx="37" cy="46" r="6" fill="#3D2B1F" />
      <Circle cx="63" cy="46" r="6" fill="#3D2B1F" />
      <Circle cx="39" cy="44" r="2.5" fill="white" />
      <Circle cx="65" cy="44" r="2.5" fill="white" />
      {/* 鼻 */}
      <Ellipse cx="50" cy="60" rx="7" ry="5" fill="#3D2B1F" />
      {/* 口 */}
      <Path d="M43 65 Q50 71 57 65" stroke="#3D2B1F" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d="M50 60 L50 65" stroke="#3D2B1F" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  )
}

function CatAvatar({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* 耳（とがった） */}
      <Path d="M20 42 L18 18 L40 36" fill="#9B9B9B" />
      <Path d="M80 42 L82 18 L60 36" fill="#9B9B9B" />
      <Path d="M23 40 L22 24 L37 36" fill="#E8C0C0" />
      <Path d="M77 40 L78 24 L63 36" fill="#E8C0C0" />
      {/* 顔 */}
      <Circle cx="50" cy="57" r="33" fill="#B0B0B0" />
      {/* 目（猫目） */}
      <Ellipse cx="37" cy="49" rx="7" ry="6" fill="#60A060" />
      <Ellipse cx="63" cy="49" rx="7" ry="6" fill="#60A060" />
      <Ellipse cx="37" cy="49" rx="3" ry="5" fill="#2D2D2D" />
      <Ellipse cx="63" cy="49" rx="3" ry="5" fill="#2D2D2D" />
      <Circle cx="39" cy="47" r="1.5" fill="white" />
      <Circle cx="65" cy="47" r="1.5" fill="white" />
      {/* 鼻 */}
      <Path d="M46 61 L50 58 L54 61 L50 64 Z" fill="#E06080" />
      {/* ひげ */}
      <Path d="M20 58 L40 61" stroke="#6B6B6B" strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M20 63 L40 63" stroke="#6B6B6B" strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M60 61 L80 58" stroke="#6B6B6B" strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M60 63 L80 63" stroke="#6B6B6B" strokeWidth="1.5" strokeLinecap="round" />
      {/* 口 */}
      <Path d="M46 64 Q50 68 54 64" stroke="#3D2B1F" strokeWidth="2" fill="none" strokeLinecap="round" />
    </Svg>
  )
}

function KoalaAvatar({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* 耳（大きい丸耳） */}
      <Circle cx="22" cy="30" r="18" fill="#808080" />
      <Circle cx="78" cy="30" r="18" fill="#808080" />
      <Circle cx="22" cy="30" r="11" fill="#B0B0B0" />
      <Circle cx="78" cy="30" r="11" fill="#B0B0B0" />
      {/* 顔 */}
      <Circle cx="50" cy="57" r="32" fill="#A0A0A0" />
      {/* 鼻（大きい） */}
      <Ellipse cx="50" cy="58" rx="13" ry="10" fill="#4A4A4A" />
      {/* 目 */}
      <Circle cx="36" cy="46" r="6" fill="#3D2B1F" />
      <Circle cx="64" cy="46" r="6" fill="#3D2B1F" />
      <Circle cx="38" cy="44" r="2.5" fill="white" />
      <Circle cx="66" cy="44" r="2.5" fill="white" />
      {/* 口 */}
      <Path d="M44 67 Q50 72 56 67" stroke="#3D2B1F" strokeWidth="2" fill="none" strokeLinecap="round" />
    </Svg>
  )
}

// ============================================================
// アバターコンポーネント（IDから描画）
// ============================================================
export const AVATAR_LIST: { id: AvatarId; label: string }[] = [
  { id: 'bear',   label: 'クマ' },
  { id: 'fox',    label: 'キツネ' },
  { id: 'panda',  label: 'パンダ' },
  { id: 'lion',   label: 'ライオン' },
  { id: 'rabbit', label: 'ウサギ' },
  { id: 'dog',    label: 'イヌ' },
  { id: 'cat',    label: 'ネコ' },
  { id: 'koala',  label: 'コアラ' },
]

export function Avatar({ id, size = 60 }: { id: AvatarId; size?: number }) {
  switch (id) {
    case 'bear':   return <BearAvatar size={size} />
    case 'fox':    return <FoxAvatar size={size} />
    case 'panda':  return <PandaAvatar size={size} />
    case 'lion':   return <LionAvatar size={size} />
    case 'rabbit': return <RabbitAvatar size={size} />
    case 'dog':    return <DogAvatar size={size} />
    case 'cat':    return <CatAvatar size={size} />
    case 'koala':  return <KoalaAvatar size={size} />
    default:       return <BearAvatar size={size} />
  }
}

// ============================================================
// アバター選択グリッド
// ============================================================
export function AvatarPicker({
  selected,
  onSelect,
}: {
  selected: AvatarId
  onSelect: (id: AvatarId) => void
}) {
  return (
    <View style={pickerStyles.grid}>
      {AVATAR_LIST.map((avatar) => (
        <TouchableOpacity
          key={avatar.id}
          style={[
            pickerStyles.item,
            selected === avatar.id && pickerStyles.itemSelected,
          ]}
          onPress={() => onSelect(avatar.id)}
          activeOpacity={0.8}
        >
          <Avatar id={avatar.id} size={56} />
          <Text style={[
            pickerStyles.label,
            selected === avatar.id && pickerStyles.labelSelected,
          ]}>
            {avatar.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const pickerStyles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  item: {
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: '22%',
  },
  itemSelected: {
    borderColor: colors.orange,
    backgroundColor: 'rgba(201,125,75,0.15)',
  },
  label: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    fontWeight: '500',
  },
  labelSelected: {
    color: colors.orange,
    fontWeight: '700',
  },
})
