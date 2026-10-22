// The whole of Chapter 1, Zetwal, Chapter 2 in Xaraguá and Chapter 3 in Ardencia, played headlessly from a new
// game by the scripted route the smoke test also drives in the browser (routes/zetwal-act1.json).

import { describe, expect, it } from 'vitest';
import { ACT1, ACT2, ACT3, ACT4, ACT5 } from '../src/data/quests.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { settleRewards, sideQuestStatus } from '../src/engine/sideQuests.ts';
import { partyMembers } from '../src/engine/rpg.ts';
import { RPG } from '../src/data/rpg.ts';
import { currentObjective } from '../src/engine/quests.ts';
import { parseRoute } from '../src/engine/sim.ts';
import { loadMaps, newGameSim, readJson } from '../tools/sim-setup.ts';
import { FlagStore as FlagStoreView, type FlagSnapshot } from '../src/engine/flags.ts';

const route = parseRoute(readJson<string[]>('routes/zetwal-act1.json'));

describe('Chapter 1, Zetwal, start to finish, and the opening of Chapter 2', () => {
  const sim = newGameSim(loadMaps());
  const objectives: string[] = [];
  const chapter2: string[] = [];
  const chapter3: string[] = [];
  const chapter4: string[] = [];
  const chapter5: string[] = [];
  /** Where the party stood, and what it had fought, at Chapter 4's end (the route goes on into Chapter 5). */
  let atChapter4End: { flags: FlagSnapshot; map: string; battles: string[] } = { flags: {}, map: '', battles: [] };
  /** The story's flags and where the party stood at Chapter 3's end (the route goes on into Chapter 4). */
  let atChapter3End: { flags: FlagSnapshot; map: string; battles: string[] } = { flags: {}, map: '', battles: [] };
  /** The story's flags and where the party stood at Chapter 2's end (the route goes on into Chapter 3). */
  let atChapter2End: { flags: Record<string, unknown>; map: string; battles: string[] } = { flags: {}, map: '', battles: [] };
  let atNoon: Record<string, unknown> = {};
  const eras: string[] = [];
  const maps: string[] = [];
  const speakers = new Set<string>();
  const listen = () => {
    const view = sim.logic.view();
    if (view.kind !== 'end' && view.speaker) speakers.add(view.speaker.name);
  };
  /** What the party owns and knows when Chapter 1's card shows (items, gear, gold, XP, spells, members). */
  const KEPT = /^(item\.|equip\.|gold$|xp|spells\.|party\.|lore\.)/;
  let atChapterEnd: Record<string, unknown> = {};
  for (const item of route) {
    if (item.kind === 'mark' && item.name === 'chapter2-end') {
      atChapter2End = { flags: sim.logic.state.flags.snapshot(), map: sim.logic.state.player.mapId, battles: [...sim.battles] };
    }
    if (item.kind === 'mark' && item.name === 'noon') atNoon = sim.logic.state.flags.snapshot();
    if (item.kind === 'mark' && item.name === 'chapter3-end') {
      atChapter3End = { flags: sim.logic.state.flags.snapshot(), map: sim.logic.state.player.mapId, battles: [...sim.battles] };
    }
    if (item.kind === 'mark' && item.name === 'chapter4-end') {
      atChapter4End = { flags: sim.logic.state.flags.snapshot(), map: sim.logic.state.player.mapId, battles: [...sim.battles] };
    }
    if (item.kind === 'mark' && item.name === 'end-card') {
      atChapterEnd = Object.fromEntries(Object.entries(sim.logic.state.flags.snapshot()).filter(([k]) => KEPT.test(k)));
    }
    for (const cmd of sim.expand(item)) {
      if (cmd === 'skip') {
        // Press A line by line (what skip does), noting who speaks.
        for (let i = 0; i < 500 && sim.logic.mode === 'dialogue'; i++) {
          listen();
          sim.press('confirm');
        }
      } else sim.press(cmd);
      listen();
      const id = currentObjective(ACT1, sim.logic.state.flags)?.id ?? 'complete';
      if (objectives.at(-1) !== id) objectives.push(id);
      if (ACT2.maps.includes(sim.logic.state.player.mapId)) {
        const id2 = currentObjective(ACT2, sim.logic.state.flags)?.id ?? 'complete';
        if (chapter2.at(-1) !== id2) chapter2.push(id2);
      }
      if (ACT3.maps.includes(sim.logic.state.player.mapId) || sim.logic.state.player.mapId === 'zetwal-harbor') {
        const id3 = currentObjective(ACT3, sim.logic.state.flags)?.id ?? 'complete';
        if (sim.logic.state.flags.isSet('story.ardencia_asked') && chapter3.at(-1) !== id3) chapter3.push(id3);
      }
      if (ACT4.maps.includes(sim.logic.state.player.mapId) && sim.logic.state.flags.isSet('act3.complete')) {
        const id4 = currentObjective(ACT4, sim.logic.state.flags)?.id ?? 'complete';
        if (chapter4.at(-1) !== id4) chapter4.push(id4);
      }
      if (ACT5.maps.includes(sim.logic.state.player.mapId)) {
        const id5 = currentObjective(ACT5, sim.logic.state.flags)?.id ?? 'complete';
        if (chapter5.at(-1) !== id5) chapter5.push(id5);
      }
      if (eras.at(-1) !== sim.logic.era) eras.push(sim.logic.era);
      if (maps.at(-1) !== sim.logic.state.player.mapId) maps.push(sim.logic.state.player.mapId);
    }
  }

  it('reaches the end of the act and shows the card, then the ferry lands in Xaraguá', () => {
    expect(sim.logic.state.flags.isSet('act1.complete')).toBe(true);
    expect(sim.logic.state.flags.isSet('card.act1_end')).toBe(true);
    expect(sim.logic.state.flags.isSet('story.xaragua_arrived')).toBe(true);
    expect(sim.logic.mode).toBe('field');
  });

  it('the party keeps everything from one chapter to the next: bag, gear, gold, XP, spells, members, books', () => {
    expect(Object.keys(atChapterEnd).length).toBeGreaterThan(5);
    expect(atChapterEnd['item.boar_tusk'] ?? atChapterEnd['equip.gianna.charm']).toBeTruthy();
    const now = sim.logic.state.flags.snapshot();
    for (const [k, v] of Object.entries(atChapterEnd)) {
      // The story itself moves Anissa: she hides in the cave once the Crown attacks (Chapter 2's midpoint).
      if (k === 'party.anissa') continue;
      // Counts and totals only grow on the way (the pier fight pays XP, gold and casabe); the rest is unchanged.
      if (typeof v === 'number') expect(now[k] as number, k).toBeGreaterThanOrEqual(v);
      else expect(now[k], k).toEqual(v);
    }
  });

  it('Chapter 2: the pier, Anaco, the council, Thorne, the cave, the lock, the proof, the attack, the occupied city, Thorne; home to Zetwal', () => {
    expect(atChapter2End.battles).toEqual(['intro_boar', 'pier_marines', 'encounter:mountain_path/crabs', 'caney_breach', 'village_patrol', 'thorne_blockade']);
    expect(chapter2).toEqual(['pier', 'anaco', 'council', 'thorne', 'lamp_ask', 'dusk', 'lamp', 'cave', 'areito', 'lock', 'proof', 'escape', 'held', 'visit', 'blockade']);
    expect(atChapter2End.flags['clue.seventh_clause']).toBe(true);
    expect(atChapter2End.flags['card.xaragua_falls']).toBe(true);
    expect(atChapter2End.flags['card.act2_end']).toBe(true);
    expect(atChapter2End.map).toBe('zetwal-harbor');
  });

  it('Chapter 3: the voyage, the gate and Azzy, the audience, the day in the city, the trial, the forge, the tunnel, the sea road, the camp', () => {
    const flags = new FlagStoreView(atChapter3End.flags);
    // Every objective in order (Grandfather's request was done at Chapter 2's end; "The Lord's guests" begins and
    // ends inside the one long scene from the trial to Azzy's key, so the route never stops on it).
    expect(chapter3).toEqual([...ACT3.objectives.map((o) => o.id).filter((id) => id !== 'request' && id !== 'guests'), 'complete']);
    expect(flags.isSet('story.forge_open')).toBe(true);
    expect(atChapter3End.battles.slice(6)).toEqual(['rael_trial', 'tunnel_bats']);
    expect(flags.isSet('act3.complete') && flags.isSet('card.act3_end')).toBe(true);
    expect(atChapter3End.map).toBe('ardencia-camp');
    // The trial is lost, never won; the question is asked and the halves glow; Gianna believes the lie.
    expect(flags.isSet('encounter.ardencia_story.rael.won')).toBe(false);
    for (const f of ['story.trial_fought', 'story.signet_glowed', 'clue.father_rael', 'belief.rael_traitor']) expect(flags.isSet(f), f).toBe(true);
    // The forge's Echo: three gates and Benny's lever carried back; Azzy joins in the dark, Benny in the Echo party.
    for (const f of ['anchor.forge_gate_a', 'anchor.forge_gate_b', 'anchor.forge_gate_c', 'anchor.benny_lever']) expect(flags.isSet(f), f).toBe(true);
    expect(partyMembers(flags, RPG, 'present').map((m) => m.id)).toEqual(['gianna', 'anissa', 'yari', 'azzy']);
    expect(partyMembers(flags, RPG, 'echo').map((m) => m.id)).toEqual(['patricio', 'benny', 'caona']);
    expect(flags.isSet('story.ardencia_escaped') && flags.isSet('ally.free_brasador')).toBe(true);
  });

  it('Chapter 4: the strand, the quay, Samira, the Majlis, the day in the city, the vault, Qasim, the Merchant-Prince\'s word, the caravan', () => {
    const flags = new FlagStoreView(atChapter4End.flags);
    // Every objective in order (the lead was done at Chapter 3's end; "The guild's blades" and "The Merchant-Prince's
    // word" begin and end inside the one scene from the chest to Layla's descent, so the route never stops on them).
    expect(chapter4).toEqual([...ACT4.objectives.map((o) => o.id).filter((id) => !['lead', 'blades', 'word'].includes(id)), 'complete']);
    expect(atChapter4End.battles.slice(8)).toEqual(['qasim_vault']);
    expect(flags.isSet('act4.complete') && flags.isSet('card.act4_end')).toBe(true);
    expect(atChapter4End.map).toBe('aldoria-desert');
    // Samira joins in the vault, before the fight; the copy stays, the seventh page is sealed; the pass and the coin.
    expect(partyMembers(flags, RPG, 'present').map((m) => m.id)).toEqual(['gianna', 'anissa', 'yari', 'azzy', 'samira']);
    for (const f of ['story.samira_joined', 'clue.sealed_seventh', 'clue.harbor_price', 'clue.brasador_coin', 'item.dorini_pass', 'item.benny_half_sheet', 'item.brasador_coin']) {
      expect(flags.isSet(f), f).toBe(true);
    }
    // The two anchors: the sun lock and the cistern pin; the fountain runs.
    for (const f of ['anchor.vault_sunlock', 'anchor.cistern_pin', 'side.sweet_water.done', 'side.appraise.done', 'debate.aldoria_bargain.settled']) expect(flags.isSet(f), f).toBe(true);
    // Coralie was met in the cloth row and sailed on before the vault.
    expect(flags.isSet('story.coralie_met') && flags.isSet('story.coralie_left')).toBe(true);
    for (const name of ['Samira', 'Layla', 'Qasim', 'Tati Coco', 'Yusuf', 'Locksmith', 'Water-carrier']) expect(speakers).toContain(name);
  });

  it('Chapter 5: the Gold Gate, the herald, the welcome, Coco, the day, the bell, the sealing, the keeper, the Parley, the fitting, the Iron Gate', () => {
    const flags = sim.logic.state.flags;
    // Every objective in order (the Regent's terms are refused in the same scene the clause is read in, so the route
    // never stops on them; the Gold Road is done by the arrival itself, before the route takes a step).
    expect(chapter5).toEqual([...ACT5.objectives.map((o) => o.id).filter((id) => !['road', 'terms'].includes(id)), 'complete']);
    expect(sim.battles.slice(atChapter4End.battles.length)).toEqual(['deserters_road']);
    expect(flags.isSet('act5.complete') && flags.isSet('card.act5_end')).toBe(true);
    expect(sim.logic.state.player.mapId).toBe('seat-concourse');
    expect(sim.logic.mode).toBe('field');
    // The party is whole again after the Archive; the Echo party is unchanged.
    expect(partyMembers(flags, RPG, 'present').map((m) => m.id)).toEqual(['gianna', 'anissa', 'yari', 'azzy', 'samira']);
    expect(partyMembers(flags, RPG, 'echo').map((m) => m.id)).toEqual(['patricio', 'benny', 'caona']);
    for (const f of ['clue.elodie_locket_line', 'clue.elodie_tested_line', 'clue.seventh_clause_read', 'anchor.ribbon_thread', 'story.hollis_agreed', 'story.terms_refused', 'side.seats.stage1', 'side.deserters.done', 'debate.seat_voices.settled', 'belief.rael_traitor']) {
      expect(flags.isSet(f), f).toBe(true);
    }
    expect(flags.isSet('story.disguised') || flags.isSet('story.party_split')).toBe(false);
    for (const name of ['The Lord Regent', 'Elodie', 'Tati Coco', 'Keeper Hollis', 'Master of the Chairs', 'Herald', 'Deserter sergeant', 'Benny', "The Throne's clerk"]) expect(speakers).toContain(name);
  });

  it('Chapter 3: the two required side quests and the debate are done before noon, and pay', () => {
    for (const id of ['treasurer', 'thief', 'bread']) {
      const q = SIDE_QUESTS.find((x) => x.id === id)!;
      expect(sideQuestStatus(new FlagStoreView(atNoon as FlagSnapshot), q), id).toBe('done');
    }
    expect(atNoon['debate.ardencia_bread.mediated']).toBe(true);
    expect(atNoon['clue.treasurer_alive']).toBe(true);
    expect(atNoon['side.bread.done']).toBe(true);
    // Night has passed by the trial.
    expect(atNoon['story.cart_night']).toBe(false);
    // The rewards (the field pays them as each quest finishes): Benny's Refusal is in the bag by the camp.
    settleRewards(sim.logic.state.flags, RPG, SIDE_QUESTS);
    expect(sim.logic.state.flags.get('item.bennys_refusal')).toBe(true);
  });

  it('the petroglyph cave: the sluice opened in the memory drains it, the areíto gives the last bar, the stones open the record house', () => {
    const flags = sim.logic.state.flags;
    expect(flags.isSet('anchor.cave_sluice')).toBe(true);
    expect(flags.isSet('clue.drum_pattern')).toBe(true);
    expect(flags.isSet('clue.drum_full')).toBe(true);
    expect(sim.rhythms).toEqual(['record_lock']);
    expect(flags.isSet('story.lock_opened')).toBe(true);
    expect(flags.isSet('story.oath_found')).toBe(true);
    // Caona joins the Echo party at the areíto.
    expect(flags.isSet('story.caona_joined')).toBe(true);
    expect(speakers.has('Caona')).toBe(true);
  });

  it('meets every objective, in order', () => {
    expect(objectives).toEqual([...ACT1.objectives.map((o) => o.id), 'complete']);
  });

  it('visits every Zetwal map and swaps eras', () => {
    // Chapter 1's maps, the temple archive (the Overdue Shelf, required before sailing), and (at the end of
    // Chapter 2) home to Pòdlimyè's Old Harbor. Not the Iron Market: since Batch D (Oct 19) the engraver brings
    // the seal to the Hall, and the Market is the city's shop street, off the story's way.
    const story = ACT1.maps.filter((m) => m !== 'zetwal-market');
    expect(new Set(maps.filter((m) => m.startsWith('zetwal-')))).toEqual(new Set([...story, 'zetwal-archive', 'zetwal-harbor']));
    for (const m of ['xaragua-village', 'xaragua-plaza', 'xaragua-caney', 'xaragua-customs']) expect(maps).toContain(m);
    expect(eras.filter((e) => e === 'echo').length).toBeGreaterThanOrEqual(2);
    expect(sim.log).toContain('Something old stirs here, but it will not open to you yet.');
  });

  it('hears from the family', () => {
    // The engraver and the Crown's consul play their scenes in the Hall (Batch D, Oct 19).
    for (const name of ['Gianna', 'Elodie', 'Anissa', 'Anissa (at the door)', 'Anicette', 'Patricio', 'Aide', 'Yari', 'Engraver', "The Crown's consul", 'Cacique Anaco', 'Governor Thorne', 'Marine sergeant']) {
      expect(speakers).toContain(name);
    }
    // Ardencia: Rael and his court, his guard, and his family in their settled roles (FAMILY.md).
    for (const name of ['Azzy', 'Rael', 'Rivera', 'Jaime', 'Envoy Cresswell', 'Zelia', 'Amanda', 'Joaquin', 'Benny', 'Nancy']) {
      expect(speakers).toContain(name);
    }
  });

  it('autosaves along the way', () => {
    expect(sim.saves).toBeGreaterThan(5);
  });
});
