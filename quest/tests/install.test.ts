import { describe, expect, it } from 'vitest';
import { installGate, isMobileDevice, type InstallEnv } from '../src/engine/install.ts';

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const IPAD = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15';
const ANDROID = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';
const WINDOWS = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

const env = (over: Partial<InstallEnv>): InstallEnv => ({ userAgent: IPHONE, maxTouchPoints: 5, standalone: false, param: null, dev: false, ...over });

describe('phones are shown how to install first (owner decisions, Oct 16 and 17)', () => {
  it('a phone or tablet in the browser gets the install steps for its kind', () => {
    expect(installGate(env({}))).toBe('ios');
    expect(installGate(env({ userAgent: IPAD }))).toBe('ios');
    expect(installGate(env({ userAgent: ANDROID }))).toBe('android');
    expect(installGate(env({ userAgent: 'Mozilla/5.0 (Mobile; rv:120.0) Gecko/120.0 Firefox/120.0' }))).toBe('other');
  });

  it('opened from the home screen, it plays', () => {
    expect(installGate(env({ standalone: true }))).toBe('play');
    expect(installGate(env({ userAgent: ANDROID, standalone: true }))).toBe('play');
  });

  it('a computer plays in the browser, even with a touch screen; a Mac without touch is a computer', () => {
    expect(installGate(env({ userAgent: WINDOWS, maxTouchPoints: 10 }))).toBe('play');
    expect(installGate(env({ userAgent: IPAD, maxTouchPoints: 0 }))).toBe('play');
    expect(isMobileDevice(WINDOWS, 10)).toBe(false);
  });

  it('the dev server and ?install=0 skip it; ?install=1 shows it anywhere', () => {
    expect(installGate(env({ dev: true }))).toBe('play');
    expect(installGate(env({ param: '0' }))).toBe('play');
    expect(installGate(env({ param: '1', userAgent: WINDOWS, maxTouchPoints: 0 }))).toBe('other');
    expect(installGate(env({ param: '1', dev: true }))).toBe('ios');
  });

  it('"Play here anyway" (owner decision, Oct 17) plays in the browser from then on; ?install=1 still shows the steps', () => {
    expect(installGate(env({ playInBrowser: true }))).toBe('play');
    expect(installGate(env({ userAgent: ANDROID, playInBrowser: true }))).toBe('play');
    expect(installGate(env({ playInBrowser: true, param: '1' }))).toBe('ios');
  });
});
