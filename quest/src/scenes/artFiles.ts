// Real art dropped into quest/art/ (names in assets.config.ts ART_FILES and GAME_OVER_ART). Vite lists the files at
// build time, so only files that exist are ever requested: a missing file simply keeps its procedural
// placeholder, and nothing 404s. Browser-only (import.meta.glob); the engine never imports this.

// The pictures, and the Game Over films and bell (assets.config.ts GAME_OVER_ART, audio.config.ts GAME_OVER_BELL_FILE).
const FILES = import.meta.glob(['../../art/**/*.png', '../../art/gameover/*.{mp4,webm,wav,mp3,ogg}'], {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const BY_PATH: ReadonlyMap<string, string> = new Map(
  Object.entries(FILES).map(([path, url]) => [path.replace(/^.*?\/art\//, ''), url]),
);

/** The URL of an art file (path relative to quest/art/), or undefined when there is none. */
export function artFile(path: string): string | undefined {
  return BY_PATH.get(path);
}

/** Every art file present, as paths relative to quest/art/. */
export function artFiles(): string[] {
  return [...BY_PATH.keys()];
}
