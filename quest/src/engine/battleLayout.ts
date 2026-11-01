// What the battle screen shows and where (the Nov 1 playtests; Claude's call, recorded in docs/quest/design/COMBAT.md
// section 1.2). Pure TypeScript: no Phaser, no DOM; scenes/BattleScene.ts measures the text and draws what this decides.
//
// - Short names: "Crown Marine A" is "Marine A" in the turn order and over the foe; the full name and level show in the
//   band while choosing a target.
// - Name plates: each foe's short name and HP bar sit just over its head; a plate that would cover another plate, another
//   fighter or the edges moves aside, then below the feet, then a little higher; one that fits nowhere is left out (the
//   foe keeps a thin HP bar at its feet, and its name shows in the target list). Plates never overlap, at 1 to 6 foes.
// - The turn order shows as many whole entries as fit (never a name cut short).
// - A skill's price says "3 SP" (or "40 g"); a weapon move that is not ready says "ready in 2". Never a bare number.
// - First-time tips (Spark, Surge, MARK, Swap): each once per save, at the first turn it matters.

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function overlaps(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

/**
 * The name a fighter goes by in tight places: the last word of the name ("Governor Thorne" -> "Thorne", "Crown Marine"
 * -> "Marine"), or the first before "of" or "in" ("Musketeer in a Breastplate" -> "Musketeer"), without a note in
 * brackets, capitalised; a duplicate's letter stays on, after a word ("Crown Marine B" -> "Marine B").
 */
export function shortName(name: string): string {
  const words = name.replace(/\s*\(.*?\)\s*/g, ' ').trim().split(/\s+/);
  const letter = words.length > 1 && /^[A-Z]$/.test(words[words.length - 1]!) ? words.pop()! : '';
  const cut = words.findIndex((w, i) => i > 0 && (w === 'of' || w === 'in'));
  const word = cut > 0 ? words[cut - 1]! : words[words.length - 1]!;
  const base = word.charAt(0).toUpperCase() + word.slice(1);
  return letter ? `${base} ${letter}` : base;
}

/** One foe to label: its key, its body (the picture's visible part, game pixels) and its plate's size. */
export interface PlateRequest {
  key: string;
  body: Rect;
  w: number;
  h: number;
}

/**
 * Where each foe's plate goes (its top-left), or null when it fits nowhere. `obstacles` are other things plates must not
 * cover (the party's fighters); `area` is where plates may go (between the message band and the strip). Requests are
 * placed in order (the leader first, then by slot), so a plate never moves because another foe was targeted.
 */
export function placePlates(requests: readonly PlateRequest[], obstacles: readonly Rect[], area: Rect): Map<string, Rect | null> {
  const out = new Map<string, Rect | null>();
  const placed: Rect[] = [];
  const inside = (r: Rect) => r.x >= area.x && r.y >= area.y && r.x + r.w <= area.x + area.w && r.y + r.h <= area.y + area.h;
  for (const q of requests) {
    const cx = Math.round(q.body.x + q.body.w / 2 - q.w / 2);
    const above = q.body.y - q.h - 1;
    const below = q.body.y + q.body.h + 1;
    const candidates: Array<[number, number]> = [];
    for (const dx of [0, -6, 6, -12, 12]) candidates.push([cx + dx, above]);
    candidates.push([cx, below]);
    for (const up of [4, 8, 12]) for (const dx of [0, -8, 8]) candidates.push([cx + dx, above - up]);
    const bodies = requests.filter((o) => o !== q).map((o) => o.body);
    let spot: Rect | null = null;
    for (const [x0, y0] of candidates) {
      // Pulled inside the edges first (a foe at the right edge keeps its plate on screen).
      const x = Math.max(area.x, Math.min(area.x + area.w - q.w, x0));
      const r = { x, y: y0, w: q.w, h: q.h };
      if (!inside(r) || overlaps(r, q.body)) continue;
      if (placed.some((p) => overlaps(r, p)) || bodies.some((b) => overlaps(r, b)) || obstacles.some((o) => overlaps(r, o))) continue;
      spot = r;
      break;
    }
    out.set(q.key, spot);
    if (spot) placed.push(spot);
  }
  return out;
}

/** How many entries of the turn order fit in `room` px (whole entries only; `gap` between them). */
export function queueFit(widths: readonly number[], room: number, gap: number): number {
  let used = 0;
  for (let i = 0; i < widths.length; i++) {
    used += (i > 0 ? gap : 0) + widths[i]!;
    if (used > room) return i;
  }
  return widths.length;
}

/** A skill's price beside its name: "3 SP", or gold for one paid in coins ("40 g"). */
export function costTag(sp: number, gold = 0): string {
  return gold ? `${gold} g` : `${sp} SP`;
}

/** A weapon move's wait beside its name: "ready in 2" (turns), or nothing when it is ready. */
export function waitTag(turns: number): string {
  return turns > 0 ? `ready in ${turns}` : '';
}

/** The first-time battle tips (data/battleTips.ts has their pages). */
export type BattleTipId = 'spark' | 'surge' | 'mark' | 'swap';

export const BATTLE_TIP_ORDER: readonly BattleTipId[] = ['spark', 'surge', 'mark', 'swap'];

/** The save flag that remembers a tip was shown. */
export function battleTipFlag(id: BattleTipId): string {
  return `tutorial.tip.${id}`;
}

/**
 * The tip to show now, when the player is about to choose: the first in BATTLE_TIP_ORDER whose thing is on screen and
 * that this save has not seen. `seen` answers for a tip id (its flag, or an older page that taught the same).
 */
export function dueTip(now: { anissa: boolean; surge: boolean; marked: boolean; swap: boolean }, seen: (id: BattleTipId) => boolean): BattleTipId | null {
  const on: Record<BattleTipId, boolean> = { spark: now.anissa, surge: now.surge, mark: now.marked, swap: now.swap };
  return BATTLE_TIP_ORDER.find((id) => on[id] && !seen(id)) ?? null;
}
