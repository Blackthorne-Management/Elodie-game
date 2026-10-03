// The 120-card Shared Action Deck (docs/bloodline-card-list.md), with rulings from docs/rules-decisions.md.
// Card text is the printed text; `effect` carries it out through the engine's helpers.
import type { AttackInfo, CardDef } from '../engine/content';
import type { Game } from '../engine/game';
import type { Flow, Pillar, PlayerState, Pos } from '../engine/types';
import { PILLARS } from '../engine/types';
import { shuffle } from '../engine/rng';
import { THRONE, dirAway, key, manhattan, samePos, squaresWithin, throneDistance } from '../engine/board';

type Effect = (g: Game, self: PlayerState, card: CardDef) => Flow;
type Extra = Partial<Omit<CardDef, 'id' | 'name' | 'kind' | 'category' | 'text' | 'effect'>>;

const defs: CardDef[] = [];
const hand = (id: number, name: string, category: string, text: string, effect: Effect, extra: Extra = {}) =>
  defs.push({ id, name, kind: 'hand', category, text, effect, ...extra });
const instant = (id: number, name: string, category: string, text: string, effect: Effect, extra: Extra = {}) =>
  defs.push({ id, name, kind: 'instant', category, text, effect, ...extra });

// ---------------------------------------------------------------- small helpers

function* nothing(): Flow { /* no effect */ }
const others = (g: Game, p: PlayerState) => g.others(p);
const withCards = (ps: PlayerState[]) => ps.filter(o => o.hand.length > 0);
const odd = (n: number) => n % 2 === 1;
const tradeTiles = (g: Game) => g.tilesOfType('trade');

function* pickTarget(g: Game, p: PlayerState, card: CardDef, candidates: PlayerState[], prompt: string): Flow<PlayerState | null> {
  return yield* g.targetPlayer(p, candidates, `${card.name}: ${prompt}`, card);
}

function* chooseOwnCard(g: Game, p: PlayerState, prompt: string): Flow<number | null> {
  if (!p.hand.length) return null;
  return yield* g.ask(p, 'card', prompt, p.hand.map(c => ({ label: g.card(c).name, value: c })));
}

// Swap: `a` gives a chosen card, gets a random (or chosen, if they can see) card from `b`.
function* barter(g: Game, a: PlayerState, b: PlayerState, why: string, seeTheirs = false): Flow {
  if (!a.hand.length || !b.hand.length) return;
  const give = (yield* chooseOwnCard(g, a, `${why}: choose a card to give ${b.name}`))!;
  const take = seeTheirs
    ? yield* g.ask(a, 'card', `${why}: choose a card to take from ${b.name}`, b.hand.map(c => ({ label: g.card(c).name, value: c })))
    : g.randomItem(b.hand);
  a.hand = a.hand.filter(c => c !== give);
  b.hand = b.hand.filter(c => c !== take);
  a.hand.push(take);
  b.hand.push(give);
  g.log(`${a.name} and ${b.name} swap a card.`, 'barter', { player: a.id, target: b.id });
}

function* everyone(g: Game, from: PlayerState, fn: (p: PlayerState) => Flow | void): Flow {
  const order = [from, ...g.seatsAfter(from)].filter(p => !p.specter);
  for (const p of order) {
    const r = fn(p);
    if (r) yield* r;
  }
  yield* g.flushDeaths();
}

function* hpLoss(g: Game, p: PlayerState | null, n: number, why: string, killer: PlayerState | null = null): Flow {
  if (!p || p.specter) return;
  g.damage(p, n, killer?.id ?? null, `(${why})`);
  yield* g.flushDeaths();
}

function* cardAttack(g: Game, p: PlayerState, card: CardDef, candidates: PlayerState[], unblockable: boolean): Flow {
  const t = yield* g.targetPlayer(p, candidates, `${card.name}: attack whom?`);
  if (t) yield* g.attack(p, t, 'card', 1, unblockable);
}

const attackable = (g: Game, p: PlayerState, filter: (o: PlayerState) => boolean = () => true) =>
  others(g, p).filter(o => filter(o) && !g.attackBlockedReason(p, o, 'card'));

const ownTile = (g: Game, p: PlayerState): Pos => g.house(p).home;

// ---------------------------------------------------------------- HAND CARDS

// Influence / Court
hand(1, 'Royal Favor', 'Influence / Court', 'Gain 2 Influence.', function* (g, p) { g.gain(p, 'influence', 2); });
hand(2, 'Noble Alliance', 'Influence / Court', 'Gain 1 Influence. If you are adjacent to another player, gain 1 more.',
  function* (g, p) { g.gain(p, 'influence', g.adjacentTo(p).length ? 2 : 1); });
hand(3, 'Whispered Promise', 'Influence / Court', 'Gain 2 Influence, but reveal your hand to one player of your choice.',
  function* (g, p) {
    g.gain(p, 'influence', 2);
    const to = yield* g.choosePlayer(p, others(g, p), 'Whispered Promise: reveal your hand to whom?');
    if (to) g.reveal(p, [to.id], 'Whispered Promise');
  });
hand(4, 'Court Scandal', 'Influence / Court', 'Gain 1 Influence. Target player loses 1 Influence.',
  function* (g, p, c) {
    g.gain(p, 'influence', 1);
    const t = yield* pickTarget(g, p, c, others(g, p), 'who loses 1 Influence?');
    if (t) g.lose(t, 'influence', 1, c.name);
  }, { aggressive: true });
hand(5, 'Diplomatic Envoy', 'Influence / Court', 'Gain 1 Influence and move 1 extra space this turn.',
  function* (g, p) { g.gain(p, 'influence', 1); yield* g.extraMove(p, 1); });
hand(6, 'Silver Tongue', 'Influence / Court', 'Gain 1 Influence. If you currently have 0 Fear, gain 1 more.',
  function* (g, p) { g.gain(p, 'influence', p.res.fear === 0 ? 2 : 1); });
hand(7, 'Ancient Charter', 'Influence / Court', 'Gain 2 Influence if you are on a Court tile this turn.',
  function* (g, p) { if (g.onTileType(p, 'court')) g.gain(p, 'influence', 2); else g.log('Not on a Court tile: no effect.', 'info'); });

