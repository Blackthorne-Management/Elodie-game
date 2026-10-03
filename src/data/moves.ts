import type { Move } from '../engine/types';

// Placeholder numbers until they are tuned against the Build Guide.
// power 1 is a plain hit; damage moves on all enemies use less power.
const list: Move[] = [
  // Puffwhisk (gale, attack)
  { id: 'puff', name: 'Puff', slot: 'basic', cooldown: 0,
    effects: [{ kind: 'damage', power: 1, target: 'enemy' }] },
  { id: 'whirlwind', name: 'Whirlwind', slot: 'skill', cooldown: 3,
    effects: [{ kind: 'damage', power: 0.6, target: 'allEnemies' },
              { kind: 'status', status: 'spdUp', chance: 1, turns: 2, target: 'self' }] },
  { id: 'tempest', name: 'Tempest', slot: 'ultimate', cooldown: 5,
    effects: [{ kind: 'damage', power: 0.5, target: 'enemy', hits: 3 }] },

  // Raindart (rain, healing)
  { id: 'splash', name: 'Splash', slot: 'basic', cooldown: 0,
    effects: [{ kind: 'damage', power: 0.9, target: 'enemy' }] },
  { id: 'soothingRain', name: 'Soothing Rain', slot: 'skill', cooldown: 3,
    effects: [{ kind: 'heal', percent: 0.2, target: 'allAllies' }] },
  { id: 'monsoon', name: 'Monsoon', slot: 'ultimate', cooldown: 5,
    effects: [{ kind: 'heal', percent: 0.3, target: 'allAllies' },
              { kind: 'status', status: 'regen', chance: 1, turns: 3, target: 'allAllies' }] },

  // Glimmit (sun, attack)
  { id: 'glint', name: 'Glint', slot: 'basic', cooldown: 0,
    effects: [{ kind: 'damage', power: 1, target: 'enemy' }] },
  { id: 'sunflare', name: 'Sunflare', slot: 'skill', cooldown: 3,
    effects: [{ kind: 'damage', power: 1.4, target: 'enemy' },
              { kind: 'status', status: 'burn', chance: 0.5, turns: 3, target: 'enemy' }] },
  { id: 'solarBurst', name: 'Solar Burst', slot: 'ultimate', cooldown: 5,
    effects: [{ kind: 'damage', power: 1, target: 'allEnemies' },
              { kind: 'status', status: 'burn', chance: 0.3, turns: 3, target: 'allEnemies' }] },

  // Shardling (frost, support)
  { id: 'iceChip', name: 'Ice Chip', slot: 'basic', cooldown: 0,
    effects: [{ kind: 'damage', power: 0.9, target: 'enemy' },
              { kind: 'status', status: 'chill', chance: 0.2, turns: 2, target: 'enemy' }] },
  { id: 'frostbite', name: 'Frostbite', slot: 'skill', cooldown: 3,
    effects: [{ kind: 'damage', power: 1, target: 'enemy' },
              { kind: 'status', status: 'freeze', chance: 0.35, turns: 2, target: 'enemy' }] },
  { id: 'blizzard', name: 'Blizzard', slot: 'ultimate', cooldown: 5,
    effects: [{ kind: 'damage', power: 0.8, target: 'allEnemies' },
              { kind: 'status', status: 'chill', chance: 1, turns: 2, target: 'allEnemies' }] },

  // Brambit (bloom, shield)
  { id: 'thornPoke', name: 'Thorn Poke', slot: 'basic', cooldown: 0,
    effects: [{ kind: 'damage', power: 0.9, target: 'enemy' }] },
  { id: 'barkShield', name: 'Bark Shield', slot: 'skill', cooldown: 3,
    effects: [{ kind: 'shield', percent: 0.15, turns: 2, target: 'allAllies' },
              { kind: 'status', status: 'taunt', chance: 1, turns: 2, target: 'self' }] },
  { id: 'overgrowth', name: 'Overgrowth', slot: 'ultimate', cooldown: 5,
    effects: [{ kind: 'status', status: 'root', chance: 0.5, turns: 2, target: 'allEnemies' },
              { kind: 'status', status: 'defUp', chance: 1, turns: 3, target: 'allAllies' }] },

  // Galebeak (gale region boss)
  { id: 'talonSwipe', name: 'Talon Swipe', slot: 'basic', cooldown: 0,
    effects: [{ kind: 'damage', power: 1, target: 'enemy' }] },
  { id: 'cyclone', name: 'Cyclone', slot: 'skill', cooldown: 3,
    effects: [{ kind: 'damage', power: 0.7, target: 'allEnemies' },
              { kind: 'status', status: 'blind', chance: 0.3, turns: 2, target: 'allEnemies' }] },
  { id: 'skyrend', name: 'Skyrend', slot: 'ultimate', cooldown: 5,
    effects: [{ kind: 'damage', power: 2, target: 'enemy' }] },
];

export const MOVES: Record<string, Move> = Object.fromEntries(list.map(m => [m.id, m]));
