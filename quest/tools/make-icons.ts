// Placeholder home-screen icons for the quest (public/icons/*.png): a gold Sun Locket on the night
// panel colour, drawn from a 16 x 16 pixel grid and scaled up with hard edges. No image tools needed.
// `npm run icons` rewrites them; the PNGs are committed.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const GRID = [
  '................',
  '................',
  '.......gg.......',
  '....g.gyyg.g....',
  '.....gyyyyg.....',
  '...gyyoooyyg....',
  '..gyyo....oyyg..',
  '..gyo..ww..oyg..',
  '..gyo..ww..oyg..',
  '..gyyo....oyyg..',
  '...gyyoooyyg....',
  '.....gyyyyg.....',
  '....g.gyyg.g....',
  '.......gg.......',
  '................',
  '................',
];
const COLOURS: Record<string, [number, number, number]> = {
  '.': [0x14, 0x10, 0x1a],
  g: [0x8a, 0x6a, 0x1e],
  o: [0xc8, 0x8a, 0x2a],
  y: [0xf2, 0xd0, 0x4b],
  w: [0xf4, 0xec, 0xd8],
};

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** An opaque RGB PNG of the grid at `size` x `size` (nearest neighbour). */
export function iconPng(size: number): Buffer {
  const rows: Buffer[] = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3); // filter byte 0, then RGB
    const gy = Math.floor((y * GRID.length) / size);
    for (let x = 0; x < size; x++) {
      const gx = Math.floor((x * GRID.length) / size);
      const [r, g, b] = COLOURS[GRID[gy]![gx]!]!;
      row.set([r, g, b], 1 + x * 3);
    }
    rows.push(row);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header.set([8, 2, 0, 0, 0], 8); // 8-bit, truecolour, deflate, no filter, no interlace
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(Buffer.concat(rows), { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons');
mkdirSync(outDir, { recursive: true });
for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]] as const) {
  writeFileSync(join(outDir, name), iconPng(size));
  console.log(`wrote public/icons/${name} (${size} x ${size})`);
}