// Fear / War
hand(8, 'Burn the Village', 'Fear / War', 'Gain 2 Fear, but you cannot gain Influence next turn.',
  function* (g, p) { g.gain(p, 'fear', 2); g.addNextTurnEffect('noInfluenceGain', p.id); });
hand(9, 'Silent Threat', 'Fear / War', 'Target player discards 1 card of their choice. Gain 1 Fear.',
  function* (g, p, c) {
    const t = yield* pickTarget(g, p, c, others(g, p), 'who discards?');
    if (t?.hand.length) {
      const d = (yield* chooseOwnCard(g, t, 'Silent Threat: discard a card of your choice'))!;
      g.discardFromHand(t, d);
      g.log(`${t.name} discards ${g.card(d).name}.`, 'discard', { player: t.id, cards: [d] });
    }
    g.gain(p, 'fear', 1);
  }, { aggressive: true });
hand(10, 'Show of Force', 'Fear / War', 'Gain 1 Fear for each adjacent player (max 2).',
  function* (g, p) { g.gain(p, 'fear', Math.min(2, g.adjacentTo(p).length)); });
hand(11, 'Blood Oath', 'Fear / War', 'Gain 2 Fear. Lose 1 Heart Token.',
  function* (g, p) { g.gain(p, 'fear', 2); g.damage(p, 1, null, '(Blood Oath)'); });
hand(12, 'Dread Banner', 'Fear / War', 'Gain 1 Fear. Mark this card: your next attack this game deals +1 damage.',
  function* (g, p, c) { g.gain(p, 'fear', 1); g.addEffect('dreadBanner', p.id, { at: 'consumed' }, { cardId: c.id }); });
hand(13, "Conqueror's March", 'Fear / War', 'Gain 1 Fear and move 1 extra space this turn.',
  function* (g, p) { g.gain(p, 'fear', 1); yield* g.extraMove(p, 1); });
hand(14, 'Iron Reputation', 'Fear / War', 'Gain 2 Fear if you are on a War tile this turn.',
  function* (g, p) { if (g.onTileType(p, 'war')) g.gain(p, 'fear', 2); else g.log('Not on a War tile: no effect.', 'info'); });

// Wealth / Trade
hand(15, "Smuggler's Route", 'Wealth / Trade', 'Gain 2 Wealth.', function* (g, p) { g.gain(p, 'wealth', 2); });
hand(16, 'Forged Ledger', 'Wealth / Trade', 'Steal 1 Wealth from an adjacent player.',
  function* (g, p, c) {
    const t = yield* pickTarget(g, p, c, g.adjacentTo(p), 'steal from whom?');
    if (t) g.steal(p, t, 'wealth', 1, c.name);
  }, { aggressive: true, playable: (g, p) => g.adjacentTo(p).length > 0 });
hand(17, 'Caravan Toll', 'Wealth / Trade', 'Gain 1 Wealth for each other player on your current tile (max 2).',
  function* (g, p) { if (p.pos) g.gain(p, 'wealth', Math.min(2, g.playersOn(p.pos).length - 1)); });
hand(18, 'Hidden Vault', 'Wealth / Trade', 'Gain 2 Wealth. Reveal this card to the table immediately when played.',
  function* (g, p) { g.gain(p, 'wealth', 2); });
hand(19, 'Market Day', 'Wealth / Trade', 'Gain 1 Wealth and draw 1 extra Hand Card this turn (hand cap of 3 still applies — discard down if needed).',
  function* (g, p) { g.gain(p, 'wealth', 1); yield* g.drawOne(p); });
hand(20, 'Tax Collector', 'Wealth / Trade', 'Gain 1 Wealth. Target player loses 1 Wealth.',
  function* (g, p, c) {
    g.gain(p, 'wealth', 1);
    const t = yield* pickTarget(g, p, c, others(g, p), 'who loses 1 Wealth?');
    if (t) g.lose(t, 'wealth', 1, c.name);
  }, { aggressive: true });
hand(21, "Merchant's Gambit", 'Wealth / Trade', 'Gain 2 Wealth if you are on a Trade tile this turn.',
  function* (g, p) { if (g.onTileType(p, 'trade')) g.gain(p, 'wealth', 2); else g.log('Not on a Trade tile: no effect.', 'info'); });
hand(22, 'Counterfeit Coin', 'Wealth / Trade', 'Gain 1 Wealth.', function* (g, p) { g.gain(p, 'wealth', 1); });
hand(23, 'Silk Road', 'Wealth / Trade', 'Gain 1 Wealth and move 1 extra space this turn.',
  function* (g, p) { g.gain(p, 'wealth', 1); yield* g.extraMove(p, 1); });
hand(24, 'Golden Harvest', 'Wealth / Trade', 'Gain 2 Wealth, but you may not attack this turn.',
  function* (g, p) {
    g.gain(p, 'wealth', 2);
    if (g.s.turn) g.addEffect('noAttack', p.id, { at: 'turnEnd', player: p.id });
  }, { playable: g => (g.s.turn?.attacks ?? 0) === 0 });
hand(25, 'Black Market Deal', 'Wealth / Trade', 'Gain 1 Wealth. You may Barter 1 card with any player.',
  function* (g, p) {
    g.gain(p, 'wealth', 1);
    const partners = withCards(others(g, p));
    if (!p.hand.length || !partners.length) return;
    if (!(yield* g.confirm(p, 'Black Market Deal: barter a card with another player?', 'Barter', 'Skip'))) return;
    const t = yield* g.choosePlayer(p, partners, 'Barter with whom?');
    if (t) yield* barter(g, p, t, 'Black Market Deal');
  });
hand(26, 'Plunder', 'Wealth / Trade', "Gain 1 Wealth for each Heart Token of damage you've dealt this turn (max 2).",
  function* (g, p) { g.gain(p, 'wealth', Math.min(2, g.s.turn?.player === p.id ? g.s.turn.damageDealt : 0)); });
hand(27, 'Inheritance', 'Wealth / Trade', 'Gain 2 Wealth. If your current generation is III or IV, gain 1 more.',
  function* (g, p) { g.gain(p, 'wealth', p.gen >= 3 ? 3 : 2); });

