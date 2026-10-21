// The party level each chapter is pitched at (docs/quest/design/STORY.md section 1, with the owner's chapter
// order of Oct 15: Ardencia is Chapter 3 and Al-Doria Chapter 4; and the fixed order of the three roads, owner
// decision Oct 20: Skarragol 15 to 17, Kuroshi 17 to 19, Jwaladesh 19 to 21). The party should end each chapter at
// `to`; tools/level-curve.ts checks the scripted route against it. `mark` is the route marker at the chapter's end
// (routes/zetwal-act1.json), for the chapters the route plays so far.

export interface ChapterLevels {
  chapter: number;
  place: string;
  from: number;
  to: number;
  mark?: string;
}

export const CHAPTER_LEVELS: readonly ChapterLevels[] = [
  { chapter: 1, place: 'Zetwal (Pòdlimyè)', from: 1, to: 3, mark: 'end-card' },
  { chapter: 2, place: 'Xaraguá (Yucayeque)', from: 3, to: 8, mark: 'chapter2-end' },
  { chapter: 3, place: 'Ardencia', from: 8, to: 11, mark: 'chapter3-end' },
  { chapter: 4, place: 'Al-Doria', from: 11, to: 14 },
  { chapter: 5, place: 'Eightgate', from: 14, to: 15 },
  { chapter: 6, place: 'Skarragol', from: 15, to: 17 },
  { chapter: 7, place: 'Kuroshi', from: 17, to: 19 },
  { chapter: 8, place: 'Jwaladesh', from: 19, to: 21 },
  { chapter: 9, place: 'Aldermoor', from: 21, to: 24 },
  { chapter: 10, place: 'Zetwal again', from: 24, to: 25 },
  { chapter: 11, place: 'Xaraguá again', from: 25, to: 28 },
  { chapter: 12, place: 'Eightgate again', from: 28, to: 30 },
];
