// Online play: what the game server and the app say to each other. The server keeps the whole game (setup and every
// answer) and sends each player only their own view: other players' hands, the draw pile, the seed and private log
// lines never leave the server.
import type { Decision, GameState, HouseId } from '../engine/types';

export type SessionStatus = 'lobby' | 'picking' | 'active' | 'ended';

export interface SeatInfo {
  seat: number;
  name: string;            // '' while an open human seat waits for someone to join
  bot: boolean;
  joined: boolean;
  vote: boolean;           // wants to pick houses (picking needs every human to agree)
  house: HouseId | null;   // picked house, during or after picking
}

export interface LobbyView {
  code: string;
  status: SessionStatus;
  total: number;
  humans: number;
  me: number;              // your seat
  host: boolean;
  seats: SeatInfo[];
  pickAgreed: boolean;     // every human has voted to pick
  pickOrder: number[] | null;
  pickRolls: number[][] | null;   // the roll-off: one row of dice per round of rolling
  pickTurn: number | null; // whose pick it is (a seat)
  version: number;
}

export interface GameView {
  lobby: LobbyView;
  state: GameState;        // masked for you
  pending: Decision | null; // in full when it's yours; otherwise only who and what kind
  answers: number;         // how many answers the game has had (a version for the play screen)
  over: boolean;
}

export type Request =
  | { op: 'create'; name: string; total: number; humans: number }
  | { op: 'join'; code: string; name: string }
  | { op: 'lobby'; code: string; token: string }
  | { op: 'vote'; code: string; token: string; pick: boolean }
  | { op: 'start'; code: string; token: string }
  | { op: 'pick'; code: string; token: string; house: HouseId }
  | { op: 'view'; code: string; token: string }
  | { op: 'answer'; code: string; token: string; index: number; at: number }
  | { op: 'bot'; code: string; token: string; at: number }
  | { op: 'leave'; code: string; token: string };

export type Response =
  | { ok: true; code?: string; token?: string; seat?: number; lobby?: LobbyView; game?: GameView }
  | { ok: false; error: string };

// The share message for friends.
export const inviteText = (code: string, url: string, host: string) =>
  `${host ? `${host} invites you` : "You're invited"} to a game of Bloodlines: The Race to Elodie's Grace! ` +
  `Tap ${url} to join, or open the app, choose "Join a game" and enter code ${code}.`;