// Ranged / Cursed Attacks
hand(28, 'Cursed Dagger', 'Ranged / Cursed', 'Attack any player on the board regardless of distance. Deal 1 damage. Can be blocked normally.',
  function* (g, p, c) { yield* cardAttack(g, p, c, attackable(g, p), false); },
  { aggressive: true, playable: (g, p) => attackable(g, p).length > 0 });
hand(29, 'Hex of Withering', 'Ranged / Cursed', 'Target player loses 1 Heart Token at the start of their next turn.',
  function* (g, p, c) {
    const t = yield* pickTarget(g, p, c, others(g, p), 'curse whom?');
    if (t) g.addEffect('hex', t.id, { at: 'consumed' }, { by: p.id, armed: false });
  }, { aggressive: true });
hand(30, 'Poisoned Chalice', 'Ranged / Cursed', 'Target any player (adjacent or not). They lose 1 Heart Token. You lose 1 Wealth.',
  function* (g, p, c) {
    const t = yield* pickTarget(g, p, c, others(g, p), 'poison whom?');
    g.lose(p, 'wealth', 1, c.name);
    if (t) yield* hpLoss(g, t, 1, c.name, p);
  }, { aggressive: true });
hand(31, 'Marked for Death', 'Ranged / Cursed', 'Choose a player. Mark this card: the next attack landed against them this game deals +1 damage, then discard.',
  function* (g, p, c) {
    const t = yield* pickTarget(g, p, c, others(g, p), 'mark whom?');
    if (t) g.addEffect('markedForDeath', t.id, { at: 'consumed' }, { by: p.id, cardId: c.id });
  }, { aggressive: true });
hand(32, 'Shadow Strike', 'Ranged / Cursed', 'Attack any player within 6 spaces. Deal 1 damage. Cannot be blocked.',
  function* (g, p, c) { yield* cardAttack(g, p, c, attackable(g, p, o => !!o.pos && !!p.pos && manhattan(o.pos, p.pos) <= 6), true); },
  { aggressive: true, playable: (g, p) => attackable(g, p, o => !!o.pos && !!p.pos && manhattan(o.pos, p.pos) <= 6).length > 0 });

// Disruption
hand(33, 'Forced Discard', 'Disruption', 'Target player discards 1 card of your choice.',
  function* (g, p, c) {
    const t = yield* pickTarget(g, p, c, withCards(others(g, p)), 'whose card?');
    if (!t?.hand.length) return;
    const d = yield* g.ask(p, 'card', `Choose a card for ${t.name} to discard`, t.hand.map(x => ({ label: g.card(x).name, value: x })));
    g.discardFromHand(t, d);
    g.log(`${t.name} discards ${g.card(d).name}.`, 'discard', { player: t.id, cards: [d] });
  }, { aggressive: true, playable: (g, p) => withCards(others(g, p)).length > 0 });
const loseOne = (id: number, name: string, pillar: Pillar) =>
  hand(id, name, 'Disruption', `Target player loses 1 ${pillar[0].toUpperCase() + pillar.slice(1)}.`,
    function* (g, p, c) {
      const t = yield* pickTarget(g, p, c, others(g, p), `who loses 1 ${pillar}?`);
      if (t) g.lose(t, pillar, 1, c.name);
    }, { aggressive: true });
loseOne(34, 'Broken Trust', 'influence');
loseOne(35, 'Scattered Ranks', 'fear');
loseOne(36, 'Robbed Blind', 'wealth');
hand(37, 'Confusion', 'Disruption', "Target player's next movement roll is reduced by 2 (minimum 1).",
  function* (g, p, c) {
    const t = yield* pickTarget(g, p, c, others(g, p), 'confuse whom?');
    if (t) g.addEffect('confusion', t.id, { at: 'consumed' }, { by: p.id });
  }, { aggressive: true });
hand(38, 'Forced March', 'Disruption', 'Target player must move their full next roll, in a direction of your choice.',
  function* (g, p, c) {
    const t = yield* pickTarget(g, p, c, others(g, p), 'march whom?');
    if (t) g.addEffect('forcedMarch', t.id, { at: 'consumed' }, { by: p.id });
  }, { aggressive: true });
hand(39, 'Whispers of Doubt', 'Disruption', 'Target player reveals their hand to you only.',
  function* (g, p, c) {
    const t = yield* pickTarget(g, p, c, others(g, p), 'whose hand?');
    if (t) g.reveal(t, [p.id], c.name);
  });
hand(40, 'Sabotage', 'Disruption', 'Target player cannot gain resources from tiles on their next turn.',
  function* (g, p, c) {
    const t = yield* pickTarget(g, p, c, others(g, p), 'sabotage whom?');
    if (t) g.addNextTurnEffect('sabotage', t.id, { by: p.id });
  }, { aggressive: true });

// Movement / Positioning
hand(41, 'Swift Steed', 'Movement', 'Move 2 extra spaces this turn.', function* (g, p) { yield* g.extraMove(p, 2); });
hand(42, 'Hidden Path', 'Movement', 'Teleport to any tile you have already visited this game.',
  function* (g, p) {
    const squares = p.visited.filter(k => !p.pos || k !== key(p.pos));
    const to = yield* g.ask(p, 'square', 'Hidden Path: teleport where?', squares.map(k => {
      const [x, y] = k.split(',').map(Number);
      return { label: `(${x + 1}, ${y + 1})`, value: { x, y } };
    }));
    g.teleport(p, to, 'takes a hidden path');
  }, { playable: (_g, p) => p.visited.some(k => !p.pos || k !== key(p.pos)) });
hand(43, 'Scout Ahead', 'Movement', 'Look at the top 3 cards of the draw deck. Rearrange them in any order.',
  function* (g, p) {
    g.ensureDrawPile();
    const n = Math.min(3, g.s.drawPile.length);
    const top = g.s.drawPile.slice(-n).reverse();           // top first; they stay on the deck while she decides
    g.log(`Scout Ahead: the next cards are ${top.map(c => g.card(c).name).join(', ')}.`, 'reveal', { player: p.id, cards: top, visibleTo: [p.id] });
    const order: number[] = [];
    const left = [...top];
    while (left.length) {
      const c = yield* g.ask(p, 'card', order.length ? 'Which card comes next?' : 'Which card goes on top?', left.map(x => ({ label: g.card(x).name, value: x })));
      order.push(c);
      left.splice(left.indexOf(c), 1);
    }
    g.s.drawPile.splice(-n, n, ...order.reverse());
  });
