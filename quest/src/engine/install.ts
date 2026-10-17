// Phones and tablets are shown how to install the quest first (owner decision, Oct 16): in a phone's browser
// the quest shows the install steps instead of starting. Under them, "Play here anyway" (owner decision, Oct 17,
// after the demo review: a chat app's own browser cannot install) starts it in the browser and is remembered
// on that device. Computers play in the browser as before. This file decides; src/ui/installScreen.ts draws
// the screen. Pure TypeScript, tested in tests/install.test.ts.

/** Where the device remembers that its player chose to play in the browser. */
export const PLAY_IN_BROWSER_KEY = 'bloodlines-quest.play-in-browser';

/** What the page should do: play, or show the install steps for this kind of phone. */
export type InstallGate = 'play' | 'ios' | 'android' | 'other';

export interface InstallEnv {
  /** navigator.userAgent */
  userAgent: string;
  /** navigator.maxTouchPoints (an iPad says "Macintosh" but has touch points) */
  maxTouchPoints: number;
  /** Opened from the home screen (display-mode standalone or fullscreen, or iOS navigator.standalone). */
  standalone: boolean;
  /** The ?install= URL option: "0" never shows the screen (tests), "1" always does (to look at it). */
  param: string | null;
  /** The dev server (npm run dev): the owner tests on a phone in the browser, so no screen unless asked. */
  dev: boolean;
  /** The player chose "Play here anyway" on this device before. */
  playInBrowser?: boolean;
}

export function isIOSDevice(userAgent: string, maxTouchPoints: number): boolean {
  return /iPhone|iPad|iPod/.test(userAgent) || (/Macintosh/.test(userAgent) && maxTouchPoints > 1);
}

export function isAndroidDevice(userAgent: string): boolean {
  return /Android/.test(userAgent);
}

/** A phone or tablet (not a computer with a touch screen). */
export function isMobileDevice(userAgent: string, maxTouchPoints: number): boolean {
  return isIOSDevice(userAgent, maxTouchPoints) || isAndroidDevice(userAgent) || /Mobile|Silk|Kindle|BlackBerry|Opera Mini/.test(userAgent);
}

export function installGate(env: InstallEnv): InstallGate {
  if (env.param === '0') return 'play';
  const forced = env.param === '1';
  if (!forced && (env.dev || env.standalone || env.playInBrowser || !isMobileDevice(env.userAgent, env.maxTouchPoints))) return 'play';
  if (isIOSDevice(env.userAgent, env.maxTouchPoints)) return 'ios';
  if (isAndroidDevice(env.userAgent)) return 'android';
  return 'other';
}
