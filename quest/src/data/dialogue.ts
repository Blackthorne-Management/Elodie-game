// Dialogue content: the Phase 1 test village (placeholder lines that exercise the dialogue system)
// plus Act I, Zetwal (data/dialogue/zetwal.ts).

import type { DialogueScript } from '../engine/dialogue.ts';
import { SHELF_DIALOGUE } from './books.ts';
import { ZETWAL_DIALOGUE } from './dialogue/zetwal.ts';

const TEST_VILLAGE: Readonly<Record<string, DialogueScript>> = {
  villager_talk: {
    id: 'villager_talk',
    start: 'start',
    nodes: {
      start: {
        lines: [],
        next: [{ if: { flag: 'villager.met' }, to: 'again' }, { to: 'first' }],
      },
      first: {
        speaker: 'villager',
        set: { 'villager.met': true },
        lines: [
          { text: 'Oh, hello! You must be new to this test village.' },
          { text: 'Nothing here is final. The houses, the trees, even me: all placeholders.' },
          { text: 'May I give you a tip?' },
        ],
        choices: [
          { text: 'Yes, please.', set: { 'villager.answer': 'yes' }, next: 'tip' },
          { text: 'Not now.', set: { 'villager.answer': 'no' }, next: 'later' },
        ],
      },
      tip: {
        speaker: 'villager',
        lines: [{ text: 'Hold B (or Shift) while you walk to run. Saves a lot of time!' }],
      },
      later: {
        speaker: 'villager',
        lines: [{ text: 'No trouble. I will be right here.' }],
      },
      again: {
        speaker: 'villager',
        lines: [
          { if: { flag: 'villager.answer', eq: 'yes' }, text: 'Back again? Remember: hold B to run.' },
          { if: { flag: 'villager.answer', eq: 'no' }, text: 'Changed your mind about that tip?' },
          { if: { flag: 'keeper.met' }, text: 'I see you met the Temple Keeper. Good.' },
          { if: { notFlag: 'keeper.met' }, text: 'The Temple Keeper up north likes visitors.' },
        ],
        choices: [
          { if: { flag: 'villager.answer', eq: 'no' }, text: 'Tell me the tip.', set: { 'villager.answer': 'yes' }, next: 'tip' },
          { text: 'Goodbye.' },
        ],
      },
    },
  },

  keeper_talk: {
    id: 'keeper_talk',
    start: 'start',
    nodes: {
      start: {
        speaker: 'keeper',
        set: { 'keeper.met': true },
        lines: [
          { text: '[Placeholder greeting in a local language]', translation: 'Peace to you, traveller.' },
          { if: { flag: 'villager.met' }, text: 'You have already met the Villager, I see.' },
          { if: { notFlag: 'villager.met' }, text: 'Have you met the Villager by the well? Say hello.' },
          { if: { notFlag: 'sign.plaza_read' }, text: 'Read the sign by the plaza when you pass it.' },
          { if: { flag: 'sign.plaza_read' }, text: 'Those shimmering tiles are only a marker for now.' },
        ],
      },
    },
  },

  fisher_talk: {
    id: 'fisher_talk',
    start: 'start',
    nodes: {
      start: {
        lines: [],
        next: [{ if: { flag: 'fisher.cheered' }, to: 'cheered' }, { to: 'first' }],
      },
      first: {
        speaker: 'fisher',
        lines: [{ text: 'The fish are not biting today.' }],
        choices: [
          { text: 'Keep trying!', set: { 'fisher.cheered': true }, next: 'thanks' },
          { text: 'Goodbye.' },
        ],
      },
      thanks: {
        speaker: 'fisher',
        lines: [{ text: 'Ha! Thank you. I will.' }],
      },
      cheered: {
        speaker: 'fisher',
        lines: [{ text: 'Still nothing. But I am in a good mood, thanks to you.' }],
      },
    },
  },

  sign_plaza: {
    id: 'sign_plaza',
    start: 'start',
    nodes: {
      start: {
        speaker: 'sign',
        lines: [
          { text: 'TEST PLAZA. The shimmering tiles mark an Echo Zone.' },
          { text: '(Stand on them and press Echo to see this place fifty years ago.)' },
        ],
      },
    },
  },

  house_note: {
    id: 'house_note',
    start: 'start',
    nodes: {
      start: {
        lines: [{ text: 'An empty room. Furniture comes later.' }],
      },
    },
  },

  marker_echo: {
    id: 'marker_echo',
    start: 'start',
    nodes: {
      start: {
        lines: [{ text: 'A fresh wooden marker. Carve your mark into it?' }],
        choices: [{ text: 'Carve it.', set: { 'anchor.old_marker': true }, next: 'carved' }, { text: 'Leave it.' }],
      },
      carved: { lines: [{ text: 'Carved. (An anchor: it will still be here in the present.)' }] },
    },
  },

  marker_present: {
    id: 'marker_present',
    start: 'start',
    nodes: { start: { lines: [{ text: 'An old stone marker, worn smooth. Your mark is still on it.' }] } },
  },
};

export const DIALOGUE: Readonly<Record<string, DialogueScript>> = {
  ...TEST_VILLAGE,
  ...Object.fromEntries(ZETWAL_DIALOGUE.map((d) => [d.id, d])),
  ...SHELF_DIALOGUE,
};

export const DIALOGUE_IDS: readonly string[] = Object.keys(DIALOGUE);