hand(44, 'Forced Retreat', 'Movement', 'Move an adjacent player 2 spaces away from you in a straight line (their choice of direction).',
  function* (g, p, c) {
    const t = yield* pickTarget(g, p, c, g.adjacentTo(p), 'push back whom?');
    if (t?.pos && p.pos) yield* g.moveStraight(t, 2, { full: true, dirs: dirAway(p.pos, t.pos), why: `Forced Retreat: ${p.name} pushes you back 2` });
  }, { aggressive: true, playable: (g, p) => g.adjacentTo(p).length > 0 });
hand(45, 'Vanishing Act', 'Movement', 'After resolving combat this turn, move 1 extra space as a free action.',
  function* (g, p) {
    const t = g.s.turn;
    if (t && t.attacks > 0) yield* g.moveStraight(p, 1, { why: 'Vanishing Act: move 1 space' });
    else if (t) t.vanishingAct = true;
  });
hand(46, 'Bridge the Gap', 'Movement', 'Move directly to any tile within 8 spaces this turn, ignoring the straight-line-only movement rule.',
  function* (g, p) {
    if (!p.pos) return;
    const to = yield* g.ask(p, 'square', 'Bridge the Gap: move where?', squaresWithin(p.pos, 8).map(q => ({ label: `(${q.x + 1}, ${q.y + 1})`, value: q })));
    const t = g.s.turn;
    if (t && t.player === p.id && !t.moved) {
      // Played before moving, it is this turn's move.
      t.moved = true;
      g.moveTo(p, to, 'bridges the gap');
      g.resourceCheck(p);
    } else {
      g.moveTo(p, to, 'bridges the gap');
    }
  });
hand(47, 'Homeward Bound', 'Movement', 'Teleport to your owned tile.',
  function* (g, p) { g.teleport(p, ownTile(g, p), 'returns home'); },
  { playable: (g, p) => !!p.pos && !samePos(p.pos, ownTile(g, p)) });

// Barter
hand(48, 'Traveling Merchant', 'Barter', 'Switch one card in your hand with the player to your left.',
  function* (g, p) { const l = g.leftOf(p); if (l) yield* barter(g, p, l, 'Traveling Merchant'); },
  { playable: (g, p) => p.hand.length >= 2 && (g.leftOf(p)?.hand.length ?? 0) > 0 });
hand(49, 'Uneasy Trade', 'Barter', 'Trade 1 resource point (your choice of type) with any player, one-for-one.',
  function* (g, p, c) {
    const mine = PILLARS.filter(x => p.res[x] > 0);
    const t = yield* pickTarget(g, p, c, others(g, p).filter(o => PILLARS.some(x => o.res[x] > 0)), 'trade with whom?');
    if (!t || !mine.length) return;
    const give = (yield* g.choosePillar(p, `Uneasy Trade: give ${t.name} 1 of`, mine))!;
    const take = yield* g.choosePillar(p, `Uneasy Trade: take 1 from ${t.name} of`, PILLARS.filter(x => t.res[x] > 0));
    if (!take) return;
    g.lose(p, give, 1, c.name); g.gain(t, give, 1, c.name);
    g.lose(t, take, 1, c.name); g.gain(p, take, 1, c.name);
  }, { playable: (g, p) => PILLARS.some(x => p.res[x] > 0) && others(g, p).some(o => PILLARS.some(x => o.res[x] > 0)) });
hand(50, 'Stolen Goods', 'Barter', "Take 1 random card from an adjacent player's hand. They take 1 random card from the discard pile in return.",
  function* (g, p, c) {
    const t = yield* pickTarget(g, p, c, withCards(g.adjacentTo(p)), 'rob whom?');
    if (!t?.hand.length) return;
    const took = g.randomItem(t.hand);
    t.hand = t.hand.filter(x => x !== took);
    p.hand.push(took);
    g.log(`${p.name} takes a card from ${t.name}.`, 'barter', { player: p.id, target: t.id });
    const pile = g.s.discard.filter(x => g.card(x).kind === 'hand');
    if (pile.length) {
      const back = g.randomItem(pile);
      g.s.discard = g.s.discard.filter(x => x !== back);
      t.hand.push(back);
    }
    yield* g.enforceHandCap(p);
  }, { aggressive: true, playable: (g, p) => withCards(g.adjacentTo(p)).length > 0 });
hand(51, 'Fair Exchange', 'Barter', 'You and target player each gain 1 Wealth.',
  function* (g, p) {
    const t = yield* g.targetPlayer(p, others(g, p), 'Fair Exchange: with whom?');
    g.gain(p, 'wealth', 1);
    if (t) g.gain(t, 'wealth', 1);
  });
hand(52, 'Black Market Contact', 'Barter', 'Swap your entire hand for the top 3 cards of the discard pile (your choice).',
  function* (g, p) {
    const top = g.s.discard.filter(x => g.card(x).kind === 'hand').slice(-3);
    const old = [...p.hand];
    g.s.discard = g.s.discard.filter(x => !top.includes(x));
    p.hand = top;
    g.s.discard.push(...old);
    g.log(`${p.name} swaps their hand with the discard pile.`, 'barter', { player: p.id });
  }, { playable: g => g.s.discard.some(x => g.card(x).kind === 'hand') });
hand(53, "Broker's Fee", 'Barter', 'Force two other players to each swap one card (your choice which cards).',
  function* (g, p) {
    const a = yield* g.targetPlayer(p, withCards(others(g, p)), "Broker's Fee: first player");
    if (!a) return;
    const b = yield* g.targetPlayer(p, withCards(others(g, p)).filter(o => o.id !== a.id), "Broker's Fee: second player");
    if (!b) return;
    const ca = yield* g.ask(p, 'card', `Card ${a.name} gives`, a.hand.map(x => ({ label: g.card(x).name, value: x })));
    const cb = yield* g.ask(p, 'card', `Card ${b.name} gives`, b.hand.map(x => ({ label: g.card(x).name, value: x })));
    a.hand = [...a.hand.filter(x => x !== ca), cb];
    b.hand = [...b.hand.filter(x => x !== cb), ca];
    g.log(`${a.name} and ${b.name} are forced to swap a card.`, 'barter', { player: a.id, target: b.id });
  }, { aggressive: true, playable: (g, p) => withCards(others(g, p)).length >= 2 });

