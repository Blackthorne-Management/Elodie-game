import type { Species } from '../engine/types';

// Milestone 3: one Common per weather type. The other 35 Skylings come in milestone 7.
// Names for stages 2 and 3 are placeholders until the Build Guide roster is added.
export const SPECIES: Species[] = [
  {
    id: 'puffwhisk', names: ['Puffwhisk', 'Puffwing', 'Puffgale'],
    type: 'gale', role: 'attack', rarity: 'common',
    baseStats: { hp: 95, attack: 22, defense: 13, speed: 19 },
    moves: { basic: 'puff', skill: 'whirlwind', ultimate: 'tempest' },
    personality: 'Never sits still. Chases its own tail feathers in circles.',
    favoriteWeather: 'A breezy afternoon',
  },
  {
    id: 'raindart', names: ['Raindart', 'Rainglide', 'Rainlord'],
    type: 'rain', role: 'healing', rarity: 'common',
    baseStats: { hp: 105, attack: 17, defense: 15, speed: 14 },
    moves: { basic: 'splash', skill: 'soothingRain', ultimate: 'monsoon' },
    personality: 'Gentle and a little shy. Hums when it is happy.',
    favoriteWeather: 'Soft spring drizzle',
  },
  {
    id: 'glimmit', names: ['Glimmit', 'Glimmer', 'Glimmaron'],
    type: 'sun', role: 'attack', rarity: 'common',
    baseStats: { hp: 92, attack: 23, defense: 13, speed: 16 },
    moves: { basic: 'glint', skill: 'sunflare', ultimate: 'solarBurst' },
    personality: 'Loves to show off. Sparkles brightest when someone is watching.',
    favoriteWeather: 'A cloudless noon',
  },
  {
    id: 'shardling', names: ['Shardling', 'Shardwing', 'Shardcrest'],
    type: 'frost', role: 'support', rarity: 'common',
    baseStats: { hp: 100, attack: 19, defense: 16, speed: 12 },
    moves: { basic: 'iceChip', skill: 'frostbite', ultimate: 'blizzard' },
    personality: 'Calm and clever. Collects pretty icicles.',
    favoriteWeather: 'The first frost of winter',
  },
  {
    id: 'brambit', names: ['Brambit', 'Bramblehop', 'Bramblethorn'],
    type: 'bloom', role: 'shield', rarity: 'common',
    baseStats: { hp: 115, attack: 17, defense: 19, speed: 10 },
    moves: { basic: 'thornPoke', skill: 'barkShield', ultimate: 'overgrowth' },
    personality: 'Brave and protective. Always stands in front of its friends.',
    favoriteWeather: 'Warm rain after sunshine',
  },
];

export const speciesById = (id: string): Species => {
  const sp = SPECIES.find(s => s.id === id);
  if (!sp) throw new Error(`Unknown species: ${id}`);
  return sp;
};
