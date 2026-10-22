// The whole of Chapter 1, Zetwal, Chapter 2 in Xaraguá and Chapter 3 in Ardencia, played headlessly from a new
// game by the scripted route the smoke test also drives in the browser (routes/zetwal-act1.json).

import { describe, expect, it } from 'vitest';
import { ACT1, ACT2, ACT3, ACT4, ACT5, ACT6, ACT7, ACT8, ACT9, ACT10 } from '../src/data/quests.ts';
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
  const chapter6: string[] = [];
  const chapter7: string[] = [];
  const chapter8: string[] = [];
  const chapter9: string[] = [];
  const chapter10: string[] = [];
  /** Where the party stood, and what it had fought, as Chapter 9's card shows (the route goes on into Chapter 10). */
  let atChapter9End: { flags: FlagSnapshot; map: string; battles: string[]; mode: string } = { flags: {}, map: '', battles: [], mode: '' };
  /** Where the party stood, and what it had fought, on Agnipur's quay at Chapter 8's end (the route goes on into Chapter 9). */
  let atChapter8End: { flags: FlagSnapshot; map: string; battles: string[]; mode: string } = { flags: {}, map: '', battles: [], mode: '' };
  /** Where the party stood, and what it had fought, as Chapter 7's card shows (the route goes on into Chapter 8). */
  let atChapter7End: { flags: FlagSnapshot; map: string; battles: string[]; mode: string } = { flags: {}, map: '', battles: [], mode: '' };
  /** Where the party stood, and what it had fought, as Chapter 6's card shows (the route goes on into Chapter 7). */
  let atChapter6End: { flags: FlagSnapshot; map: string; battles: string[]; mode: string } = { flags: {}, map: '', battles: [], mode: '' };
  /** Where the party stood, and what it had fought, as Chapter 5's card shows (the route goes on into Chapter 6). */
  let atChapter5End: { flags: FlagSnapshot; map: string; battles: string[]; mode: string } = { flags: {}, map: '', battles: [], mode: '' };
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
    if (item.kind === 'mark' && item.name === 'chapter5-end') {
      atChapter5End = { flags: sim.logic.state.flags.snapshot(), map: sim.logic.state.player.mapId, battles: [...sim.battles], mode: sim.logic.mode };
    }
    if (item.kind === 'mark' && item.name === 'chapter6-end') {
      atChapter6End = { flags: sim.logic.state.flags.snapshot(), map: sim.logic.state.player.mapId, battles: [...sim.battles], mode: sim.logic.mode };
    }
    if (item.kind === 'mark' && item.name === 'chapter7-end') {
      atChapter7End = { flags: sim.logic.state.flags.snapshot(), map: sim.logic.state.player.mapId, battles: [...sim.battles], mode: sim.logic.mode };
    }
    if (item.kind === 'mark' && item.name === 'chapter9-end') {
      atChapter9End = { flags: sim.logic.state.flags.snapshot(), map: sim.logic.state.player.mapId, battles: [...sim.battles], mode: sim.logic.mode };
    }
    if (item.kind === 'mark' && item.name === 'chapter8-end') {
      atChapter8End = { flags: sim.logic.state.flags.snapshot(), map: sim.logic.state.player.mapId, battles: [...sim.battles], mode: sim.logic.mode };
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
      // (Chapter 11 lands on the Canoe Beach, a Chapter 2 map: its tracking stops at Chapter 10's end.)
      if (ACT2.maps.includes(sim.logic.state.player.mapId) && !sim.logic.state.flags.isSet('act10.complete')) {
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
      if (ACT6.maps.includes(sim.logic.state.player.mapId)) {
        const id6 = currentObjective(ACT6, sim.logic.state.flags)?.id ?? 'complete';
        if (chapter6.at(-1) !== id6) chapter6.push(id6);
      }
      if (ACT7.maps.includes(sim.logic.state.player.mapId)) {
        const id7 = currentObjective(ACT7, sim.logic.state.flags)?.id ?? 'complete';
        if (chapter7.at(-1) !== id7) chapter7.push(id7);
      }
      if (ACT8.maps.includes(sim.logic.state.player.mapId)) {
        const id8 = currentObjective(ACT8, sim.logic.state.flags)?.id ?? 'complete';
        if (chapter8.at(-1) !== id8) chapter8.push(id8);
      }
      if (sim.logic.state.flags.isSet('act9.complete') && sim.logic.state.player.mapId.startsWith('zetwal-')) {
        const id10 = currentObjective(ACT10, sim.logic.state.flags)?.id ?? 'complete';
        if (chapter10.at(-1) !== id10) chapter10.push(id10);
      }
      if (ACT9.maps.includes(sim.logic.state.player.mapId)) {
        const id9 = currentObjective(ACT9, sim.logic.state.flags)?.id ?? 'complete';
        if (chapter9.at(-1) !== id9) chapter9.push(id9);
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
    const flags = new FlagStoreView(atChapter5End.flags);
    // Every objective in order (the Regent's terms are refused in the same scene the clause is read in, so the route
    // never stops on them; the Gold Road is done by the arrival itself, before the route takes a step).
    expect(chapter5).toEqual([...ACT5.objectives.map((o) => o.id).filter((id) => !['road', 'terms'].includes(id)), 'complete']);
    expect(atChapter5End.battles.slice(atChapter4End.battles.length)).toEqual(['deserters_road']);
    expect(flags.isSet('act5.complete') && flags.isSet('card.act5_end')).toBe(true);
    // The card shows at the Iron Gate; closing it takes the party up the winter road (Chapter 6).
    expect(atChapter5End.map).toBe('seat-concourse');
    expect(atChapter5End.mode).toBe('card');
    // The party is whole again after the Archive; the Echo party is unchanged.
    expect(partyMembers(flags, RPG, 'present').map((m) => m.id)).toEqual(['gianna', 'anissa', 'yari', 'azzy', 'samira']);
    expect(partyMembers(flags, RPG, 'echo').map((m) => m.id)).toEqual(['patricio', 'benny', 'caona']);
    for (const f of ['clue.elodie_locket_line', 'clue.elodie_tested_line', 'clue.seventh_clause_read', 'anchor.ribbon_thread', 'story.hollis_agreed', 'story.terms_refused', 'side.seats.stage1', 'side.deserters.done', 'debate.seat_voices.settled', 'belief.rael_traitor']) {
      expect(flags.isSet(f), f).toBe(true);
    }
    expect(flags.isSet('story.disguised') || flags.isSet('story.party_split')).toBe(false);
    for (const name of ['The Lord Regent', 'Elodie', 'Tati Coco', 'Keeper Hollis', 'Master of the Chairs', 'Herald', 'Deserter sergeant', 'Benny', "The Throne's clerk"]) expect(speakers).toContain(name);
  });

  it('Chapter 6: the winter road, the fair, the Moot, the day, the fjord\'s five swaps, Sarnai\'s raid, the herd, Grimvald, the horn, the longship', () => {
    const flags = new FlagStoreView(atChapter6End.flags);
    // Every objective in order (the winter road is done by the arrival itself; the ride round and the price are done
    // inside the scenes that begin them, so the route never stops on them).
    expect(chapter6).toEqual([...ACT6.objectives.map((o) => o.id).filter((id) => !['road', 'round', 'price'].includes(id)), 'complete']);
    expect(atChapter6End.battles.slice(atChapter5End.battles.length)).toEqual(['winter_wolves', 'fjord_grimvald']);
    expect(flags.isSet('act6.complete') && flags.isSet('card.act6_end') && flags.isSet('card.round_fjord')).toBe(true);
    // The card shows on the quay; closing it sails the longship to Kirinoura (Chapter 7).
    expect(atChapter6End.map).toBe('skarragol-quay');
    expect(atChapter6End.mode).toBe('card');
    // Bayarmaa joins at the Moot and stays; the Echo party is unchanged.
    expect(partyMembers(flags, RPG, 'present').map((m) => m.id)).toEqual(['gianna', 'anissa', 'yari', 'azzy', 'samira', 'bayarmaa']);
    expect(partyMembers(flags, RPG, 'echo').map((m) => m.id)).toEqual(['patricio', 'benny', 'caona']);
    for (const f of ['party.bayarmaa', 'story.bayarmaa_cleared', 'ally.skarragol', 'clue.herd_whistle', 'clue.crown_pays_raiders', 'anchor.wolf_run', 'story.herd_unseen', 'story.standard_planted', 'side.grandson.done', 'side.winter_stores.done', 'debate.skarragol_oath.settled', 'item.token_ironvow', 'item.torvald_letter', 'belief.rael_traitor']) {
      expect(flags.isSet(f), f).toBe(true);
    }
    for (const name of ['Bayarmaa', 'Salkhi', 'Torvald', 'Lawspeaker', 'Hrafn', "The Crown's envoy", 'Grimvald', 'Sarnai', 'Envoy in white', 'Herder']) expect(speakers).toContain(name);
  });

  it('Chapter 7: the mist, the letter, the day (K-2 and the debate), the lantern hour, the maze, the marsh, the file house, the Fox, the files, the petition, the pier', () => {
    const flags = new FlagStoreView(atChapter7End.flags);
    // Every objective in order (the landing is done by the arrival itself, so the route never stops on it).
    expect(chapter7).toEqual([...ACT7.objectives.map((o) => o.id).filter((id) => id !== 'mist'), 'complete']);
    // The stacks are walked unseen on the route: the moths and the Fox are its fights.
    expect(atChapter7End.battles.slice(atChapter6End.battles.length)).toEqual(['marsh_moths', 'file_house_fox']);
    expect(flags.isSet('act7.complete') && flags.isSet('card.act7_end')).toBe(true);
    // The card shows on the pier; closing it sails the Zetwal trader across the bay to Agnipur (Chapter 8).
    expect(atChapter7End.map).toBe('kuroshi-pier');
    expect(atChapter7End.mode).toBe('card');
    // Haru joins at the lantern hour and stays; the Echo party is unchanged.
    expect(partyMembers(flags, RPG, 'present').map((m) => m.id)).toEqual(['gianna', 'anissa', 'yari', 'azzy', 'samira', 'bayarmaa', 'haru']);
    expect(partyMembers(flags, RPG, 'echo').map((m) => m.id)).toEqual(['patricio', 'benny', 'caona']);
    for (const f of ['party.haru', 'story.haru_left_kirinoura', 'ally.kuroshi', 'item.token_suzumori', 'item.fog_files', 'clue.buyers_mark', 'clue.ardencia_outflows', 'clue.fox_receipts', 'clue.lantern_code', 'clue.sayo_network', 'anchor.screen_peg', 'side.spy_ledger.done', 'side.lanterns.done', 'debate.kuroshi_silence.settled', 'item.kayla_crane', 'item.haru_lantern', 'belief.rael_traitor']) {
      expect(flags.isSet(f), f).toBe(true);
    }
    for (const name of ['Haru', 'Kayla', 'Kaede', 'Signal master', 'Retainer for neutrality', 'Retainer for war', "The Crown's observer", 'The broker', 'The Paper Fox', 'Sayo', 'Old fisher']) expect(speakers).toContain(name);
  });

  it('Chapter 8: under the chain, the stair, Aiyana\'s roof, the Court and the duel, the day (J-2, J-3, the debate), the tower, Arjun\'s night, the roofs, the flame, Dhanraj, the price, the quay', () => {
    const flags = new FlagStoreView(atChapter8End.flags);
    // Every objective in order (the landing is done by the arrival itself, so the route never stops on it).
    expect(chapter8).toEqual([...ACT8.objectives.map((o) => o.id).filter((id) => id !== 'chain'), 'complete']);
    // The duel (lost on the route: the headless run ends a sparring match as a loss), the salt road and the Seth.
    expect(atChapter8End.battles.slice(atChapter7End.battles.length)).toEqual(['duel_yard_vikram', 'salt_road_enforcers', 'oil_store_dhanraj']);
    expect(flags.isSet('act8.complete') && flags.isSet('card.act8_end')).toBe(true);
    expect(atChapter8End.map).toBe('jwaladesh-harbor');
    expect(atChapter8End.mode).toBe('card');
    // Vikram joins at the flame and stays; the Echo party is unchanged.
    expect(partyMembers(flags, RPG, 'present').map((m) => m.id)).toEqual(['gianna', 'anissa', 'yari', 'azzy', 'samira', 'bayarmaa', 'haru', 'vikram']);
    expect(partyMembers(flags, RPG, 'echo').map((m) => m.id)).toEqual(['patricio', 'benny', 'caona']);
    for (const f of ['party.vikram', 'story.vikram_left_agnipur', 'ally.jwaladesh', 'item.token_agnivansh', 'item.token_suzumori', 'item.token_ironvow', 'item.dhanraj_ledger', 'item.aiyana_disc', 'clue.crown_holds_oil', 'clue.relay_route', 'clue.arjun_charge', 'anchor.chain_lamp', 'anchor.tower_mirror', 'story.crane_accepted', 'side.lamp_relay.done', 'side.anonymous_oil.done', 'debate.jwaladesh_hesitation.settled', 'story.anissa_keeper', 'choice.duel_lost', 'belief.rael_traitor']) {
      expect(flags.isSet(f), f).toBe(true);
    }
    for (const name of ['Vikram', 'Aiyana', 'Meera', 'Senior Keeper', 'Junior priest', "The Crown's oil-factor", 'Seth Dhanraj', 'Arjun', 'Chief runner', 'Carter', 'Oil Enforcer']) expect(speakers).toContain(name);
  });

  it('Chapter 9: the Mere Stair, the Cross, the audience, the day (Al-3, the debate, Jordyn, Sebastian), the recital, the archive, caught, the Assize, the Hushed, the price, home', () => {
    const flags = sim.logic.state.flags;
    // Every objective in order (the landing is done by the arrival itself; the toccata objective follows the side quests).
    expect(chapter9).toEqual([...ACT9.objectives.map((o) => o.id).filter((id) => id !== 'mere'), 'complete']);
    // The press-gang on the Cross, the bog chapel's cell (Al-3) and the Hushed in the Assize.
    expect(atChapter9End.battles.slice(atChapter8End.battles.length)).toEqual(['press_gang_cross', 'bog_chapel_cell', 'assize_hushed']);
    expect(flags.isSet('act9.complete') && flags.isSet('card.act9_end')).toBe(true);
    // The card shows on the Mere Stair; closing it, the trader lands them on Zetwal's harbour (Chapter 10 starts there).
    expect(atChapter9End.map).toBe('aldermoor-heath');
    expect(atChapter9End.mode).toBe('card');
    // Edmund joins at the press-gang on the Cross and leads the order for the chapter; after it he stays, behind the others.
    expect(partyMembers(flags, RPG, 'present').map((m) => m.id)).toContain('edmund');
    expect(partyMembers(flags, RPG, 'echo').map((m) => m.id)).toEqual(['patricio', 'benny', 'caona']);
    for (const f of ['party.edmund', 'ally.aldermoor_dissidents', 'clue.crown_pact', 'anchor.thomas_record', 'story.caught', 'story.hushed_beaten', 'story.jordyn_offer', 'story.sebastian_met', 'story.families_warned', 'side.purge_list.done', 'side.crown_chronicle.done', 'debate.aldermoor_one_hand.settled', 'belief.rael_traitor']) {
      expect(flags.isSet(f), f).toBe(true);
    }
    for (const name of ['Edmund', 'Jordyn', 'Sebastian', 'The Almoner', 'The Lord Regent']) expect(speakers).toContain(name);
  });

  it('Chapter 10: the pier, the camp, the council, the watch, the kitchen, the lamp, the stone, the allies seated, the vote, the whistle, under the point, the tide', () => {
    const flags = sim.logic.state.flags;
    // Every objective in order, the pier's scene first as the party lands.
    expect(chapter10).toEqual([...ACT10.objectives.map((o) => o.id), 'complete']);
    // The crew at the smugglers' landing (Z-6); the route meets no ambush on the Cane Road.
    expect(sim.battles.slice(atChapter9End.battles.length)).toEqual(['mangrove_crew']);
    expect(flags.isSet('act10.complete') && flags.isSet('card.act10_end')).toBe(true);
    // The fleet sails: Chapter 11 lands on the Canoe Beach below Yucayeque.
    expect(sim.logic.state.player.mapId).toBe('xaragua-beach');
    expect(sim.logic.mode).toBe('field');
    for (const f of ['story.pier_met', 'story.plaza_camp_seen', 'story.council_condition', 'story.watch_landed', 'story.rahel_met', 'story.blessing', 'story.patricio_told', 'clue.four_accounts', 'clue.signing_morning', 'side.muskets.done', 'anchor.mill_bar', 'side.lonely_cutter.done', 'debate.zetwal_feud_merchants.settled', 'debate.zetwal_feud_temple.settled', 'debate.zetwal_feud_crown.settled', 'story.council_voted', 'story.chain_raised', 'story.inspection_done', 'muster.resolved', 'story.betrayal_seen', 'item.marshal_whistle', 'belief.rael_traitor']) {
      expect(flags.isSet(f), f).toBe(true);
    }
    // The headless route pays no side quest (the field does), so the Dorini are least paid and not exposable: they sail.
    expect(flags.get('muster.betrayer')).toBe('al_doria');
    expect(flags.isSet('muster.betrayed') && flags.isSet('muster.gone.al_doria')).toBe(true);
    expect(flags.get('army.al_doria')).toBe(0);
    expect(flags.get('army.zetwal')).toBe(60);
    for (const name of ['Rahel', 'Patricia', 'Tío Joaquin', 'Jordyn', 'Ti Jak', 'The Dorini admiral', 'Hrafn', 'Powder-master', 'Crew chief']) expect(speakers).toContain(name);
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
    // Chapter 10 (the Muster) adds the Iron Market (the first feud) and the mill's cellar (Z-6).
    expect(new Set(maps.filter((m) => m.startsWith('zetwal-')))).toEqual(new Set([...story, 'zetwal-archive', 'zetwal-harbor', 'zetwal-market', 'zetwal-mill']));
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