// Temporary Truce
hand(54, 'Uneasy Truce', 'Truce', 'You and one chosen player cannot attack each other until your next turn.',
  function* (g, p) {
    const t = yield* g.choosePlayer(p, others(g, p), 'Uneasy Truce: with whom?');
    if (t) g.addEffect('truce', p.id, { at: 'turnStart', player: p.id }, { other: t.id });
  });
hand(55, 'Shared Purpose', 'Truce', 'You and one adjacent player each gain 1 resource of your choice.',
  function* (g, p) {
    const t = yield* g.choosePlayer(p, g.adjacentTo(p), 'Shared Purpose: with whom?');
    const mine = yield* g.choosePillar(p, 'Shared Purpose: gain 1 of');
    if (mine) g.gain(p, mine, 1);
    if (t) {
      const theirs = yield* g.choosePillar(t, 'Shared Purpose: gain 1 of');
      if (theirs) g.gain(t, theirs, 1);
    }
  }, { playable: (g, p) => g.adjacentTo(p).length > 0 });
hand(56, 'Ceasefire', 'Truce', 'No player may attack you this round.',
  function* (g, p) { g.addEffect('ceasefire', p.id, { at: 'roundEnd', round: g.s.round }); });
hand(57, 'Blood Pact', 'Truce', 'You and target player each gain 1 Fear. Neither of you may attack the other for 2 full rounds.',
  function* (g, p) {
    const t = yield* g.choosePlayer(p, others(g, p), 'Blood Pact: with whom?');
    g.gain(p, 'fear', 1);
    if (!t) return;
    g.gain(t, 'fear', 1);
    g.addEffect('truce', p.id, { at: 'roundEnd', round: g.s.round + 2 }, { other: t.id });
  });

// Block / Deflect (played only in response)
const block = (id: number, name: string, text: string, canUse: (g: Game, d: PlayerState, a: AttackInfo) => boolean,
  resolve: (g: Game, d: PlayerState, a: AttackInfo) => Flow<'negate' | 'survive1'>) =>
  hand(id, name, 'Block / Deflect', text, nothing, { responseOnly: true, block: { canUse, resolve } });
block(58, 'Iron Guard', 'Negate the next attack against you.', () => true, function* () { return 'negate'; });
block(59, 'Riposte', 'Negate an attack and deal 1 damage back to the attacker.', () => true,
  function* (g, d, a) { g.damage(g.p(a.attacker), 1, d.id, '(Riposte)'); return 'negate'; });
block(60, 'Vanish', 'Negate an attack, then move 1 space immediately after.', () => true,
  function* (g, d) { yield* g.moveStraight(d, 1, { why: 'Vanish: move 1 space' }); return 'negate'; });
block(61, 'Shield Wall', 'Negate an attack. Any ally sharing your tile is also protected this turn.', () => true,
  function* (g, d) {
    if (d.pos) g.addEffect('shieldWall', d.id, g.s.turn ? { at: 'turnEnd', player: g.s.turn.player } : { at: 'consumed' }, { square: key(d.pos) });
    return 'negate';
  });
block(62, 'Dodge', 'Negate an attack and draw 1 card immediately.', () => true,
  function* (g, d) { yield* g.drawOne(d); return 'negate'; });
hand(63, 'Counterspell', 'Block / Deflect', 'Negate a Hand Card effect targeting you (does not apply to combat damage).', nothing,
  { responseOnly: true, counterspell: true });
block(64, 'Steadfast', 'Negate an attack, but only if your Heart Tokens are at half of your max or below.',
  (_g, d) => d.hp <= d.maxHp / 2, function* () { return 'negate'; });
block(65, 'Last Stand', 'Negate an attack that would reduce you to 0 Heart Tokens. You survive with 1 Heart Token instead.',
  (_g, d, a) => a.damage >= d.hp, function* () { return 'survive1'; });

// ---------------------------------------------------------------- INSTANT / EVENT CARDS

// Dice-Based Chaos
instant(66, 'Bandit Ambush', 'Dice', 'Roll a die. Odd: lose 1 Wealth. Even: gain 1 Wealth.',
  function* (g, p, c) { if (odd(g.roll(p, c.name))) g.lose(p, 'wealth', 1, c.name); else g.gain(p, 'wealth', 1, c.name); });
instant(67, 'Duel of Honor', 'Dice', 'Roll against an adjacent player (if none, the player to your left). Lower roll loses 1 Heart Token.',
  function* (g, p, c) {
    const adj = g.adjacentTo(p);
    const foe = adj.length ? yield* g.choosePlayer(p, adj, 'Duel of Honor: against whom?') : g.leftOf(p);
    if (!foe) return;
    for (let i = 0; i < 20; i++) {
      const a = g.roll(p, c.name), b = g.roll(foe, c.name);
      if (a === b) continue;
      const [loser, winner] = a < b ? [p, foe] : [foe, p];
      yield* hpLoss(g, loser, 1, c.name, winner);
      return;
    }
  }, { noSpecter: true });
instant(68, 'Omen of Fire', 'Dice', 'Roll a die. On a 6, gain 1 Fear.',
  function* (g, p, c) { if (g.roll(p, c.name) === 6) g.gain(p, 'fear', 1, c.name); });
instant(69, 'Fickle Fate', 'Dice', 'Roll a die. 1-2: lose 1 Influence. 3-4: nothing. 5-6: gain 1 Influence.',
  function* (g, p, c) { const r = g.roll(p, c.name); if (r <= 2) g.lose(p, 'influence', 1, c.name); else if (r >= 5) g.gain(p, 'influence', 1, c.name); });
instant(70, "Gambler's Luck", 'Dice', 'Roll a die twice, keep the higher result. Gain that many Wealth (max 3).',
  function* (g, p, c) { const r = Math.max(g.roll(p, c.name), g.roll(p, c.name)); g.gain(p, 'wealth', Math.min(3, r), c.name); });
