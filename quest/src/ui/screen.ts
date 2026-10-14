// Fitting the game to the phone's screen, and keeping the browser from zooming or scrolling it.
//
// The canvas is sized from the visible viewport (window.visualViewport, which leaves out the browser
// bars and the on-screen keyboard; innerWidth / innerHeight when there is none), never from the
// screen size. The game box (#game) and the touch overlay are pinned to that visible rectangle
// through CSS variables, the canvas is centred in #game, and the rest is letterbox. It is redone on
// every resize, rotation, visual viewport change and full-screen change.

import { MAP_BAR_PX, MAX_ZOOM, MIN_INTEGER_ZOOM, TOUCH_SIDE_PX, TOUCH_STACK_PX, VIEW_HEIGHT, VIEW_WIDTH } from '../config.ts';
import { screenLayout, type ScreenRect } from '../engine/scaling.ts';

export interface Viewport {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function visibleViewport(): Viewport {
  const vv = window.visualViewport;
  if (vv && vv.width > 0 && vv.height > 0) {
    return { left: vv.offsetLeft, top: vv.offsetTop, width: vv.width, height: vv.height };
  }
  return { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
}

/**
 * Keep the canvas fitted to the visible viewport. `setZoom` hands the zoom to Phaser. The picture's
 * place goes to CSS (--game-left/top/width/height) and the layout mode to <body data-layout> (side,
 * stack or overlay), so the touch controls and the minimap sit in the black bars around it.
 */
export function fitToScreen(setZoom: (zoom: number) => void, touch = false): () => ScreenRect {
  const rootStyle = document.documentElement.style;
  let last = '';
  const layout = (): ScreenRect => {
    const vp = visibleViewport();
    const { rect, mode } = screenLayout(vp.width, vp.height, VIEW_WIDTH, VIEW_HEIGHT, MAX_ZOOM, MIN_INTEGER_ZOOM, touch, {
      side: TOUCH_SIDE_PX,
      stack: TOUCH_STACK_PX,
      mapBar: MAP_BAR_PX,
    });
    const key = `${vp.left},${vp.top},${vp.width},${vp.height}`;
    if (key !== last) {
      last = key;
      rootStyle.setProperty('--vv-left', `${vp.left}px`);
      rootStyle.setProperty('--vv-top', `${vp.top}px`);
      rootStyle.setProperty('--vv-width', `${vp.width}px`);
      rootStyle.setProperty('--vv-height', `${vp.height}px`);
      rootStyle.setProperty('--game-left', `${rect.left}px`);
      rootStyle.setProperty('--game-top', `${rect.top}px`);
      rootStyle.setProperty('--game-width', `${rect.width}px`);
      rootStyle.setProperty('--game-height', `${rect.height}px`);
      document.body.dataset.layout = mode;
      setZoom(rect.zoom);
    }
    // The page itself never scrolls (iOS can still nudge it when the bars move).
    if (window.scrollX !== 0 || window.scrollY !== 0) window.scrollTo(0, 0);
    return rect;
  };
  // Rotation settles over a few frames on some phones: lay out again shortly after.
  const soon = () => {
    layout();
    for (const ms of [50, 250, 600]) window.setTimeout(layout, ms);
  };
  window.addEventListener('resize', soon);
  window.addEventListener('orientationchange', soon);
  window.addEventListener('scroll', layout, { passive: true });
  window.visualViewport?.addEventListener('resize', layout);
  window.visualViewport?.addEventListener('scroll', layout);
  document.addEventListener('fullscreenchange', soon);
  document.addEventListener('webkitfullscreenchange', soon);
  layout();
  return layout;
}

/** Inside the game or the touch controls, where taps must never zoom or select. */
function onPlayArea(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest('#game, .touch-overlay, .fs-button, .side-map') !== null;
}

/**
 * Stop pinch and double-tap zoom, long-press callouts and text selection. The viewport meta asks
 * for no zoom, but iOS Safari ignores user-scalable=no, so the gestures are cancelled here too.
 */
export function preventBrowserZoom(): void {
  const cancel = (e: Event) => e.preventDefault();
  // Safari's pinch gestures.
  for (const type of ['gesturestart', 'gesturechange', 'gestureend']) {
    document.addEventListener(type, cancel, { passive: false });
  }
  // Two fingers anywhere: no pinch zoom.
  document.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length > 1 || onPlayArea(e.target)) e.preventDefault();
    },
    { passive: false },
  );
  // A quick second tap on the game or the controls must not zoom.
  let lastEnd = 0;
  document.addEventListener(
    'touchend',
    (e) => {
      const now = e.timeStamp;
      if (now - lastEnd < 350 && onPlayArea(e.target)) e.preventDefault();
      lastEnd = now;
    },
    { passive: false },
  );
  document.addEventListener('dblclick', (e) => {
    if (onPlayArea(e.target)) e.preventDefault();
  });
  // Ctrl + wheel (trackpad pinch on desktop) zooms the page; keep it on the game.
  document.addEventListener(
    'wheel',
    (e) => {
      if (e.ctrlKey) e.preventDefault();
    },
    { passive: false },
  );
  document.addEventListener('contextmenu', (e) => {
    if (onPlayArea(e.target)) e.preventDefault();
  });
  document.addEventListener('selectstart', (e) => {
    if (onPlayArea(e.target)) e.preventDefault();
  });
}
