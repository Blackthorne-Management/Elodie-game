import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { requestPersistence } from './state/save';
import { listenForInstallPrompt } from './state/install';

listenForInstallPrompt();
requestPersistence();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
