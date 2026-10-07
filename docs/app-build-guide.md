# BLOODLINES: THE RACE TO ELODIE'S GRACE — APP BUILD GUIDE
### A prompt for Claude Code, written to be pasted in as the opening instruction

**How to use this file:** paste this entire document as your first message to Claude Code, with `bloodline-rulebook-draft.md`, `bloodline-card-list.md`, and `bloodline-houses.md` available in the project folder. Those three files are the single source of truth for every rule, card, and ability; this document is the engineering spec for turning them into a working app.

---

## 1. PROJECT SUMMARY

Build a fully playable digital version of Bloodlines: The Race to Elodie's Grace, not a companion tracker. A player should be able to open the app and play a complete game start to finish, either solo against computer-controlled opponents or online with friends joining remotely or in the same room.

Two non-negotiable requirements:
1. **The game must be fully functional on its own**, including AI-controlled "bot" players, so one person can play a real game without anyone else present.
2. **Art is out of scope for this pass.** Every visual asset (house crests, card art, tile icons, the board itself) should be a clean, functional placeholder, wired through a single swappable asset system so a future art pass never has to touch game logic.

---

## 2. SOURCE OF TRUTH

- `bloodline-rulebook-draft.md` — the complete rules (setup, turn structure, combat, the shared deck, winning, death & succession, the Specter mechanic)
- `bloodline-card-list.md` — all 120 Shared Action Deck cards with exact effect text
- `bloodline-houses.md` — all 8 houses with homelands, backstories, and full Generation I-IV ability text

Implement the rules exactly as written. If anything is ambiguous or two sections seem to conflict, stop and flag it rather than silently picking an interpretation. These documents are still subject to final playtest-driven tuning on two numbers (the Sudden Death round cap and how multi-challenger Throne fights resolve in practice); build both as configurable constants, not hardcoded, so they're easy to adjust after a real playtest.

---

## 3. TECH STACK

- **Frontend:** React + TypeScript, mobile-first responsive layout, built as a PWA so it installs cleanly from a phone browser after scanning the box's QR code.
- **Backend/realtime:** Supabase — Postgres for persistent game state, Supabase Realtime for live sync across connected clients, anonymous/lightweight auth (display name + session only, no account system needed for v1).
- **QR codes:** a client-side QR library (e.g., `qrcode.react`) encoding a join URL with the session's code embedded.
- **Authoritative state:** the server (a Postgres row holding the full game state as JSON, mutated through validated server-side functions) is the single source of truth. Clients send *intents* (e.g., "move 4 spaces east," "play card X"), the server validates against the current state and full rule set, applies the result, and broadcasts the new state to everyone in the session. This prevents desync between players and stops a client from attempting an illegal move.

---

## 4. CORE DATA MODEL

**Session**
- `id`, `join_code` (6-character, human-typeable), `status` (lobby / active / ended), `created_at`

**Player**
- `id`, `session_id`, `display_name`, `seat_order`, `is_bot` (boolean), `house_id`, `connection_status`

