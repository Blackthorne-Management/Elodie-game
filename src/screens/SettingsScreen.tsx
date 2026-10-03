import { useState } from 'react';
import { useGame } from '../state/store';
import { exportCode, importCode } from '../state/save';
import { newGame } from '../state/newGame';

export function SettingsScreen() {
  const save = useGame(s => s.save);
  const update = useGame(s => s.update);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  async function copyBackup() {
    const c = exportCode(save);
    setCode(c);
    try {
      await navigator.clipboard.writeText(c);
      setMessage('Backup code copied. Paste it somewhere safe, like Notes.');
    } catch {
      setMessage('Select the code below and copy it.');
    }
  }

  function restore() {
    try {
      const loaded = importCode(code);
      if (!confirm('Replace this save with the backup?')) return;
      update(() => loaded);
      setMessage('Backup restored!');
    } catch {
      setMessage('That code did not work. Check it was copied completely.');
    }
  }

  function reset() {
    if (!confirm('Start over? This erases all progress on this device.')) return;
    update(() => newGame());
    setMessage('New game started.');
  }

  const speed = save.settings.battleSpeed;
  return (
    <div className="page">
      <h1 className="title">Settings</h1>

      <section className="panel">
        <h2>Battle speed</h2>
        <div className="seg">
          {([1, 2] as const).map(v => (
            <button key={v} type="button" className={speed === v ? 'on' : ''}
              onClick={() => update(s => ({ ...s, settings: { ...s.settings, battleSpeed: v } }))}>
              {v === 1 ? 'Normal' : 'Fast'}
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Backup</h2>
        <p className="hint">Your save lives on this phone. Copy a backup code now and then, so it can be restored.</p>
        <button type="button" className="action" onClick={copyBackup}>Copy backup code</button>
        <textarea value={code} onChange={e => setCode(e.target.value)} placeholder="Paste a backup code here to restore" rows={4} />
        <button type="button" className="action" disabled={!code.trim()} onClick={restore}>Restore from code</button>
        {message && <p className="hint" role="status">{message}</p>}
      </section>

      <section className="panel danger">
        <button type="button" className="action" onClick={reset}>Start a new game</button>
      </section>
      <p className="hint center">Highest floor: {save.highestFloor}</p>
    </div>
  );
}
