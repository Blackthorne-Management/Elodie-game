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
  dorini: { color: '#1e8449', initial: 'D' },
  ironvow: { color: '#5d6d7e', initial: 'I' },
  suzumori: { color: '#7d3c98', initial: 'S' },
  vaitama: { color: '#17a5a5', initial: 'V' },
  kaysoley: { color: '#d4ac0d', initial: 'K' },
  agnivansh: { color: '#e67e22', initial: 'A' },
  stillwater: { color: '#2e86c1', initial: 'W' },
};

// One portrait per house per generation (I-IV). Add an image URL (e.g. '/portraits/brasador-1.png')
// and it replaces the placeholder silhouette everywhere: character card, duel screen, 2.5D tokens.
export const PORTRAITS: Record<HouseId, [string?, string?, string?, string?]> = {
  brasador: [], dorini: [], ironvow: [], suzumori: [], vaitama: [], kaysoley: [], agnivansh: [], stillwater: [],
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
  newborn: '🛡',
};

// Each house's homeland, drawn as terrain around its tile. `mark` is the texture drawn on top.
export type TerrainMark = 'peaks' | 'dunes' | 'tufts' | 'waves' | 'mist' | 'rays' | 'embers' | 'heather' | 'stone';
export interface TerrainArt { name: string; base: string; ink: string; mark: TerrainMark }

export const TERRAIN_ART: Record<HouseId | 'heartland', TerrainArt> = {
  brasador: { name: 'Ardencia', base: '#4a2a24', ink: '#a5523c', mark: 'peaks' },
  dorini: { name: 'Al-Doria', base: '#5a4a2c', ink: '#a88d4c', mark: 'dunes' },
  ironvow: { name: 'Skarragol', base: '#33403e', ink: '#6f8a84', mark: 'tufts' },
  suzumori: { name: 'Kuroshi', base: '#2f3442', ink: '#6a7390', mark: 'mist' },
  vaitama: { name: "Moa'olani", base: '#1f4446', ink: '#3f9490', mark: 'waves' },
  kaysoley: { name: 'Zetwal', base: '#4f4a26', ink: '#a89842', mark: 'rays' },
  agnivansh: { name: 'Jwaladesh', base: '#4d3220', ink: '#b0703a', mark: 'embers' },
  stillwater: { name: 'Aldermoor', base: '#3a3044', ink: '#7d6490', mark: 'heather' },
  heartland: { name: 'The Heartland', base: '#3a3434', ink: '#5c5454', mark: 'stone' },
};

export const BOARD_ART = {
  // The painted board (docs/art/ART-GUIDE.md §3). Without it, the drawn homeland terrain is used.
  image: '/art/board.webp' as string | undefined,
  // Squares of ocean the painting includes on each side of the 18 × 18 board (0 = the image is just the board).
  imageMargin: 0,
  light: '#2a2026',
  dark: '#251c21',
  grid: 'rgba(0,0,0,.28)',
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
