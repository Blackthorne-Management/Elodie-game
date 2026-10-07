import { useState } from 'react';
import type { PastGame } from '../state/history';
import { downloadText, exportText } from '../state/history';

const fileName = (g: PastGame) => `bloodlines-${new Date(g.startedAt).toISOString().slice(0, 16).replace(/[:T]/g, '-')}.txt`;

// Copy or download one game's log. Used by "Report a problem" in a live game.
export function GameLogActions({ game }: { game: PastGame }) {
  const [msg, setMsg] = useState('');
  const text = exportText(game);
  async function copy() {
    try { await navigator.clipboard.writeText(text); setMsg('Copied. Paste it into your message to Claude.'); } catch { setMsg('Copy failed; use Download instead.'); }
  }
  return (
    <div className="log-actions">
      <div className="seg">
        <button type="button" onClick={copy}>Copy log</button>
        <button type="button" onClick={() => { downloadText(fileName(game), text); setMsg('Downloaded. You can attach the file to Claude.'); }}>Download</button>
      </div>
      {msg && <p className="muted small">{msg}</p>}
    </div>
  );
}
