// The quest arrows setting (System menu; owner request, Oct 17): on unless the player turns them off. A
// setting of this device, like the text size, so saves and save codes stay as they are.

const STORAGE_KEY = 'bq.questArrows';

export function questArrowsOn(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true; // storage blocked (a private tab): the default
  }
}

export function setQuestArrows(on: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  } catch {
    // Storage blocked: the choice lasts until the page closes.
  }
  sessionValue = on;
}

let sessionValue: boolean | null = null;

/** The setting now (what was chosen this session wins when storage is blocked). */
export function questArrows(): boolean {
  return sessionValue ?? questArrowsOn();
}
