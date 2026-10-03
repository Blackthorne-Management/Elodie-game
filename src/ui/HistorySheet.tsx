import { useState } from 'react';
import type { PastGame } from '../state/history';
import { HISTORY_DAYS, downloadText, exportText, loadHistory } from '../state/history';
import { Sheet } from './parts';

const fileName = (g: PastGame) => `bloodlines-${new Date(g.startedAt).toISOString().slice(0, 16).replace(/[:T]/g, '-')}.txt`;

// Copy or download one game's log. Used for past games and "Report a problem" in a live game.
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

export function HistorySheet({ onClose }: { onClose: () => void }) {
  const [games] = useState(loadHistory);
  const [open, setOpen] = useState<PastGame | null>(null);

  if (open) {
    return (
      <Sheet title={new Date(open.startedAt).toLocaleString()} onClose={() => setOpen(null)}>
        <p><b>{open.summary}</b></p>
        <p className="muted small">Outcome: {open.outcome}{open.note ? ` (${open.note})` : ''} · build {open.build}</p>
        <GameLogActions game={open} />
        {open.final.length > 0 && <><h3>Final standings</h3>{open.final.map((l, i) => <p key={i} className="small">{l}</p>)}</>}
        <h3>Chronicle</h3>
        {open.chronicle.length === 0
          ? <p className="muted small">No chronicle was recorded for this game (it ended before the update that adds logs, or was interrupted by an app update). The replay data is still in the download.</p>
          : <div className="log">{open.chronicle.map((l, i) => <div key={i} className="feed-line">{l}</div>)}</div>}
      </Sheet>
    );
  }
  return (
    <Sheet title="Past games" onClose={onClose}>
      <p className="muted small">Games from the last {HISTORY_DAYS} days are kept on this phone. Open one to read or send its log.</p>
      {games.length === 0 && <p>No past games yet.</p>}
      <div className="history">
        {games.map(g => (
          <button key={g.id} type="button" className="history-row" onClick={() => setOpen(g)}>
            <span className="history-date">{new Date(g.startedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
            <span>{g.summary}</span>
            <span className={`tag tag-${g.outcome.replace(' ', '-')}`}>{g.outcome}</span>
          </button>
        ))}
      </div>
    </Sheet>
  );
}
