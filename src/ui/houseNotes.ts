// House rules that aren't abilities (The Long Watch, Rit Solèy...), from src/data's GEN_NOTES ("Name: text").
import { GEN_NOTES } from '../data/houses';
import type { HouseId } from '../engine/types';

export const houseNotes = (house: HouseId): { gen: number; name: string; text: string }[] =>
  Object.entries(GEN_NOTES[house] ?? {}).map(([gen, t]) => {
    const [name, ...rest] = (t as string).split(': ');
    return { gen: Number(gen), name, text: rest.join(': ') };
  });
