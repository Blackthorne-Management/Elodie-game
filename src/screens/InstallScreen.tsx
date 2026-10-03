import { useEffect, useState } from 'react';
import { inAppBrowser, installState, onInstallChange, platform, promptInstall } from '../state/install';

const ICON = `${import.meta.env.BASE_URL}apple-touch-icon.png`;

function ShareIcon() {
  return (
    <svg className="inline-icon" width="22" height="22" viewBox="0 0 24 24" aria-label="Share">
      <path d="M12 3 L12 15 M7.5 7.5 L12 3 L16.5 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10 H6 V21 H18 V10 H16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function AddIcon() {
  return (
    <svg className="inline-icon" width="22" height="22" viewBox="0 0 24 24" aria-label="Add">
      <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8 V16 M8 12 H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Shown instead of the game whenever it is opened in a browser tab.
export function InstallScreen() {
  const [state, setState] = useState(installState);
  useEffect(() => onInstallChange(() => setState(installState())), []);
  const os = platform();

  return (
    <div className="install">
      <img className="install-icon" src={ICON} alt="" width="120" height="120" />
      <h1>Elodie, Keeper of Skies</h1>
      <p className="install-lead">This game lives on your home screen. Add it there to start playing.</p>

      {state.installed ? (
        <div className="install-card"><p><b>Installed!</b> Open <b>Keeper of Skies</b> from your home screen.</p></div>
      ) : inAppBrowser() ? (
        <div className="install-card">
          <p>This app can’t be installed from here. Open the menu and choose <b>Open in Safari</b> (or your browser), then follow the steps.</p>
        </div>
      ) : os === 'ios' ? (
        <ol className="install-card steps">
          <li>Tap the <b>Share</b> button <ShareIcon /> in Safari’s toolbar. <small>(If you don’t see it, tap <b>⋯</b> first.)</small></li>
          <li>Scroll down and tap <b>Add to Home Screen</b> <AddIcon /></li>
          <li>Tap <b>Add</b>, then open <b>Keeper of Skies</b> from your home screen.</li>
        </ol>
      ) : os === 'android' ? (
        state.canPrompt ? (
          <div className="install-card">
            <button type="button" className="big" onClick={() => promptInstall()}>Install the game</button>
          </div>
        ) : (
          <ol className="install-card steps">
            <li>Tap Chrome’s menu <b>⋮</b> at the top right.</li>
            <li>Tap <b>Add to Home screen</b> or <b>Install app</b>.</li>
            <li>Open <b>Keeper of Skies</b> from your home screen.</li>
          </ol>
        )
      ) : (
        <div className="install-card">
          <p>Open this page on your phone to install it:</p>
          <p className="install-url">{location.origin + location.pathname}</p>
          {state.canPrompt && <button type="button" className="big" onClick={() => promptInstall()}>Install on this computer</button>}
        </div>
      )}

      <p className="hint center">Your progress is saved on the phone, inside the app.</p>
    </div>
  );
}