instant(71, 'Cursed Dice', 'Dice', 'Roll a die. On a 1, lose 1 Heart Token. Otherwise, gain 1 Wealth.',
  function* (g, p, c) { if (g.roll(p, c.name) === 1) yield* hpLoss(g, p, 1, c.name); else g.gain(p, 'wealth', 1, c.name); }, { noSpecter: true });
instant(72, 'Highway Robbery', 'Dice', 'Roll a die. Even: steal 1 Wealth from the player to your left. Odd: nothing.',
  function* (g, p, c) { const l = g.leftOf(p); if (!odd(g.roll(p, c.name)) && l) g.steal(p, l, 'wealth', 1, c.name); });
instant(73, 'Trial by Combat', 'Dice', 'Roll a die. On 4+, gain 1 Fear. On 1-3, lose 1 Fear.',
  function* (g, p, c) { if (g.roll(p, c.name) >= 4) g.gain(p, 'fear', 1, c.name); else g.lose(p, 'fear', 1, c.name); });
instant(74, 'Storm at Sea', 'Dice', 'Roll a die. On 1-2, every player loses 1 Wealth.',
  function* (g, p, c) { if (g.roll(p, c.name) <= 2) yield* everyone(g, p, o => { g.lose(o, 'wealth', 1, c.name); }); });
instant(75, 'Lucky Find', 'Dice', 'Roll a die. Gain half that many Wealth, rounded down (max 3).',
  function* (g, p, c) { g.gain(p, 'wealth', Math.min(3, Math.floor(g.roll(p, c.name) / 2)), c.name); });
instant(76, 'Wildfire', 'Dice', 'Roll a die. On 5-6, the player with the most Fear loses 1 Heart Token.',
  function* (g, p, c) { if (g.roll(p, c.name) >= 5) yield* hpLoss(g, g.uniqueBest(o => o.res.fear), 1, c.name); }, { noSpecter: true });
instant(77, 'Coin Toss', 'Dice', 'Roll a die. Odd: gain 1 Influence. Even: gain 1 Fear.',
  function* (g, p, c) { g.gain(p, odd(g.roll(p, c.name)) ? 'influence' : 'fear', 1, c.name); });
instant(78, 'Bad Omen', 'Dice', 'Roll a die. On a 1, discard a random card from your hand.',
  function* (g, p, c) {
    if (g.roll(p, c.name) === 1 && p.hand.length) {
      const d = g.randomItem(p.hand);
      g.discardFromHand(p, d);
      g.log(`${p.name} loses ${g.card(d).name} to the omen.`, 'discard', { player: p.id, cards: [d] });
    }
  });
instant(79, "Fortune's Wheel", 'Dice', 'Roll a die: 1-2 gain 1 Influence, 3-4 gain 1 Fear, 5-6 gain 1 Wealth.',
  function* (g, p, c) { const r = g.roll(p, c.name); g.gain(p, r <= 2 ? 'influence' : r <= 4 ? 'fear' : 'wealth', 1, c.name); });
instant(80, 'Risky Crossing', 'Dice', 'Roll a die. On 1-3, lose 1 Heart Token. On 4-6, move 2 extra spaces immediately.',
  function* (g, p, c) {
    if (g.roll(p, c.name) <= 3) yield* hpLoss(g, p, 1, c.name);
    else yield* g.moveStraight(p, 2, { why: 'Risky Crossing: move up to 2' });
  }, { noSpecter: true });

// Global Effects
instant(81, "Elodie's Sorrow", 'Global', 'Every player loses 1 Heart Token.',
  function* (g, p, c) { yield* everyone(g, p, o => { g.damage(o, 1, null, `(${c.name})`); }); },
  { elodie: true, flavor: 'The goddess weeps, and the realm bleeds with her.', noSpecter: true });
instant(82, 'The Harvest', 'Global', 'Every player gains 1 Wealth.',
  function* (g, p, c) { yield* everyone(g, p, o => { g.gain(o, 'wealth', 1, c.name); }); });
instant(83, "Elodie's Blessing", 'Global', 'Every player gains 1 Influence.',
  function* (g, p, c) { yield* everyone(g, p, o => { g.gain(o, 'influence', 1, c.name); }); },
  { elodie: true, flavor: 'Her favor touches every house at once, equally and without meaning.' });
instant(84, "Elodie's Wrath", 'Global', 'Every player gains 1 Fear.',
  function* (g, p, c) { yield* everyone(g, p, o => { g.gain(o, 'fear', 1, c.name); }); },
  { elodie: true, flavor: 'She does not punish. She simply reminds them what they are capable of.' });
instant(85, 'Famine', 'Global', 'Every player loses 1 Wealth.',
  function* (g, p, c) { yield* everyone(g, p, o => { g.lose(o, 'wealth', 1, c.name); }); });
instant(86, 'Uprising', 'Global', 'Every player with 3 or more Fear loses 1 Fear.',
  function* (g, p, c) { yield* everyone(g, p, o => { if (o.res.fear >= 3) g.lose(o, 'fear', 1, c.name); }); });
instant(87, 'Grand Market', 'Global', 'Every player may immediately move 1 space toward the nearest Trade tile.',
  function* (g, p, c) { yield* everyone(g, p, o => g.stepToward(o, tradeTiles(g), `${c.name}: step toward a Trade tile?`)); });
instant(88, 'Night of Shadows', 'Global', 'Every player discards down to 2 cards this turn only (hands return to drawing up to 3 normally next turn).',
  function* (g, p) {
    yield* everyone(g, p, o => g.enforceHandCap(o, 2));
    if (g.s.turn) g.s.turn.stopDrawing = true;
  });
instant(89, "Elodie's Exile", 'Global', 'Every player not currently on their owned tile loses 1 Heart Token.',
  function* (g, p, c) {
    yield* everyone(g, p, o => { if (o.pos && !samePos(o.pos, ownTile(g, o))) g.damage(o, 1, null, `(${c.name})`); });
  }, { elodie: true, flavor: 'Stray too far from home, and even she cannot shield you.', noSpecter: true });
instant(90, "Elodie's Gaze", 'Global', 'Every player reveals their hand to the table.',
  function* (g, p, c) { yield* everyone(g, p, o => { g.reveal(o, 'all', c.name); }); },
  { elodie: true, flavor: 'Nothing is hidden from her for long.' });

