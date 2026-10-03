// Decides whether the game may run: only as an installed home-screen app.

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export type Platform = 'ios' | 'android' | 'desktop';

export function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

// Developers can still play in a browser: the dev server, or a URL with ?play.
export function browserPlayAllowed(): boolean {
  return import.meta.env.DEV || new URLSearchParams(location.search).has('play');
}

export function platform(): Platform {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

// In-app browsers (Instagram, Facebook, Gmail...) cannot add to the home screen.
export function inAppBrowser(): boolean {
  return /FBAN|FBAV|Instagram|Line\/|GSA\/|Snapchat|TikTok/.test(navigator.userAgent);
}

// Chrome on Android fires this once, early, so capture it at startup.
let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

export function listenForInstallPrompt() {
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    listeners.forEach(fn => fn());
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    installed = true;
    listeners.forEach(fn => fn());
  });
}

let installed = false;
export const installState = () => ({ canPrompt: deferred !== null, installed });

export function onInstallChange(fn: () => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

export async function promptInstall() {
  if (!deferred) return;
  await deferred.prompt();
  await deferred.userChoice;
  deferred = null;
  listeners.forEach(fn => fn());
}
