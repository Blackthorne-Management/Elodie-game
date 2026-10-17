// The install screen (owner decision, Oct 16): on a phone or tablet in the browser, the quest shows how
// to put it on the home screen before starting (engine/install.ts decides when). Android browsers
// that offer their own install prompt get an Install button; every phone gets the steps by hand, and
// "Play here anyway" under them (Oct 17) for browsers that cannot install, such as a chat app's.

import { PLAY_IN_BROWSER_KEY, type InstallGate } from '../engine/install.ts';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const STEPS: Record<Exclude<InstallGate, 'play'>, readonly string[]> = {
  ios: [
    'Tap the Share button (the square with an arrow, at the bottom or top of the screen).',
    'Scroll down and tap "Add to Home Screen", then "Add".',
    'Open Echoes from your home screen.',
  ],
  android: [
    'Tap the menu (the three dots, top right).',
    'Tap "Install app" or "Add to Home screen", then "Install".',
    'Open Echoes from your home screen.',
  ],
  other: [
    "Open your browser's menu or Share button.",
    'Choose "Install app" or "Add to Home Screen".',
    'Open Echoes from your home screen.',
  ],
};

export function mountInstallScreen(gate: Exclude<InstallGate, 'play'>): void {
  const screen = document.createElement('section');
  screen.className = 'install-screen';
  screen.setAttribute('role', 'dialog');
  screen.setAttribute('aria-labelledby', 'install-title');

  const icon = document.createElement('img');
  icon.className = 'install-icon';
  icon.src = 'icons/icon-192.png';
  icon.alt = '';
  const title = document.createElement('h1');
  title.id = 'install-title';
  title.textContent = 'Bloodlines: Echoes of Zetwal';
  const lead = document.createElement('p');
  lead.className = 'install-lead';
  lead.textContent = 'On a phone or tablet, Echoes plays as an app. Add it to your home screen first: it is free and takes a few seconds.';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'install-button';
  button.textContent = 'Install Echoes';
  button.hidden = true;

  const list = document.createElement('ol');
  list.className = 'install-steps';
  for (const step of STEPS[gate]) {
    const li = document.createElement('li');
    li.textContent = step;
    list.appendChild(li);
  }

  // For a browser that cannot install (a link opened inside Discord, WhatsApp or Instagram): play anyway,
  // and remember it on this device. Saves live in the browser either way.
  const anyway = document.createElement('button');
  anyway.type = 'button';
  anyway.className = 'install-anyway';
  anyway.textContent = 'Play here anyway';
  anyway.addEventListener('click', () => {
    try {
      localStorage.setItem(PLAY_IN_BROWSER_KEY, '1');
    } catch {
      // Storage blocked (a private tab): play this once.
    }
    const url = new URL(location.href);
    url.searchParams.set('install', '0');
    location.replace(url.toString());
  });
  const anywayNote = document.createElement('p');
  anywayNote.className = 'install-note';
  anywayNote.textContent = 'Can\'t install from here? Play in this browser instead. It works, with less screen space.';

  const note = document.createElement('p');
  note.className = 'install-note';
  note.textContent = 'On a computer, you can play right here in the browser.';

  screen.append(icon, title, lead, button, list, anyway, anywayNote, note);
  document.body.appendChild(screen);
  document.body.classList.add('installing');

  // Android's own prompt, when the browser offers one: one tap installs.
  let deferred: InstallPromptEvent | null = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as InstallPromptEvent;
    button.hidden = false;
  });
  button.addEventListener('click', () => {
    if (!deferred) return;
    void deferred.prompt();
    void deferred.userChoice.then((c) => {
      if (c.outcome === 'accepted') button.hidden = true;
    });
    deferred = null;
  });
  window.addEventListener('appinstalled', () => {
    button.hidden = true;
    lead.textContent = 'Installed. Open Echoes from your home screen to play.';
  });
}
