// Dialogue: the data format, a runner that walks a script against the flag store, the typewriter
// timing rule, and a content checker. Pure TypeScript; the Field scene only draws what `view()` says.

import type { Condition } from './conditions.ts';
import { evaluate, flagsIn } from './conditions.ts';
import type { FlagSnapshot, FlagStore } from './flags.ts';
import type { StageCue } from './stage.ts';

export interface Speaker {
  id: string;
  /** Name shown on the name tag. */
  name: string;
  /** Portrait key in assets.config.ts PORTRAITS. */
  portrait?: string;
}

export interface DialogueLine {
  text: string;
  /** Shown only when the condition holds. */
  if?: Condition;
  /** Flags set when the line is shown. */
  set?: FlagSnapshot;
  /** Optional translation shown under a line spoken in another language. */
  translation?: string;
  /** Overrides the node's speaker for this line. */
  speaker?: string;
  /** A screen effect the field plays when the line appears (e.g. 'flash', 'shake', 'fade'). */
  fx?: string;
  /** Stage directions acted out on the map before the line appears (engine/stage.ts). */
  stage?: readonly StageCue[];
}

export interface DialogueChoice {
  text: string;
  if?: Condition;
  set?: FlagSnapshot;
  /** Node to go to; ends the conversation when omitted. */
  next?: string;
}

export interface DialogueBranch {
  if?: Condition;
  to: string;
}

export interface DialogueNode {
  speaker?: string;
  lines: DialogueLine[];
  /** Offered after the last visible line. */
  choices?: DialogueChoice[];
  /** Where to go after the lines when there are no choices: a node id, or the first branch whose condition holds. */
  next?: string | DialogueBranch[];
  /** Flags set when the node is entered. */
  set?: FlagSnapshot;
}

export interface DialogueScript {
  id: string;
  start: string;
  nodes: Record<string, DialogueNode>;
}

export interface ChoiceView {
  text: string;
  /** Index to pass to `choose`. */
  index: number;
}

export type DialogueView =
  | { kind: 'line'; speaker: Speaker | null; text: string; translation?: string; fx?: string; stage?: readonly StageCue[] }
  | { kind: 'choice'; speaker: Speaker | null; text: string; translation?: string; fx?: string; stage?: readonly StageCue[]; choices: ChoiceView[] }
  | { kind: 'end' };

const MAX_NODE_HOPS = 64;

export class DialogueRunner {
  private nodeId: string | null = null;
  private lines: DialogueLine[] = [];
  private lineIndex = 0;
  private choices: DialogueChoice[] | null = null;
  private readonly script: DialogueScript;
  private readonly speakers: Readonly<Record<string, Speaker>>;
  private readonly flags: FlagStore;

  /** The conversation's id (the music can follow it: audio.config.ts DIALOGUE_MUSIC). */
  get scriptId(): string {
    return this.script.id;
  }

  constructor(script: DialogueScript, speakers: Readonly<Record<string, Speaker>>, flags: FlagStore) {
    this.script = script;
    this.speakers = speakers;
    this.flags = flags;
    this.enter(script.start, 0);
  }

  get done(): boolean {
    return this.nodeId === null;
  }

  view(): DialogueView {
    if (this.nodeId === null) return { kind: 'end' };
    const node = this.script.nodes[this.nodeId]!;
    const line = this.lines[this.lineIndex];
    const speaker = this.resolveSpeaker(line?.speaker ?? node.speaker);
    const text = line?.text ?? '';
    const translation = line?.translation;
    const fx = line?.fx;
    const stage = line?.stage;
    const isLast = this.lineIndex >= this.lines.length - 1;
    if (isLast && this.choices && this.choices.length > 0) {
      return {
        kind: 'choice',
        speaker,
        text,
        translation,
        fx,
        stage,
        choices: this.choices.map((c, index) => ({ text: c.text, index })),
      };
    }
    return { kind: 'line', speaker, text, translation, fx, stage };
  }

  /** Move past the current line. Does nothing while a choice is waiting. */
  advance(): void {
    if (this.nodeId === null) return;
    const v = this.view();
    if (v.kind !== 'line') return;
    if (this.lineIndex < this.lines.length - 1) {
      this.lineIndex++;
      this.showLine();
      return;
    }
    this.leaveNode(0);
  }

  /** Pick one of the visible choices by its `index`. */
  choose(index: number): void {
    const v = this.view();
    if (v.kind !== 'choice') return;
    const choice = this.choices?.[index];
    if (!choice) throw new Error(`No choice ${index} in ${this.script.id}/${this.nodeId}`);
    if (choice.set) this.flags.apply(choice.set);
    if (choice.next) this.enter(choice.next, 0);
    else this.nodeId = null;
  }

  private resolveSpeaker(id: string | undefined): Speaker | null {
    if (!id) return null;
    return this.speakers[id] ?? { id, name: id };
  }

