// Music and sound volume, and mute: on the setup screen and in the game menu. Remembered on this device.
import { useSyncExternalStore } from 'react';
import { audio } from '../audio/player';

export function AudioControls() {
  const v = useSyncExternalStore(f => audio.subscribe(f), () => JSON.stringify(audio.getVolumes()));
  const vol = JSON.parse(v) as ReturnType<typeof audio.getVolumes>;
  const slider = (label: string, key: 'music' | 'sound') => (
    <label className="audio-row">
      <span>{label}</span>
      <input type="range" min={0} max={100} step={5} value={Math.round(vol[key] * 100)} disabled={vol.muted}
        aria-label={`${label} volume`} onChange={e => audio.setVolumes({ [key]: Number(e.target.value) / 100 })} />
    </label>
  );
  return (
    <div className="field audio-controls">
      <span>Sound</span>
      {slider('Music', 'music')}
      {slider('Effects', 'sound')}
      <div className="seg">
        <button type="button" className={vol.muted ? 'on' : ''} onClick={() => audio.setVolumes({ muted: !vol.muted })}>
          {vol.muted ? 'Muted: tap for sound' : 'Mute'}
        </button>
      </div>
    </div>
  );
}
