// Anissa's hints (guide 6.2 rule 4): after the player has been stuck on one objective for a while,
// she offers a hint, then clearer ones, ending with the answer. Pure timing rule; the field scene
// feeds it play time and shows what it says. The player can turn hints off in the menu.

export interface HintTiming {
  /** Play time on one objective before the first hint. */
  firstMs: number;
  /** Play time between later hints. */
  repeatMs: number;
}

/** How many hints are due after `stuckMs` on an objective that has `count` hints (0 = none yet). */
export function hintsDue(stuckMs: number, count: number, timing: HintTiming): number {
  if (count <= 0 || stuckMs < timing.firstMs) return 0;
  const later = timing.repeatMs > 0 ? Math.floor((stuckMs - timing.firstMs) / timing.repeatMs) : count;
  return Math.min(count, 1 + later);
}

/**
 * Tracks time on the current objective. Call `tick` with play time (not while a menu is open) and
 * the current objective id; it returns the hint index to show now, or null.
 */
export class HintTracker {
  private objective: string | null = null;
  private stuckMs = 0;
  private shown = 0;
  private readonly timing: HintTiming;

  constructor(timing: HintTiming) {
    this.timing = timing;
  }

  get stuckFor(): number {
    return this.stuckMs;
  }

  tick(deltaMs: number, objectiveId: string | null, hintCount: number): number | null {
    if (objectiveId !== this.objective) {
      this.objective = objectiveId;
      this.stuckMs = 0;
      this.shown = 0;
    }
    if (objectiveId === null) return null;
    this.stuckMs += deltaMs;
    const due = hintsDue(this.stuckMs, hintCount, this.timing);
    if (due > this.shown) {
      this.shown = due;
      return due - 1;
    }
    return null;
  }

  /** The hint to give when the player asks: the latest one due, or the first. */
  onRequest(hintCount: number): number | null {
    if (hintCount <= 0) return null;
    return Math.max(0, hintsDue(this.stuckMs, hintCount, this.timing) - 1);
  }
}