// Targeted (Game-State-Based)
instant(91, "The Crown's Gaze", 'Targeted', 'The player with the most Fear loses 1 Fear. (Tie: no effect.)',
  function* (g, _p, c) { const t = g.uniqueBest(o => o.res.fear); if (t) g.lose(t, 'fear', 1, c.name); });
instant(92, 'Coup Rumors', 'Targeted', 'The player closest to the Throne loses 1 Influence. (Tie: no effect.)',
  function* (g, _p, c) { const t = g.uniqueBest(o => throneDistance(o.pos!), false); if (t) g.lose(t, 'influence', 1, c.name); });
instant(93, 'Marked by the Crowd', 'Targeted', 'The player with the most Wealth loses 1 Wealth. (Tie: no effect.)',
  function* (g, _p, c) { const t = g.uniqueBest(o => o.res.wealth); if (t) g.lose(t, 'wealth', 1, c.name); });
instant(94, "Elodie's Judgment", 'Targeted', 'The player with the highest combined resource total loses 1 Heart Token. (Tie: no effect.)',
  function* (g, _p, c) { yield* hpLoss(g, g.uniqueBest(o => g.total(o)), 1, c.name); },
  { elodie: true, flavor: 'Ambition draws her eye first.', noSpecter: true });
instant(95, "Elodie's Mercy", 'Targeted', 'The player with the lowest combined resource total gains 1 resource of their choice. (Tie: all tied players choose.)',
  function* (g, _p, c) {
    for (const o of g.allBest(x => g.total(x), false)) {
      const x = yield* g.choosePillar(o, `${c.name}: gain 1 of`);
      if (x) g.gain(o, x, 1, c.name);
    }
  }, { elodie: true, flavor: 'She has not forgotten the smallest house at the table.' });
instant(96, "Elodie's Memory", 'Targeted', 'Any player currently holding a Grudge Token may immediately move 1 space toward the player they hold it against, for free.',
  function* (g, p, c) {
    yield* everyone(g, p, o => {
      const foes = o.grudges.map(id => g.p(id)).filter(f => !f.specter && f.pos);
      if (!foes.length || !o.pos) return;
      return g.stepToward(o, foes.map(f => f.pos!), `${c.name}: step toward your Grudge?`);
    });
  }, { elodie: true, flavor: 'She remembers every debt, even the ones the living have let go.' });
instant(97, 'Eyes of the Realm', 'Targeted', 'The player closest to the Throne reveals their hand to the table.',
  function* (g, _p, c) { const t = g.uniqueBest(o => throneDistance(o.pos!), false); if (t) g.reveal(t, 'all', c.name); });
instant(98, "Elodie's Trial", 'Targeted', 'The player with the fewest Heart Tokens may be attacked for 1 damage by any other player of their choice (optional).',
  function* (g, p, c) {
    const weak = g.uniqueBest(o => o.hp, false);
    if (!weak) return;
    const attackers = g.others(weak).filter(o => !g.attackBlockedReason(o, weak, 'trial'));
    if (!attackers.length) return;
    const a = yield* g.ask(p, 'player', `${c.name}: who may strike ${weak.name} for 1?`,
      [{ label: 'No one', value: null as number | null }, ...attackers.map(o => ({ label: o.name, value: o.id as number | null }))]);
    if (a !== null) yield* g.attack(g.p(a), weak, 'trial', 1);
  }, { elodie: true, flavor: 'The weak are tested, not spared.', noSpecter: true });
instant(99, 'Rising Tide', 'Targeted', 'The player with the most Influence loses 1; the player with the least gains 1. (Ties: no effect for that side.)',
  function* (g, _p, c) {
    const hi = g.uniqueBest(o => o.res.influence), lo = g.uniqueBest(o => o.res.influence, false);
    if (hi) g.lose(hi, 'influence', 1, c.name);
    if (lo && lo !== hi) g.gain(lo, 'influence', 1, c.name);
  });
instant(100, 'Scales of War', 'Targeted', 'The players with the most and least Fear swap 1 Fear point. (Tie on either side: no effect.)',
  function* (g, _p, c) {
    const hi = g.uniqueBest(o => o.res.fear), lo = g.uniqueBest(o => o.res.fear, false);
    if (hi && lo && hi !== lo) g.steal(lo, hi, 'fear', 1, c.name);
  });
instant(101, 'Whispers at Court', 'Targeted', 'The player who most recently gained Influence loses 1 Influence.',
  function* (g, _p, c) { const id = g.s.lastInfluenceGain; if (id !== null && !g.p(id).specter) g.lose(g.p(id), 'influence', 1, c.name); });
instant(102, "Elodie's Reckoning", 'Targeted', "The most recently killed player's killer loses 1 Heart Token.",
  function* (g, _p, c) { const k = g.s.lastKill; if (k) yield* hpLoss(g, g.p(k.killer), 1, c.name); },
  { elodie: true, flavor: 'Every death is a debt. She collects the interest herself.', noSpecter: true });

// Hand Disruption
instant(103, 'Thief in the Night', 'Hand Disruption', 'Swap one card with the player to your left.',
  function* (g, p, c) { const l = g.leftOf(p); if (l) yield* barter(g, p, l, c.name); });
instant(104, 'Forced Confession', 'Hand Disruption', 'Reveal your hand to the whole table.',
  function* (g, p, c) { g.reveal(p, 'all', c.name); });
instant(105, 'Pickpocket', 'Hand Disruption', 'The player to your right discards 1 random card.',
  function* (g, p) {
    const r = g.rightOf(p);
    if (!r?.hand.length) return;
    const d = g.randomItem(r.hand);
    g.discardFromHand(r, d);
    g.log(`${r.name} loses ${g.card(d).name} to a pickpocket.`, 'discard', { player: r.id, cards: [d] });
  });
instant(106, 'Mind Games', 'Hand Disruption', "Look at one player's hand. You may swap 1 card with them.",
  function* (g, p, c) {
    const t = yield* g.choosePlayer(p, withCards(others(g, p)), `${c.name}: whose hand?`);
    if (!t) return;
    g.reveal(t, [p.id], c.name);
    if (p.hand.length && (yield* g.confirm(p, `Swap a card with ${t.name}?`, 'Swap', 'No'))) yield* barter(g, p, t, c.name, true);
  });
