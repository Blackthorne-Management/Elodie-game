// "Turn your phone sideways" (the Nov 1 playtests: upright, the picture is a 390 x 220 strip and its text is tiny, and the
// old hint was a small grey line). On a touch screen held upright, a clear full-screen card says so once, with a turning
// phone; it goes away when the phone is turned or with "Keep playing upright". Once the phone has been held sideways, or
// the card was closed, it is not shown again on this device (the small line under the picture stays as a reminder).

const SEEN_KEY = 'bq.rotateSeen';

function seen(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function remember(): void {
  try {
    localStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Private mode: the card may show again next time.
  }
}

export function mountRotateCard(): void {
  let card: HTMLElement | null = null;
  const close = () => {
    remember();
    card?.remove();
    card = null;
  };
  const check = () => {
    const upright = window.innerHeight > window.innerWidth;
    if (!upright) {
      // Held sideways once: the player knows.
      if (card || !seen()) close();
      return;
    }
    if (card || seen()) return;
    card = document.createElement('div');
    card.className = 'rotate-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-label', 'Turn your phone sideways');
    const phone = document.createElement('div');
    phone.className = 'rotate-phone';
    phone.setAttribute('aria-hidden', 'true');
    const title = document.createElement('p');
    title.className = 'rotate-title';
    title.textContent = 'Turn your phone sideways';
    const body = document.createElement('p');
    body.className = 'rotate-body';
    body.textContent = 'The quest is made to be played sideways: the picture and its words are much bigger.';
    const keep = document.createElement('button');
    keep.type = 'button';
    keep.className = 'rotate-keep';
    keep.textContent = 'Keep playing upright';
    keep.addEventListener('click', (e) => {
      e.stopPropagation();
      close();
    });
    card.append(phone, title, body, keep);
    document.body.appendChild(card);
  };
  window.addEventListener('resize', check);
  window.addEventListener('orientationchange', () => window.setTimeout(check, 250));
  check();
}
