// The goddess's words on the Game Over screen (docs/quest/intro/GAME-OVER-STORYBOARD.md, approved by the owner,
// Oct 19). She speaks only to her descendants (ART-PROMPTS.md section 1). Her name appears only in her own
// first-meeting line; everywhere else (code, files, labels) she is "the goddess". engine/gameOver.ts picks the
// lines by the count; scenes/GameOverScene.ts shows them.

import type { GoddessWords } from '../engine/gameOver.ts';

export const GODDESS_WORDS: GoddessWords = {
  /** The first time Gianna falls: she introduces herself, and Gianna asks about her mother's name. */
  firstMeeting: [
    { speaker: 'goddess', text: 'Rise, child of the Limyè line. You do not know me, but I have known you since your first breath.' },
    { speaker: 'goddess', text: 'I am Elodie. I wove this realm, and I remember all of it.' },
    { speaker: 'gianna', text: 'Elodie? Like my mother?' },
    {
      speaker: 'goddess',
      text: 'Your grandmother gave her my name the night she was born, and asked me to watch over her. I have. I watch over you too.',
    },
    { speaker: 'goddess', text: 'I do not rule this world. I only remember it. So I will give you back the moment before.' },
    { speaker: 'goddess', text: 'Go. Walk, mend, make ready. The fight will wait for you.' },
  ],
  /** Every time after: the first line by the count ({n}), then the closing line. */
  few: 'I have caught you {n} times now. I remember every one.',
  many: '{n} times. I remember every fall, and every time you stood again.',
  closing: 'Go. Walk, mend, make ready. The fight will wait for you.',
};

/** The screen's own words (buttons and the count's caption) and the battle's Grudge line. */
export const GAME_OVER_TEXT = {
  countLabel: 'Times fallen',
  rise: 'Rise',
  skip: 'Skip',
  /** Gianna's name over her one line (the goddess has no name box). */
  gianna: 'Gianna',
  /** The toast back on the map. */
  back: 'Back before the fight.',
  /** At the start of a fight lost before ({p}: the bonus in percent). */
  grudge: 'Grudge +{p}%: every blow lands harder this time.',
} as const;