  private enter(nodeId: string, hops: number): void {
    if (hops > MAX_NODE_HOPS) throw new Error(`Dialogue ${this.script.id} loops without showing a line`);
    const node = this.script.nodes[nodeId];
    if (!node) throw new Error(`Dialogue ${this.script.id} has no node "${nodeId}"`);
    this.nodeId = nodeId;
    if (node.set) this.flags.apply(node.set);
    this.lines = node.lines.filter((l) => evaluate(l.if, this.flags));
    this.lineIndex = 0;
    this.choices = null;
    if (this.lines.length === 0) {
      if (this.computeChoices()) return; // a bare choice with no prompt line
      this.leaveNode(hops + 1);
      return;
    }
    this.showLine();
  }

  private showLine(): void {
    const line = this.lines[this.lineIndex];
    if (line?.set) this.flags.apply(line.set);
    if (this.lineIndex >= this.lines.length - 1) this.computeChoices();
  }

  /** Work out which choices are offered; returns true when there is at least one. */
  private computeChoices(): boolean {
    const node = this.script.nodes[this.nodeId!]!;
    const visible = (node.choices ?? []).filter((c) => evaluate(c.if, this.flags));
    this.choices = visible.length > 0 ? visible : null;
    return this.choices !== null;
  }

  private leaveNode(hops: number): void {
    const node = this.script.nodes[this.nodeId!]!;
    const next = resolveNext(node.next, this.flags);
    if (next) this.enter(next, hops);
    else this.nodeId = null;
  }
}

function resolveNext(next: DialogueNode['next'], flags: FlagStore): string | undefined {
  if (next === undefined) return undefined;
  if (typeof next === 'string') return next;
  return next.find((b) => evaluate(b.if, flags))?.to;
}

/** How many characters of a line the typewriter shows after `elapsedMs` at `charsPerSecond`. */
export function typewriterChars(elapsedMs: number, charsPerSecond: number, length: number): number {
  if (!Number.isFinite(charsPerSecond)) return length;
  if (elapsedMs <= 0) return 0;
  return Math.min(length, Math.floor((elapsedMs / 1000) * charsPerSecond));
}

/** Checks dialogue content: start nodes, next targets and speakers exist. Returns readable errors. */
export function checkDialogue(
  scripts: Readonly<Record<string, DialogueScript>>,
  speakers: Readonly<Record<string, Speaker>>,
): string[] {
  const errors: string[] = [];
  for (const [key, script] of Object.entries(scripts)) {
    const where = `dialogue ${key}`;
    if (script.id !== key) errors.push(`${where}: id "${script.id}" does not match its key`);
    if (!script.nodes[script.start]) errors.push(`${where}: start node "${script.start}" is missing`);
    for (const [nodeId, node] of Object.entries(script.nodes)) {
      const at = `${where}/${nodeId}`;
      const speakerIds = [node.speaker, ...node.lines.map((l) => l.speaker)].filter((s): s is string => !!s);
      for (const s of speakerIds) if (!speakers[s]) errors.push(`${at}: unknown speaker "${s}"`);
      const targets: string[] = [];
      if (typeof node.next === 'string') targets.push(node.next);
      else if (node.next) targets.push(...node.next.map((b) => b.to));
      for (const c of node.choices ?? []) if (c.next) targets.push(c.next);
      for (const t of targets) if (!script.nodes[t]) errors.push(`${at}: goes to missing node "${t}"`);
      if (node.lines.length === 0 && !node.choices?.length && node.next === undefined) {
        errors.push(`${at}: node has no lines, choices or next`);
      }
      const conds = [...node.lines.map((l) => l.if), ...(node.choices ?? []).map((c) => c.if)];
      for (const f of conds.flatMap(flagsIn)) if (!f) errors.push(`${at}: condition with an empty flag name`);
    }
  }
  return errors;
}

/** Every flag a script can set (node, line and choice `set` blocks). Used by content checks. */
export function flagsSetBy(script: DialogueScript): string[] {
  const out = new Set<string>();
  const add = (set: FlagSnapshot | undefined) => {
    for (const name of Object.keys(set ?? {})) out.add(name);
  };
  for (const node of Object.values(script.nodes)) {
    add(node.set);
    for (const l of node.lines) add(l.set);
    for (const c of node.choices ?? []) add(c.set);
  }
  return [...out].sort();
}

/** Every flag a script reads in its conditions. */
export function flagsReadBy(script: DialogueScript): string[] {
  const out = new Set<string>();
  for (const node of Object.values(script.nodes)) {
    const conds = [
      ...node.lines.map((l) => l.if),
      ...(node.choices ?? []).map((c) => c.if),
      ...(Array.isArray(node.next) ? node.next.map((b) => b.if) : []),
    ];
    for (const f of conds.flatMap(flagsIn)) out.add(f);
  }
  return [...out].sort();
}
