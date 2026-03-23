// ============================================================
// PAPA STAND - デザイントークン
// ============================================================

export const colors = {
  navy:        '#1a2744',
  navyLight:   '#243258',
  beige:       '#f5efe6',
  beigeDeep:   '#ede3d5',
  orange:      '#c97d4b',
  orangeLight: '#e8a070',
  sage:        '#7a9e8e',
  sageLight:   '#a8c4b8',
  text:        '#2d2d2d',
  textMuted:   '#6b6b6b',
  white:       '#ffffff',
  border:      '#ddd6c8',

  // セマンティック
  struggle: { bg: '#fde8d8', text: '#b84a09' },
  question: { bg: '#d8e8f8', text: '#1a47a0' },
  win:      { bg: '#d8f0e0', text: '#176e38' },
  share:    { bg: '#f0ead8', text: '#7a5e0e' },
}

export const spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  24,
  xxl: 32,
}

export const radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  full: 999,
}

export const fontSize = {
  xs:   11,
  sm:   12,
  md:   14,
  lg:   16,
  xl:   18,
  xxl:  22,
  hero: 32,
}

export const fontWeight = {
  regular: '400' as const,
  medium:  '500' as const,
  bold:    '700' as const,
}
