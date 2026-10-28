// The Reduce motion setting (System menu; Claude's call, Oct 28): no screen shake, no full-screen flashes, shorter
// camera glides, a still Game Over. A setting of this device, like the text size and the quest arrows, so saves and
// save codes stay as they are. Until the player chooses, it follows the device's own setting
// (prefers-reduced-motion). The rules themselves live in engine/accessibility.ts.

const STORAGE_KEY = 'bq.reduceMotion';

let sessionValue: boolean | null = null;

function deviceAsks(): boolean {
  try {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  } catch {
    return false;
  }
}

function stored(): boolean | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'on' ? true : v === 'off' ? false : null;
  } catch {
    return null; // storage blocked (a private tab)
  }
}

/** The setting now: chosen this session, else remembered on this device, else the device's own setting. */
export function reduceMotion(): boolean {
  return sessionValue ?? stored() ?? deviceAsks();
}

export function setReduceMotion(on: boolean): void {
  sessionValue = on;
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  } catch {
    // Storage blocked: the choice lasts until the page closes.
  }
  applyReduceMotionClass();
}

/** The page's own animations (the realm map's marker) follow the setting through a class on <body>. */
export function applyReduceMotionClass(): void {
  document.body.classList.toggle('reduce-motion', reduceMotion());
}
