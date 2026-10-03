// Every visual asset in one place. The art pass replaces entries here (e.g. `crest` with an image
// URL) without touching game logic or components. Placeholders: color blocks, initials and glyphs.
import type { HouseId, Pillar, TileType } from './engine/types';

export interface HouseArt {
  color: string;      // pawn, crest and chip color
  initial: string;    // shown on pawns and crests
  crest?: string;     // future: image URL for the crest
  pawn?: string;      // future: image URL for the pawn
}

export const HOUSE_ART: Record<HouseId, HouseArt> = {
  brasador: { color: '#b03a2e', initial: 'B' },
  dorini: { color: '#b7950b', initial: 'D' },
  ironvow: { color: '#5d6d7e', initial: 'I' },
  suzumori: { color: '#7d3c98', initial: 'S' },
  vaitama: { color: '#138d75', initial: 'V' },
  kaysoley: { color: '#d4ac0d', initial: 'K' },
  agnivansh: { color: '#e67e22', initial: 'A' },
  stillwater: { color: '#2e86c1', initial: 'W' },
};

export const TILE_ART: Record<TileType, { color: string; glyph: string; label: string }> = {
  court: { color: '#3f6fb5', glyph: 'C', label: 'Court' },
  war: { color: '#a83232', glyph: 'W', label: 'War' },
  trade: { color: '#c9962b', glyph: 'T', label: 'Trade' },
};

export const PILLAR_ART: Record<Pillar, { glyph: string; color: string; label: string }> = {
  influence: { glyph: '♔', color: '#6f9be0', label: 'Influence' },
  fear: { glyph: '⚔', color: '#e06f6f', label: 'Fear' },
  wealth: { glyph: '◈', color: '#e0b84f', label: 'Wealth' },
};

export const ICONS = {
  heart: '♥',
  throne: '♛',
  specter: '☾',
  grudge: '✖',
  eligible: '♛',
  dice: '⚄',
};

export const BOARD_ART = {
  light: '#2a2026',
  dark: '#251c21',
  grid: '#3a2d33',
  throne: '#5a1620',
  throneEdge: '#d9a441',
  highlight: '#f3d27a',
};

export const CARD_ART = {
  back: '#3a1d24',
  hand: '#2b2f3a',
  instant: '#3a2b1f',
  elodieBorder: '#d9a441',   // the 10 Elodie cards get a gold border (future: distinct card back)
  image: undefined as string | undefined,
};
