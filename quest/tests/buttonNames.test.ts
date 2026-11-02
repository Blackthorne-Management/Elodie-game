// The buttons' names per device (input/buttonNames.ts; the Nov 1 playtests): every prompt names the keys of the device
// used last, and the input manager switches it on a press.

import { afterEach, describe, expect, it } from 'vitest';
import { InputManager, type Button, type InputSource } from '../src/input/actions.ts';
import { BUTTON_NAMES, actWord, buttonName, continueHint, currentDevice, echoHint, fillButtons, setDevice, type Device } from '../src/input/buttonNames.ts';
import { KEYMAP } from '../src/input/keyboard.ts';

afterEach(() => setDevice('keyboard'));

describe('button names per device', () => {
  it('a keyboard never says A or B for confirm and cancel (A walks left)', () => {
    expect(continueHint('keyboard')).toBe('Enter to continue');
    expect(fillButtons('({A} to talk, {B} to go back)', 'keyboard')).toBe('(Enter to talk, X to go back)');
    // The names are keys that really do that.
    expect(KEYMAP.Enter).toContain('confirm');
    expect(KEYMAP.KeyX).toContain('cancel');
    expect(KEYMAP.KeyE).toContain('echo');
    expect(KEYMAP.Escape).toContain('menu');
    expect(KEYMAP.KeyQ).toContain('ask');
    expect(KEYMAP.ShiftLeft).toContain('run');
  });

  it('a gamepad says A and B; a touch screen names its buttons and says Tap', () => {
    expect(continueHint('gamepad')).toBe('A to continue');
    expect(continueHint('touch')).toBe('Tap to continue');
    expect(fillButtons('{Menu} opens the menu', 'gamepad')).toBe('Start opens the menu');
    expect(fillButtons('{Menu} opens the menu', 'touch')).toBe('Menu opens the menu');
  });

  it('the Echo prompt reads naturally on every device ("Press Echo to Echo" read like a typo)', () => {
    expect(echoHint('keyboard')).toBe('Press E to Echo');
    expect(echoHint('gamepad')).toBe('Press X to Echo');
    expect(echoHint('touch')).toBe('Tap Echo');
  });

  it('fills walking, picking and continuing, and leaves other braces alone', () => {
    expect(fillButtons('Walk with {Move}.', 'touch')).toBe('Walk with the D-pad.');
    expect(fillButtons('{Act}: read', 'keyboard')).toBe('Enter or click: read');
    expect(actWord('touch')).toBe('Tap');
    expect(fillButtons('({Continue})', 'gamepad')).toBe('(A to continue)');
    expect(fillButtons('{v:clock.face} and {realm.influence}', 'keyboard')).toBe('{v:clock.face} and {realm.influence}');
  });

  it('names every prompt button on every device', () => {
    for (const d of Object.keys(BUTTON_NAMES) as Device[]) {
      for (const b of ['confirm', 'cancel', 'echo', 'menu', 'ask', 'run'] as const) expect(buttonName(b, d)).not.toBe('');
    }
  });

  it('the device is the one pressed last', () => {
    const source = (device: Device, presses: Button[]): InputSource => ({
      device,
      isHeld: () => false,
      drainPresses: () => presses.splice(0),
    });
    const pad: Button[] = [];
    const keys: Button[] = [];
    const input = new InputManager([source('keyboard', keys), source('gamepad', pad)]);
    setDevice('touch');
    input.update();
    expect(currentDevice()).toBe('touch');
    pad.push('confirm');
    input.update();
    expect(currentDevice()).toBe('gamepad');
    expect(fillButtons('{A}')).toBe('A');
    keys.push('cancel');
    input.update();
    expect(currentDevice()).toBe('keyboard');
    expect(fillButtons('{B}')).toBe('X');
  });
});
