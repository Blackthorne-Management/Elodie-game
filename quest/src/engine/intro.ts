// The animated intro (docs/quest/intro/STORYBOARD.md): when it plays, what each press does, and the
// title loop at its end. Pure TypeScript; scenes/IntroScene.ts plays the video and asks this module what
// to do. Tested in tests/intro.test.ts.

import { INTRO_END_S, INTRO_LOOP_MARGIN_S, INTRO_TITLE_LOOP_START_S } from '../config.ts';

/**
 * Where the intro opens. The whole film plays once on a device; after that (seen or skipped), or with a
 * saved game, the app opens on the title (owner request, Oct 16). "Watch the intro" in the menu plays
 * it all again.
 */
export type IntroOpening = 'full' | 'title';

export function introOpening(hasSave: boolean, seen = false): IntroOpening {
  return hasSave || seen ? 'title' : 'full';
}

/** The device remembers that the intro was seen under this key. */
export const INTRO_SEEN_KEY = 'bloodlines-quest.intro-seen';

/** `start`: waiting for a first tap (a browser plays sound only after one); `film`: the story; `title`: the title loop. */
export type IntroPhase = 'start' | 'film' | 'title';

export type IntroPress = 'confirm' | 'cancel';

export type IntroAction =
  | { kind: 'play'; from: number }
  | { kind: 'seek'; to: number }
  | { kind: 'done' }
  | { kind: 'none' };

/** Where the video starts for an opening. */
export function introStartTime(opening: IntroOpening): number {
  return opening === 'title' ? INTRO_TITLE_LOOP_START_S : 0;
}

/** Which phase a playing video is in at a time. */
export function introPhaseAt(time: number): Exclude<IntroPhase, 'start'> {
  return time >= INTRO_TITLE_LOOP_START_S ? 'title' : 'film';
}

/**
 * What a press does. Waiting to start: either button starts the video. During the story: B skips to
 * the title; A does nothing (so a stray tap never throws the film away). On the title: A goes on into
 * the quest; B does nothing.
 */
export function introPress(phase: IntroPhase, press: IntroPress, opening: IntroOpening): IntroAction {
  switch (phase) {
    case 'start':
      return { kind: 'play', from: introStartTime(opening) };
    case 'film':
      return press === 'cancel' ? { kind: 'seek', to: INTRO_TITLE_LOOP_START_S } : { kind: 'none' };
    case 'title':
      return press === 'confirm' ? { kind: 'done' } : { kind: 'none' };
  }
}

/** The title loop: at (or past) the end, the time to jump back to; null while there is film left. */
export function introLoopSeek(time: number, ended = false): number | null {
  return ended || time >= INTRO_END_S - INTRO_LOOP_MARGIN_S ? INTRO_TITLE_LOOP_START_S : null;
}
