// The item showcase (engine/showcase.ts): which items pop up, once each, and which abilities show.

import { describe, expect, it } from 'vitest';
import { ITEM_ART, itemArtKey } from '../src/assets.config.ts';
import { CONTENT } from '../src/data/content.ts';
import { RPG } from '../src/data/rpg.ts';
import { DialogueRunner } from '../src/engine/dialogue.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { UNKNOWN_ABILITY, canReplay, markShown, pendingShowcases, showcaseView } from '../src/engine/showcase.ts';
import { settleRewards } from '../src/engine/sideQuests.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';

const ids = (flags: FlagStore) => pendingShowcases(flags, RPG).map((i) => i.id);

describe('item showcase', () => {
  it('pops up for story, legendary and reward items, never for shop goods', () => {
    const flags = new FlagStore();
    flags.set('item.soup_pot', 2);
    flags.set('item.akasan', 1);
    flags.set('item.sea_glass_charm', 1);
    expect(ids(flags)).toEqual([]);
    flags.set('item.sun_locket', true);
    flags.set('item.solange_quill', true);
    flags.set('item.sun_charm', 1);
    expect(ids(flags)).toEqual(['sun_locket', 'solange_quill', 'sun_charm']);
  });

  it('shows each item once, even after a reload (the shown flag is in the save)', () => {
    const flags = new FlagStore();
    flags.set('item.sun_locket', true);
    markShown(flags, 'sun_locket');
    expect(ids(flags)).toEqual([]);
    const reloaded = new FlagStore();
    for (const [k, v] of Object.entries(flags.snapshot())) reloaded.set(k, v);
    expect(ids(reloaded)).toEqual([]);
  });

  it('is due on the very line where Grandmother hands over the Locket', () => {
    const flags = new FlagStore();
    flags.set('story.elodie_left', true);
    const run = new DialogueRunner(CONTENT.dialogue.anicette_talk!, CONTENT.speakers, flags);
    let guard = 0;
    while (!run.done && guard++ < 50) {
      const v = run.view();
      if (v.kind !== 'line') break;
      if (v.text.includes('received the Sun Locket')) break;
      expect(ids(flags), v.text).toEqual([]);
      run.advance();
    }
    expect(ids(flags)).toEqual(['sun_locket']);
  });

  it('hides abilities until the story explains them', () => {
    const flags = new FlagStore();
    const locket = RPG.items.sun_locket!;
    const shown = () => showcaseView(flags, locket).abilities.map((a) => (a.known ? a.name : `${a.name}: ${a.text}`));
    expect(shown()).toEqual(['Echo', `Anchors: ${UNKNOWN_ABILITY}`, `Two halves of a promise: ${UNKNOWN_ABILITY}`]);
    flags.set('anchor.night_orders', true);
    expect(shown()).toEqual(['Echo', 'Anchors', `Two halves of a promise: ${UNKNOWN_ABILITY}`]);
    flags.set('story.signet_glowed', true);
    expect(showcaseView(flags, locket).abilities.every((a) => a.known)).toBe(true);
  });

  it('labels each tier, and lists gear bonuses', () => {
    const flags = new FlagStore();
    expect(showcaseView(flags, RPG.items.solange_quill!).banner).toBe('Legendary item');
    expect(showcaseView(flags, RPG.items.sun_locket!).banner).toBe('Key item');
    const charm = showcaseView(flags, RPG.items.sun_charm!);
    expect(charm.banner).toBe('Quest reward');
    expect(charm.stats).toEqual(['HP +8', 'DEF +1']);
  });

  it('a side quest reward item is due once the quest pays out', () => {
    const flags = new FlagStore();
    flags.set('side.cane_name.done', true);
    settleRewards(flags, RPG, SIDE_QUESTS);
    expect(ids(flags)).toEqual(['sun_charm']);
  });

  it('only story and legendary items replay from the menu; every showcase item has a drawing', () => {
    expect(canReplay(RPG.items.sun_locket!)).toBe(true);
    expect(canReplay(RPG.items.solange_quill!)).toBe(true);
    expect(canReplay(RPG.items.sun_charm!)).toBe(false);
    for (const it of Object.values(RPG.items)) {
      if (!it.showcase) continue;
      expect(ITEM_ART[it.id], it.id).toBeDefined();
      expect(itemArtKey(it.id, it.kind)).toBe(it.id);
    }
    expect(itemArtKey('no_such_item', 'gear')).toBe('gear');
    expect(itemArtKey('no_such_item', 'key')).toBe('key');
  });
});
