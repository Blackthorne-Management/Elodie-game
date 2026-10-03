// Drives a Game: holds the paused decision and the list of answers given so far.
// A game is fully described by its setup plus its answers, so it can be saved and replayed.
import type { Content } from './content';
import type { Decision, Flow, GameSetup } from './types';
import { Game } from './game';

export class Runner {
  readonly game: Game;
  readonly answers: number[] = [];
  pending: Decision | null = null;
  private flow: Flow;

  constructor(setup: GameSetup, content: Content) {
    this.game = new Game(setup, content);
    this.flow = this.game.run();
    this.step(undefined);
  }

  get state() { return this.game.s; }
  get over() { return this.pending === null; }

  answer(i: number) {
    if (!this.pending) throw new Error('The game is over');
    this.answers.push(i);
    this.step(i);
  }

  private step(i: number | undefined) {
    const r = i === undefined ? this.flow.next() : this.flow.next(i);
    this.pending = r.done ? null : r.value;
  }

  static replay(setup: GameSetup, content: Content, answers: number[]): Runner {
    const r = new Runner(setup, content);
    for (const a of answers) r.answer(a);
    return r;
  }
}
