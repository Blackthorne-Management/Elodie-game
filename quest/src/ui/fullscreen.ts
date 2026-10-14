// Full screen: the Fullscreen API (with the webkit prefixes) on the whole page, plus a landscape
// orientation lock where the browser allows one. iPhone Safari has no Fullscreen API for pages, so
// there the toggle explains Add to Home Screen instead (the quest's manifest opens it full screen).
// Esc leaves full screen (the browser does that itself).

type FsDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitFullscreenEnabled?: boolean;
  webkitExitFullscreen?: () => Promise<void> | void;
};
type FsElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
type LockableOrientation = ScreenOrientation & { lock?: (o: string) => Promise<void> };

const doc = document as FsDocument;

export function fullscreenSupported(): boolean {
  const el = document.documentElement as FsElement;
  return (
    (typeof el.requestFullscreen === 'function' && doc.fullscreenEnabled !== false) ||
    typeof el.webkitRequestFullscreen === 'function'
  );
}

export function isFullscreen(): boolean {
  return Boolean(doc.fullscreenElement ?? doc.webkitFullscreenElement);
}

/** Opened from the home screen (already full screen or standalone, so no toggle is needed). */
export function isStandalone(): boolean {
  const nav = navigator as Navigator & { standalone?: boolean };
  if (nav.standalone === true) return true;
  if (isFullscreen()) return false; // the Fullscreen API also matches display-mode: fullscreen
  return ['standalone', 'fullscreen'].some((m) => window.matchMedia?.(`(display-mode: ${m})`).matches);
}

export function isIOS(): boolean {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

async function enter(): Promise<void> {
  const el = document.documentElement as FsElement;
  if (typeof el.requestFullscreen === 'function') await el.requestFullscreen({ navigationUI: 'hide' });
  else await el.webkitRequestFullscreen?.();
  try {
    await (screen.orientation as LockableOrientation | undefined)?.lock?.('landscape');
  } catch {
    // Not allowed here (desktop, iOS): the game still works in any orientation.
  }
}

async function exit(): Promise<void> {
  try {
    screen.orientation?.unlock?.();
  } catch {
    // nothing locked
  }
  if (typeof doc.exitFullscreen === 'function' && doc.fullscreenElement) await doc.exitFullscreen();
  else await doc.webkitExitFullscreen?.();
}

const HOME_SCREEN_TEXT =
  'To play full screen on iPhone: tap Share, then Add to Home Screen. Open Bloodlines Quest from your home screen.';
const UNSUPPORTED_TEXT = 'This browser cannot go full screen. Add the game to your home screen to play without the browser bars.';

/** The explanation shown where the Fullscreen API is missing. `onClose` runs when it is closed. */
export function showFullscreenHelp(onClose?: () => void): void {
  document.querySelector('.fs-help')?.remove();
  const overlay = document.createElement('div');
  overlay.className = 'fs-help';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  const panel = document.createElement('div');
  panel.className = 'fs-help-panel';
  const p = document.createElement('p');
  p.textContent = isIOS() ? HOME_SCREEN_TEXT : UNSUPPORTED_TEXT;
  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = 'Close';
  close.addEventListener('click', () => {
    overlay.remove();
    onClose?.();
  });
  panel.append(p, close);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}

/**
 * Toggle full screen. Returns 'help' when it showed the Add to Home Screen explanation instead
 * (then `onHelpClosed` runs when that is closed).
 */
export function toggleFullscreen(onHelpClosed?: () => void): 'toggled' | 'help' {
  if (!fullscreenSupported()) {
    showFullscreenHelp(onHelpClosed);
    return 'help';
  }
  const done = isFullscreen() ? exit() : enter();
  done.catch((e: unknown) => console.warn('[quest] full screen refused', e));
  return 'toggled';
}

const ICON_ENTER =
  '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M3 9V3h6M15 3h6v6M21 15v6h-6M9 21H3v-6" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>';
const ICON_EXIT =
  '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 3v6H3M21 9h-6V3M15 21v-6h6M3 15h6v6" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>';

/**
 * The small full-screen button at the top right. Not shown when the game was opened from the home
 * screen. Returns the button, or null when it is not shown.
 */
export function mountFullscreenButton(): HTMLButtonElement | null {
  if (isStandalone()) {
    document.body.classList.add('standalone');
    return null;
  }
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'fs-button';
  button.tabIndex = -1;
  const refresh = () => {
    const on = isFullscreen();
    button.innerHTML = on ? ICON_EXIT : ICON_ENTER;
    button.setAttribute('aria-label', on ? 'Exit full screen' : 'Full screen');
    button.title = on ? 'Exit full screen (Esc)' : 'Full screen';
  };
  button.addEventListener('pointerdown', (e) => e.stopPropagation());
  button.addEventListener('click', () => {
    button.blur();
    toggleFullscreen();
  });
  document.addEventListener('fullscreenchange', refresh);
  document.addEventListener('webkitfullscreenchange', refresh);
  refresh();
  document.body.classList.add('has-fs');
  document.body.appendChild(button);
  return button;
}
