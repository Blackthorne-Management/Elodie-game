// Real art dropped into quest/art/ (names in assets.config.ts ART_FILES). Vite lists the files at
// build time, so only files that exist are ever requested: a missing file simply keeps its procedural
// placeholder, and nothing 404s. Browser-only (import.meta.glob); the engine never imports this.

const FILES = import.meta.glob('../../art/**/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

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
