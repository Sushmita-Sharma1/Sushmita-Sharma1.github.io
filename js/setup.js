/**
 * Sushmita Sharma Portfolio - Admin Setup Controller
 * Generates secure hashed credentials for data/auth.js using Web Crypto.
 */

(function () {
  'use strict';

  const setupForm = document.getElementById('sf');
  const outputTextarea = document.getElementById('out');
  const messageEl = document.getElementById('msg');
  const downloadBtn = document.getElementById('dlauth');

  if (!setupForm) return;

  /**
   * Updates user feedback message.
   * @param {string} text - Status message.
   * @param {'info'|'error'|'success'} statusType
   */
  const setMessage = (text, statusType = 'info') => {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.className = `note auth-status status-${statusType}`;
  };

  /**
   * Triggers download of generated auth file.
   * @param {string} content - JavaScript file content.
   */
  const triggerAuthDownload = (content) => {
    const blob = new Blob([content], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'auth.js';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  setupForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = setupForm.username.value.trim();
    const password = setupForm.password.value;
    const confirmPassword = setupForm.confirm.value;

    if (!username) {
      setMessage('Username is required.', 'error');
      return;
    }

    if (password.length < 10) {
      setMessage('Password must be at least 10 characters long.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match. Please verify.', 'error');
      return;
    }

    setMessage('Generating cryptographic salt and deriving PBKDF2 hash...', 'info');

    try {
      const salt = window.Auth.newSalt();
      const derivedHash = await window.Auth.derive(password, salt, window.Auth.ITER);

      const authData = {
        user: username,
        salt: salt,
        iter: window.Auth.ITER,
        hash: derivedHash
      };

      const fileContent = `/* Admin login (password stored as a PBKDF2 hash). Replace with a new file from setup.html to change it. */\nwindow.SITE_AUTH = ${JSON.stringify(authData, null, 2)};\n`;

      outputTextarea.value = fileContent;
      outputTextarea.hidden = false;

      if (downloadBtn) {
        downloadBtn.hidden = false;
        downloadBtn.onclick = () => triggerAuthDownload(fileContent);
      }

      setMessage('Credentials generated successfully! Download or copy the snippet and replace data/auth.js.', 'success');
    } catch (error) {
      setMessage(`Hashing failed: ${error.message}`, 'error');
    }
  });
})();
