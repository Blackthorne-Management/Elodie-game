// Export and Import save code dialogs. These are DOM (not canvas) so the code can be selected,
// copied and pasted on any device.

function build(title: string, hint: string): {
  overlay: HTMLDivElement;
  textarea: HTMLTextAreaElement;
  error: HTMLParagraphElement;
  actions: HTMLDivElement;
} {
  const overlay = document.createElement('div');
  overlay.className = 'code-dialog';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  const panel = document.createElement('div');
  panel.className = 'code-panel';
  const h = document.createElement('h2');
  h.textContent = title;
  const p = document.createElement('p');
  p.textContent = hint;
  const textarea = document.createElement('textarea');
  textarea.rows = 4;
  textarea.spellcheck = false;
  textarea.setAttribute('aria-label', 'Save code');
  const error = document.createElement('p');
  error.className = 'code-error';
  error.setAttribute('role', 'alert');
  const actions = document.createElement('div');
  actions.className = 'code-actions';
  panel.append(h, p, textarea, error, actions);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
  return { overlay, textarea, error, actions };
}

function button(label: string, onClick: () => void, primary = false): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = label;
  if (primary) b.className = 'primary';
  b.addEventListener('click', onClick);
  return b;
}

function closeOnEscape(overlay: HTMLElement, close: () => void): void {
  overlay.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Escape') close();
  });
}

export function openExportDialog(code: string, onClose: () => void): void {
  const { overlay, textarea, error, actions } = build(
    'Export save code',
    'Copy this code and keep it somewhere safe. Import it on any device to continue.',
  );
  textarea.value = code;
  textarea.readOnly = true;
  const close = () => {
    overlay.remove();
    onClose();
  };
  const copy = button('Copy', () => {
    textarea.select();
    navigator.clipboard?.writeText(code).then(
      () => (error.textContent = 'Copied.'),
      () => (error.textContent = 'Select the code and copy it by hand.'),
    );
  }, true);
  actions.append(copy, button('Close', close));
  closeOnEscape(overlay, close);
  textarea.focus();
  textarea.select();
}

/** `onImport` returns an error message, or null when the code was accepted. */
export function openImportDialog(onImport: (code: string) => string | null, onClose: () => void): void {
  const { overlay, textarea, error, actions } = build(
    'Import save code',
    'Paste a save code. It replaces the current game and the stored save.',
  );
  textarea.placeholder = 'BQ1....';
  const close = () => {
    overlay.remove();
    onClose();
  };
  const load = button('Load', () => {
    const problem = onImport(textarea.value);
    if (problem) error.textContent = problem;
    else close();
  }, true);
  actions.append(load, button('Cancel', close));
  closeOnEscape(overlay, close);
  textarea.focus();
}
