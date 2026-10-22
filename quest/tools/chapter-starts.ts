// Writes the chapter starts the dev shortcut `?chapter=N` loads (src/data/starts/chapters.json): the party,
// bag, gear, gold, XP and story exactly as the scripted route (routes/zetwal-act1.json) leaves them at the
// end of the chapter before, placed where the next chapter begins. `npx tsx tools/chapter-starts.ts`;
// with --check it writes nothing and fails if the file is stale (tests/chapterStarts.test.ts runs that).

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RPG } from '../src/data/rpg.ts';
import { markShown, pendingShowcases } from '../src/engine/showcase.ts';
import { parseRoute } from '../src/engine/sim.ts';
import { QUEST_ROOT, newGameSim, readJson } from './sim-setup.ts';

export const STARTS_FILE = join(QUEST_ROOT, 'src/data/starts/chapters.json');

export interface ChapterStart {
  map: string;
  spawn: string;
  flags: Record<string, unknown>;
}

/** Each chapter's start: the route's flags at the marker, minus the pending journey, at the chapter's landing. */
const MARKS: Readonly<Record<string, { mark: string; map: string; spawn: string }>> = {
  '2': { mark: 'end-card', map: 'xaragua-village', spawn: 'pier' },
  '3': { mark: 'chapter2-end', map: 'zetwal-harbor', spawn: 'harbor_return' },
  // Chapter 4 begins on the strand at first light (the trader's ready check: beat 0).
  '4': { mark: 'chapter3-end', map: 'ardencia-camp', spawn: 'strand' },
  // Chapter 5 begins as the Dorini caravan comes in at Eightgate's Gold Gate (the caravan's arrival plays).
  '5': { mark: 'chapter4-end', map: 'seat-gateyard', spawn: 'gold_gate' },
  // Chapter 6 begins on the Winter Plateau road, the Iron Gate behind them (the arrival plays).
  '6': { mark: 'chapter5-end', map: 'skarragol-plateau', spawn: 'seat_road' },
  // Chapter 7 begins on Kirinoura's pier, off the Ironvow longship (the landing plays).
  '7': { mark: 'chapter6-end', map: 'kuroshi-pier', spawn: 'pier' },
  // Chapter 8 begins on Agnipur's harbor quay, under the great chain, off the Zetwal trader (the landing plays).
  '8': { mark: 'chapter7-end', map: 'jwaladesh-harbor', spawn: 'landing' },
  // Chapter 9 begins on the Mere Stair below Kingsmere, off the Zetwal trader (the landing plays).
  '9': { mark: 'chapter8-end', map: 'aldermoor-heath', spawn: 'mere_stair' },
  // Chapter 10 begins on Pòdlimyè's long pier after the card (the landing plays).
  '10': { mark: 'chapter9-end', map: 'zetwal-harbor', spawn: 'harbor_return' },
  // Chapter 11 begins on the Canoe Beach below Yucayeque at first light, off the fleet (Chapter 11's outline, beat 0).
  '11': { mark: 'chapter10-end', map: 'xaragua-beach', spawn: 'landing' },
};

export function chapterStarts(): Record<string, ChapterStart> {
  const route = parseRoute(readJson<string[]>('routes/zetwal-act1.json'));
  const out: Record<string, ChapterStart> = {};
  for (const [chapter, at] of Object.entries(MARKS)) {
    const sim = newGameSim();
    for (const item of route) {
      if (item.kind === 'mark' && item.name === at.mark) break;
      sim.run([item]);
    }
    // The browser shows each item's popup as it arrives; a player reaching this point has seen them all.
    for (const item of pendingShowcases(sim.logic.state.flags, RPG)) markShown(sim.logic.state.flags, item.id);
    const flags = Object.fromEntries(Object.entries(sim.logic.state.flags.snapshot()).filter(([k]) => k !== 'travel.next' && k !== 'voyage.next').sort(([a], [b]) => a.localeCompare(b)));
    out[chapter] = { map: at.map, spawn: at.spawn, flags };
  }
  return out;
}

export function startsText(): string {
  return `${JSON.stringify(chapterStarts(), null, 2)}\n`;
}

const isMain = process.argv[1] !== undefined && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const text = startsText();
  if (process.argv.includes('--check')) {
    let now = '';
    try {
      now = readFileSync(STARTS_FILE, 'utf8');
    } catch {
      // missing
    }
    if (now !== text) {
      console.error('Out of date (run npx tsx tools/chapter-starts.ts): src/data/starts/chapters.json');
      process.exit(1);
    }
    console.log('Chapter starts are up to date.');
  } else {
    writeFileSync(STARTS_FILE, text);
    console.log(`wrote ${STARTS_FILE}`);
  }
}