**GameState** (one JSON document per session)
- `round`, `current_turn_index`, `phase` (move / resource / combat / play / draw / challenge-window)
- Board: pawn positions, tile ownership state (owned vs. neutral per Section 3's ownerless-tile rule)
- Per player: Heart Tokens (current/max), position, Influence/Fear/Wealth totals, hand (card IDs only, never sent to other clients), generation (I-IV), Grudge Tokens held and owed, Specter status
- Deck state: draw pile (server-only, never exposed to clients), discard pile, current composition
- Event log: append-only action history, used for replay, debugging, and driving each client's live feed

---

## 5. GAME ENGINE CHECKLIST

Build this as a pure, testable rules engine, separate from the UI, so every rule can be unit tested independently. Map directly to the rulebook's sections:

- **Setup (Section 3):** random house lottery, all 8 tiles always placed with the ownerless-is-neutral rule, initial 3-card hand deal with the "reshuffle any Instant drawn during setup" rule, turn order (first player arbitrary/host-selected since there's no physical "oldest player" in a digital session; clockwise order from there).
- **Turn structure (Section 4):** d6 roll movement in a committed straight-line orthogonal direction only, resource check with both exceptions (own tile, same-tile-as-last-turn), free combat action, 1 hand card play, draw-to-3 with the Instant-resolves-immediately loop, and the always-enforced hand cap.
- **Resources & tiles (Section 5):** the 18x18 grid, only the 8 owned tiles ever generate resources, unlimited tile stacking, contested-tile resource rule.
- **Combat (Section 6):** damage equals attacker's current Heart Tokens, 4-neighbor adjacency only, Block/Deflect response window, simultaneous-death handling.
- **The shared deck (Section 7):** implement all 120 cards from `bloodline-card-list.md` as discrete, individually testable effect handlers. Deck reshuffles from the discard pile when empty. Flag the 10 Elodie cards with a data attribute (for a future visual treatment) but no mechanical difference.
- **Winning (Section 8):** threshold tracking, Claim declaration, a Challenge window broadcast to every other eligible player when a Claim happens, sequential resolution for multiple challengers, and the Sudden Death round-cap fallback with its full tie-break chain.
- **Death & Succession (Section 9):** resource-pool halving (player's choice), Grudge Token placement and the Reckoning bonus/vendetta-ending logic, generation flip with the correct new HP and abilities, teleport-home reset.
- **The Specter (Section 10):** post-Gen-IV state, mischief card draw from the top 5 of the discard pile (see rules-decisions.md), permanent removal of played Specter cards, the skip-if-discard-pile-low fallback.
- **The 8 houses (`bloodline-houses.md`):** implement every house's exact Gen I-IV abilities and passives as code, including the specific soft downsides (Ironvow's forced hand reveal, Agnivansh's lower Gen IV HP, Brasador's "most Feared" bonus-to-attackers effect).

---

## 6. AI OPPONENTS

Every open seat not filled by a human can be filled by a bot. A full solo game against up to 7 bots must work.

Use a rule-based heuristic AI for v1, not machine learning; a well-tuned heuristic is more than sufficient for a game at this complexity and is far easier to debug and tune after playtesting.

Decision points to implement:
- **Movement:** prefer paths toward an uncontested tile matching a resource type the bot needs, weighted by current threshold progress; avoid ending adjacent to a clearly stronger player unless the bot's hand supports an attack; occasionally path toward the Throne once eligible.
- **Combat:** attack when the bot's current HP meaningfully exceeds a reachable target's, or when killing would settle/avoid a Grudge; hold back when attacking would leave the bot critically low and it has no Block/Deflect card in hand.
- **Card play:** prioritize resource cards when behind on the win threshold, disruption or ranged-attack cards when a good target is in range, and hold Block/Deflect cards in reserve rather than playing them proactively.
- **Claim/Challenge:** claim as soon as eligible unless an obviously stronger eligible player is positioned to challenge; challenge when eligible and the claimant looks beatable.

Give each house's bot a light personality bias drawn from its identity (Brasador plays aggressively early, Dorini prioritizes economy and avoids unnecessary fights, Stillwater turtles and waits, etc.) so a solo game against bots still feels like playing against 8 distinct houses, not 8 copies of the same logic.

---

## 7. MULTIPLAYER SESSION & JOIN FLOW

1. A host creates a session from the app, generating a 6-character join code and a QR code encoding a join URL (e.g., `app.domain/join/ABC123`).
2. Other players either scan the code (from the physical box, or from the host's screen) or type it in manually, then enter a display name to join the lobby.
3. The host sets player count and which remaining seats (if any) get filled by bots, then starts the game.
4. Every client subscribes to the session's realtime channel. Actions are sent to the server, validated, applied, and the updated state is broadcast to everyone.
5. **Reconnection:** a disconnected player keeps their seat and can rejoin with the same session/player link to restore current state. As a stretch goal (not required for v1), a bot can take over an AFK player's seat after a configurable timeout so the game doesn't stall for the whole table.

---

## 8. UI/UX REQUIREMENTS

- **Asset manifest:** every visual element (house crests, tile icons, card backs, UI icons) is referenced through a single config file (e.g., `assets.config.ts`) mapping each to a placeholder, a solid color block with the house's initial, a generic shape, a plain icon font glyph. A future art pass only touches this file, never game logic or components.
- **Board:** the 18x18 grid, rendered efficiently (not 324 naive DOM nodes; consider canvas or a virtualized grid component). Pawns as colored circles or initials, the 8 tiles as colored squares by resource type, the Throne marked distinctly at center.
- **Hand:** always-visible 3-card hand at the bottom of the screen, tap to play.
- **Resource tracker:** always-visible per-player Influence/Fear/Wealth totals.
- **Turn indicator:** whose turn, current phase, and a simple d6 roll animation (a number flash is sufficient for v1).
- **Decision modals:** clear prompts for Combat responses, Claim/Challenge windows, and card targeting, each with a timeout that auto-resolves for bots or AFK players.
- **Mobile-first:** portrait orientation as the primary layout, thumb-reachable controls, since most players will be joining by scanning a QR code on their own phone.

---

## 9. SUGGESTED BUILD PHASES

1. **Phase 1:** the core rules engine and a fully playable single-player game loop against bots, running entirely locally (no backend yet). This validates every rule end to end before any networking complexity is added.
2. **Phase 2:** Supabase-backed sessions, join codes, QR generation, and basic realtime sync for 2+ human players.
3. **Phase 3:** AI heuristic tuning, reconnection handling, full 120-card implementation, Sudden Death and Specter modes fully wired in.
4. **Phase 4:** mobile responsive polish and a finalized placeholder asset manifest, ready for the art pass.

---

## 10. EXPLICIT NON-GOALS FOR V1

- No voice/video chat
- No persistent player accounts beyond a session
- No public matchmaking; sessions are private, join-code only
- No real art or animation beyond functional placeholders

---

## 11. STARTING INSTRUCTION FOR CLAUDE CODE

Begin with Phase 1 only: build the rules engine as a standalone, unit-testable module, then a minimal local UI that lets one human play a complete game against 7 bots. Do not start on Supabase, multiplayer, or QR codes until Phase 1 is fully working and the rules have been verified against the three source documents.
