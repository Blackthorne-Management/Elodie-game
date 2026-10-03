import { useGame } from '../state/store';
import { speciesById } from '../data/pets';
import { MOVES } from '../data/moves';
import { petStats, levelCap, sparksToLevel } from '../engine/stats';
import { canEvolve, canLevel, evolve, levelUp } from '../engine/leveling';
import { TypeIcon } from '../components/TypeIcon';
import { CurrencyBar } from '../components/CurrencyBar';
import { describeMove } from '../components/describeMove';
import { EVOLVE } from '../config';
import type { Pet } from '../engine/types';

const MAX_TEAM = 4;

export function TeamScreen() {
  const save = useGame(s => s.save);
  const update = useGame(s => s.update);
  const cap = levelCap(save.actsCleared);

  function toggleTeam(uid: string) {
    update(s => {
      if (s.team.includes(uid)) return s.team.length > 1 ? { ...s, team: s.team.filter(u => u !== uid) } : s;
      return s.team.length < MAX_TEAM ? { ...s, team: [...s.team, uid] } : s;
    });
  }

  const ordered = [...save.pets].sort((a, b) => Number(save.team.includes(b.uid)) - Number(save.team.includes(a.uid)));

  return (
    <div className="page">
      <h1 className="title">Your Skylings</h1>
      <CurrencyBar />
      <p className="hint">Team {save.team.length}/{MAX_TEAM}. Tap “In team” to swap pets in and out.</p>
      <div className="pet-list">
        {ordered.map(p => <PetRow key={p.uid} pet={p} inTeam={save.team.includes(p.uid)} cap={cap}
          sparks={save.currency.sparks} crystals={save.stormCrystals} actsCleared={save.actsCleared}
          onToggle={() => toggleTeam(p.uid)}
          onLevel={() => update(s => levelUp(s, p.uid))}
          onEvolve={() => update(s => evolve(s, p.uid))} />)}
      </div>
    </div>
  );
}

interface RowProps {
  pet: Pet; inTeam: boolean; cap: number; sparks: number; crystals: number; actsCleared: number;
  onToggle: () => void; onLevel: () => void; onEvolve: () => void;
}

function PetRow({ pet, inTeam, cap, sparks, crystals, actsCleared, onToggle, onLevel, onEvolve }: RowProps) {
  const sp = speciesById(pet.speciesId);
  const stats = petStats(sp, pet.level, pet.stage, pet.stars);
  const cost = sparksToLevel(pet.level + 1);
  const atCap = pet.level >= cap;
  const nextStage = pet.stage < 3 ? EVOLVE[(pet.stage + 1) as 2 | 3] : null;
  return (
    <article className="pet">
      <div className="pet-head">
        <div className="portrait" style={{ background: `var(--${sp.type})` }}><TypeIcon type={sp.type} /></div>
        <div className="pet-id">
          <strong>{sp.names[pet.stage - 1]}</strong>
          <span>Lv {pet.level} · {sp.type} · {sp.role}</span>
        </div>
        <button type="button" className={`chip ${inTeam ? 'on' : ''}`} onClick={onToggle}>{inTeam ? 'In team' : 'Add'}</button>
      </div>
      <div className="stats">
        <span>HP {stats.hp}</span><span>Atk {stats.attack}</span><span>Def {stats.defense}</span><span>Spd {stats.speed}</span>
      </div>
      <details>
        <summary>Moves and profile</summary>
        {(['basic', 'skill', 'ultimate'] as const).map(slot => {
          const m = MOVES[sp.moves[slot]];
          return <p key={slot}><b>{m.name}</b> <small>({slot})</small><br /><small>{describeMove(m)}</small></p>;
        })}
        <p><i>{sp.personality}</i><br /><small>Favorite weather: {sp.favoriteWeather}</small></p>
      </details>
      <div className="pet-actions">
        <button type="button" className="action" disabled={!canLevel(pet, actsCleared, sparks)} onClick={onLevel}>
          {atCap ? `Level cap ${cap}` : `Level up · ${cost} ✦`}
        </button>
        {nextStage && (
          <button type="button" className="action evolve" disabled={!canEvolve(pet, sparks, crystals)} onClick={onEvolve}>
            Evolve · Lv {nextStage.level}, {nextStage.sparks} ✦{nextStage.crystals ? `, ${nextStage.crystals} ◆` : ''}
          </button>
        )}
      </div>
    </article>
  );
}