instant(107, 'Rumor Mill', 'Hand Disruption', 'Each player passes 1 card of their choice to the player on their left.',
  function* (g, p, c) {
    const passes: { from: PlayerState; to: PlayerState; card: number }[] = [];
    for (const o of [p, ...g.seatsAfter(p)].filter(x => !x.specter && x.hand.length)) {
      const card = (yield* chooseOwnCard(g, o, `${c.name}: pass a card to ${g.leftOf(o)?.name}`))!;
      const to = g.leftOf(o);
      if (to) passes.push({ from: o, to, card });
    }
    for (const x of passes) { x.from.hand = x.from.hand.filter(y => y !== x.card); x.to.hand.push(x.card); }
    g.log('Every house passes a card to its left.', 'barter');
  });
instant(108, 'Stolen Secrets', 'Hand Disruption', 'Look at the top card of the draw deck. You may take it, replacing a card in your hand (hand cap still applies).',
  function* (g, p, c) {
    g.ensureDrawPile();
    const top = g.s.drawPile.at(-1);
    if (top === undefined) return;
    g.log(`${c.name}: the top card is ${g.card(top).name}.`, 'reveal', { player: p.id, cards: [top], visibleTo: [p.id] });
    if (g.card(top).kind !== 'hand') return;
    if (yield* g.confirm(p, `Take ${g.card(top).name}?`, 'Take it', 'Leave it')) {
      g.s.drawPile.pop();
      p.hand.push(top);
      yield* g.enforceHandCap(p);
    }
  });
instant(109, 'Scramble', 'Hand Disruption', 'Collect all hands, shuffle together, redeal 3 cards to each player.',
  function* (g, p) {
    const seats = [p, ...g.seatsAfter(p)].filter(x => !x.specter);
    const all = seats.flatMap(x => x.hand);
    for (const x of seats) x.hand = [];
    const deck = shuffle(all, g.rng);
    for (let i = 0; deck.length; i++) {
      const x = seats[i % seats.length];
      if (x.hand.length < 3) x.hand.push(deck.pop()!);
      if (seats.every(s => s.hand.length >= 3)) break;
    }
    g.s.discard.push(...deck);
    g.log('All hands are shuffled together and dealt out again.', 'barter');
  });
instant(110, 'Loose Lips', 'Hand Disruption', 'The player who has played the most Hand Cards this game reveals their hand.',
  function* (g, _p, c) { const t = g.uniqueBest(o => o.handCardsPlayed); if (t) g.reveal(t, 'all', c.name); });

// Wealth-Themed Instants
instant(111, 'Caravan Passing', 'Wealth', 'Roll a die. Even: gain 1 Wealth. Odd: lose 1 Wealth.',
  function* (g, p, c) { if (odd(g.roll(p, c.name))) g.lose(p, 'wealth', 1, c.name); else g.gain(p, 'wealth', 1, c.name); });
instant(112, "Merchant's Windfall", 'Wealth', 'Gain 1 Wealth.', function* (g, p, c) { g.gain(p, 'wealth', 1, c.name); });
instant(113, 'Toll Bridge', 'Wealth', 'Every player currently on a Trade tile gains 1 Wealth.',
  function* (g, p, c) { yield* everyone(g, p, o => { if (g.onTileType(o, 'trade')) g.gain(o, 'wealth', 1, c.name); }); });
instant(114, 'Counting House', 'Wealth', 'The player with the least Wealth gains 1 Wealth. (Tie: all tied players gain.)',
  function* (g, _p, c) { for (const o of g.allBest(x => x.res.wealth, false)) g.gain(o, 'wealth', 1, c.name); });
instant(115, 'Gilded Cage', 'Wealth', 'The player with the most Wealth loses 1 Heart Token. (Tie: no effect.)',
  function* (g, _p, c) { yield* hpLoss(g, g.uniqueBest(o => o.res.wealth), 1, c.name); }, { noSpecter: true });
instant(116, 'Trade Winds', 'Wealth', 'Every player may move 1 extra space this turn toward a Trade tile.',
  function* (g, p, c) { yield* everyone(g, p, o => g.stepToward(o, tradeTiles(g), `${c.name}: step toward a Trade tile?`)); });
instant(117, 'Debt Collector', 'Wealth', 'The player with the most Wealth gives 1 Wealth to a player of their choice who has less.',
  function* (g, _p, c) {
    const rich = g.uniqueBest(o => o.res.wealth);
    if (!rich || rich.res.wealth === 0) return;
    const to = yield* g.choosePlayer(rich, g.others(rich).filter(o => o.res.wealth < rich.res.wealth), `${c.name}: give 1 Wealth to whom?`);
    if (to) g.steal(to, rich, 'wealth', 1, c.name);
  });
instant(118, "Smuggler's Luck", 'Wealth', 'Roll a die. On 4+, gain 2 Wealth. On 1-3, nothing.',
  function* (g, p, c) { if (g.roll(p, c.name) >= 4) g.gain(p, 'wealth', 2, c.name); });
instant(119, 'Inflation', 'Wealth', 'Every player loses 1 Wealth. Then the player with the lowest total resources gains 2 Wealth.',
  function* (g, p, c) {
    yield* everyone(g, p, o => { g.lose(o, 'wealth', 1, c.name); });
    const lo = g.uniqueBest(o => g.total(o), false);
    if (lo) g.gain(lo, 'wealth', 2, c.name);
  });
instant(120, 'Treasure Map', 'Wealth', 'Reveal the top card of the discard pile. If it is Wealth-related, gain 1 Wealth.',
  function* (g, p, c) {
    const top = g.s.discard.at(-1);
    if (top === undefined) return;
    const def = g.card(top);
    g.log(`${c.name}: the top of the discard pile is ${def.name}.`, 'info', { cards: [top] });
    if (/wealth/i.test(def.text)) g.gain(p, 'wealth', 1, c.name);
  });

defs.sort((a, b) => a.id - b.id);
export const CARDS: CardDef[] = defs;
export const THRONE_SQUARES = THRONE;
