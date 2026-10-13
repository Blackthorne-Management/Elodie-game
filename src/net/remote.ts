// An online game, shaped like a local Runner so the same play screen draws it. The state is the masked view the
// server sent; there is no engine running here, only the Game's read-only helpers (targets, thresholds, labels).
import { Game } from '../engine/game';
import type { Decision, GameState } from '../engine/types';
import { CONTENT } from '../data';
import type { GameView } from './protocol';

// What the play screen needs from a game, local or online.
export interface Playable {
  readonly game: Game;
  readonly pending: Decision | null;
  readonly answers: number[];
  readonly over: boolean;
  readonly state: GameState;
}

export class RemoteRunner implements Playable {
  readonly game: Game;
  readonly pending: Decision | null;
  readonly answers: number[];
  readonly over: boolean;
  constructor(view: GameView) {
    const g = Object.create(Game.prototype) as Game;
    g.s = view.state;
    g.content = CONTENT;
    g.rng = () => 0;
    this.game = g;
    this.pending = view.pending;
    this.answers = new Array<number>(view.answers).fill(0);   // only its length is used (a version for the screen)
    this.over = view.over;
  }
  get state() { return this.game.s; }
}
