import type { CSSProperties } from 'react';

// Palette & helpers — Virtualia Refonte V3 (Minecraft médiéval + VTuber)
export const C = {
  parchment: '#ece0c4',
  parchmentLight: '#f4ebd6',
  parchmentDark: '#e2d4b2',
  ink: '#2e2417',
  inkSoft: '#5a4a33',
  woodDark: '#3a2a18',
  wood: '#6b4a2b',
  woodBar1: '#7b5630',
  woodBar2: '#5e4022',
  grass: '#76ad44',
  grassDark: '#5a8233',
  grassBorder: '#2e4a18',
  ember: '#e0772c',
  gold: '#e0a435',
  amethyst: '#7b4ea8',
  amethystBorder: '#43275f',
  red: '#d22e2e',
  cream: '#f4ebd6',
} as const;

export const FONT = {
  pixel: "'Pixelify Sans', system-ui, sans-serif",
  arcade: "'Press Start 2P', system-ui, sans-serif",
  body: "'Fredoka', system-ui, sans-serif",
} as const;

// Bevel "bloc Minecraft" réutilisable
export const bevel = (bg: string, border: string, depth = 4): CSSProperties => ({
  background: bg,
  border: `${depth}px solid ${border}`,
  boxShadow: `inset -${depth}px -${depth}px 0 rgba(0,0,0,.25), inset ${depth}px ${depth}px 0 rgba(255,255,255,.35), 0 ${depth + 2}px 0 ${border}`,
});

export const panel = (bg?: "#f4ebd6", depth = 4): React.CSSProperties => ({
  background: bg,
  border: `${depth}px solid ${C.woodDark}`,
  borderRadius: 6,
  boxShadow: `inset -${depth}px -${depth}px 0 rgba(58,42,24,.16), inset ${depth}px ${depth}px 0 rgba(255,255,255,.5), 0 ${depth + 2}px 0 rgba(58,42,24,.3)`,
});
