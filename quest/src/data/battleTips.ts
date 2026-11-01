// The first-time battle tips (the Nov 1 playtests: Spark, Surge, MARK and Swap were never explained to a player who
// had not met them in the boar fight). Each shows once per save, as one tutorial page, the first turn its thing is on
// screen (engine/battleLayout.ts dueTip). Short on purpose: one idea each.

import { BATTLE_ACTIVE, SPARK_MAX, SPARK_ON_GUARD, STATUS, SURGE_COST } from '../config.ts';
import type { BattleTipId } from '../engine/battleLayout.ts';
import type { TutorialPage } from '../engine/battle.ts';

const markedPct = Math.round((STATUS.marked.taken - 1) * 100);

export const BATTLE_TIPS: Readonly<Record<BattleTipId, TutorialPage>> = {
  spark: {
    title: "Anissa's Spark",
    text: `The ${SPARK_MAX} pips over Anissa are her Spark. Each thing Gianna does adds one (Guard adds ${SPARK_ON_GUARD}). Anissa never fights and can never be hit.`,
  },
  surge: {
    title: 'Surge',
    text: `Anissa's Spark has reached ${SURGE_COST}: Surge is at the top of the commands. It is free, and Gianna's next blow or spell hits half again as hard.`,
  },
  mark: {
    title: 'Marks under a name',
    text: `Short tags show what is on a fighter: an up arrow helps, a down arrow harms. MARK means every blow on them hits ${markedPct}% harder for a few turns.`,
  },
  swap: {
    title: 'Swap',
    text: `Up to ${BATTLE_ACTIVE} fight at once. Swap trades the fighter whose turn it is for someone waiting; it takes the turn. The fallen are replaced at once.`,
  },
};

/** An older page that already taught the same thing (the boar fight's lesson): the tip is not shown again. */
export const TIP_TAUGHT_BY: Readonly<Partial<Record<BattleTipId, readonly string[]>>> = {
  spark: ['tutorial.intro_boar.spark', 'tutorial.intro_boar.light'],
  surge: ['tutorial.intro_boar.spark'],
};
