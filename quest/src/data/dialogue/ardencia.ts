// Chapter 3, Ardencia: The Trial of Blades (docs/quest/reviews/2026-10-20-chapter3-outline.md, its review and the
// owner's decisions). Written with the maps in tools/maps/ardencia.ts.

import type { DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';

function simple(id: string, lines: DialogueLine[], set?: DialogueNode['set']): DialogueScript {
  return { id, start: 'start', nodes: { start: { lines, set } } };
}

export const ARDENCIA_DIALOGUE: readonly DialogueScript[] = [
  simple('rael_after', [{ speaker: '', text: 'The court is quiet. Cords at every wrist.' }]),
];
