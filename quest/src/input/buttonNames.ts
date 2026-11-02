// The buttons' names as the player's own device names them (the Nov 1 playtests: "(A to continue)" on a keyboard,
// where A walks left). One helper for every prompt: the keyboard says Enter and X, a gamepad A and B, a touch screen
// the on-screen buttons (and "Tap" where a tap anywhere does it). The device is the one used last (InputManager sets
// it on every press; a touch device starts on touch, anything else on the keyboard). Pure TypeScript, unit tested.

export type Device = 'keyboard' | 'gamepad' | 'touch';

/** The buttons a prompt can name (the moving keys have their own word: MOVE_WORDS). */
export type PromptButton = 'confirm' | 'cancel' | 'echo' | 'menu' | 'ask' | 'run';

/**
 * Each device's names (src/input/keyboard.ts, gamepad.ts and touch.ts hold the bindings): the keyboard's confirm is
 * Enter (Z and Space work too), its cancel X (Backspace and B too), Esc opens the menu; a gamepad's are the standard
 * layout's A, B, X (Echo), Y (Ask) and Start; on a touch screen, the buttons' own labels.
 */
export const BUTTON_NAMES: Readonly<Record<Device, Readonly<Record<PromptButton, string>>>> = {
  keyboard: { confirm: 'Enter', cancel: 'X', echo: 'E', menu: 'Esc', ask: 'Q', run: 'Shift' },
  gamepad: { confirm: 'A', cancel: 'B', echo: 'X', menu: 'Start', ask: 'Y', run: 'B' },
  touch: { confirm: 'A', cancel: 'B', echo: 'Echo', menu: 'Menu', ask: 'Ask', run: 'B' },
};

/** How each device walks. */
export const MOVE_WORDS: Readonly<Record<Device, string>> = {
  keyboard: 'the arrow keys or WASD',
  gamepad: 'the D-pad or the stick',
  touch: 'the D-pad',
};

let current: Device = 'keyboard';

/** The device used last (set by the input layer). */
export function currentDevice(): Device {
  return current;
}

export function setDevice(device: Device): void {
  current = device;
}

/** A button's name on a device ("Enter", "A", "Echo"). */
export function buttonName(button: PromptButton, device: Device = current): string {
  return BUTTON_NAMES[device][button];
}

/** The line under a card or a popup: "Enter to continue", "A to continue", "Tap to continue". */
export function continueHint(device: Device = current): string {
  return device === 'touch' ? 'Tap to continue' : `${buttonName('confirm', device)} to continue`;
}

/** The Echo prompt where an Echo would work: "Press E to Echo", "Press X to Echo", "Tap Echo". */
export function echoHint(device: Device = current): string {
  return device === 'touch' ? 'Tap Echo' : `Press ${buttonName('echo', device)} to Echo`;
}

/** What picks a thing on a screen that also takes taps and clicks: "Enter or click", "A", "Tap". */
export function actWord(device: Device = current): string {
  if (device === 'touch') return 'Tap';
  return device === 'keyboard' ? `${buttonName('confirm', device)} or click` : buttonName('confirm', device);
}

const TOKENS: Readonly<Record<string, PromptButton>> = {
  A: 'confirm',
  B: 'cancel',
  Echo: 'echo',
  Menu: 'menu',
  Ask: 'ask',
  Run: 'run',
};

/**
 * Fill a text's button names: `{A}` (confirm), `{B}` (cancel), `{Echo}`, `{Menu}`, `{Ask}` and `{Run}` become the
 * device's own names; `{Move}` how to walk, `{Act}` what picks a thing (actWord) and `{Continue}` a card's last line
 * (continueHint). Anything else in braces is left as written.
 */
export function fillButtons(text: string, device: Device = current): string {
  return text.replace(/\{(A|B|Echo|Menu|Ask|Run|Move|Act|Continue)\}/g, (_whole, token: string) => {
    if (token === 'Move') return MOVE_WORDS[device];
    if (token === 'Act') return actWord(device);
    if (token === 'Continue') return continueHint(device);
    return buttonName(TOKENS[token]!, device);
  });
}
