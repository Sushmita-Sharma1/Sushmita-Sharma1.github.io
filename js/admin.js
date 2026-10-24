/**
 * Admin panel: a small in-browser CMS for data/content.js.
 *
 * Two ways to save:
 *   1. GitHub  - commits data/content.js (and uploaded media) through the GitHub Contents API.
 *   2. Local   - writes straight to a data/content.js you pick, via the File System Access API
 *                (Chrome / Edge only).
 *
 * Structure of this file (top to bottom):
 *   constants -> DOM refs -> state -> helpers -> storage (IndexedDB) -> content (de)serialising
 *   -> GitHub client -> media saving -> video & attachment widgets -> sign-in -> connection
 *   -> entry CRUD -> boot()
 *
 * IMPORTANT: boot() is called as the very last statement. Everything it touches is a `const`,
 * and a `const` cannot be used before its line has run, so nothing may start work earlier.
 */
(function () {
  'use strict';

  const { esc, isImage, sanitizeUrl } = window.App;

  // ── Constants ──────────────────────────────────────────────────────────────
  const SESSION_KEY    = 'adminSession';
  const GIT_KEY        = 'adminGit';
  const IDB_NAME       = 'portfolio-admin';
  const IDB_FILE_STORE = 'h';
  const IDB_DIR_STORE  = 'dir';
  const MAX_ATTEMPTS   = 5;
  const LOCKOUT_MS     = 15 * 60 * 1000;
  const SESSION_MS     = 8 * 60 * 60 * 1000;
  const MAX_UPLOAD     = 25 * 1024 * 1024;
  const CONTENT_PATH   = 'data/content.js';
  const FOLDERS        = { video: 'media/videos', image: 'media/images', doc: 'media/docs' };

  // ── DOM refs ───────────────────────────────────────────────────────────────
  const $ = (id) => document.getElementById(id);
  const dom = {
    gate: $('gate'), panel: $('panel'), editor: $('editor'),
    loginForm: $('lf'), loginMsg: $('lmsg'), logoutBtn: $('logout'),
    gitForm: $('gf'), connectBtn: $('connect'), forgetBtn: $('forget'),
    downloadBtn: $('dl'), downloadSitemapBtn: $('dlmap'), fileNote: $('filenote'),
    entryForm: $('f'), entries: $('entries'), status: $('msg'),
    saveBtn: $('save'), cancelBtn: $('cancel'),
    dashboardUrlField: $('dashboard-url-field'), dashboardUrl: $('entry-dashboard-url'),
    videoField: $('video-upload-field'), videoInput: $('entry-video'),
    videoPrompt: $('video-upload-prompt'), videoPreviewWrap: $('video-preview-wrap'),
    videoPreview: $('video-preview'), videoMeta: $('video-meta'), videoClearBtn: $('video-clear-btn'),
    videoCurrent: $('video-current'), videoCurrentPath: $('video-current-path'),
    videoRemoveSavedBtn: $('video-remove-saved-btn'),
    attachDropzone: $('attach-dropzone'), attachInput: $('entry-attachments'), attachGrid: $('attach-grid')
  };

  // ── State ──────────────────────────────────────────────────────────────────
  const authConfig = window.SITE_AUTH;

  let gitConfig = null;          // { url, repo, dir, branch, token } while connected to GitHub
  let githubSha = '';            // blob SHA of data/content.js on GitHub (needed to update it)
  let localFileHandle = null;    // File System Access handle for data/content.js
  let cachedFileHandle = null;   // handle remembered from a previous visit (needs re-permission)
  let projectDirHandle = null;   // site root folder, used to save uploaded media in local mode
  let slugTouched = false;       // true once the user edits the slug by hand
  let failedLogins = 0;
  let lockedUntil = 0;

  let pendingVideo = null;       // File chosen for upload
  let removeSavedVideo = false;  // user clicked "Remove" on the already-saved video
  let attachItems = [];          // [{ id, file|null, path, name, isImage, objectUrl }]
  let attachSeed = 0;
  let dragId = null;

  // ── Small helpers ──────────────────────────────────────────────────────────
  const setStatus = (message) => { if (dom.status) dom.status.textContent = message; };
  const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
  const todayIso = () => new Date().toISOString().slice(0, 10);

  /** Session + GitHub credentials live in sessionStorage only (cleared when the tab closes). */
  const readSession = (key) => {
    try { return JSON.parse(sessionStorage.getItem(key)); } catch { return null; }
  };
  const writeSession = (key, value) => {
    try {
      if (value == null) sessionStorage.removeItem(key);
      else sessionStorage.setItem(key, JSON.stringify(value));
    } catch { /* storage unavailable (private mode) - sign-in just won't persist */ }
  };

  const triggerDownload = (name, content, mime) => {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement('a'), { href: url, download: name });
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const textToBase64 = (text) => {
    const bytes = new TextEncoder().encode(text);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 0x8000) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    }
    return btoa(binary);
  };

  const base64ToText = (b64) => {
    const binary = atob(b64.replace(/\s/g, ''));
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  };

  // ── IndexedDB: remembers file/folder handles between visits ───────────────
  let dbPromise = null;
  const openDb = () => {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(IDB_NAME, 2);
        request.onupgradeneeded = () => {
          const db = request.result;
          [IDB_FILE_STORE, IDB_DIR_STORE].forEach((name) => {
            if (!db.objectStoreNames.contains(name)) db.createObjectStore(name);
          });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    return dbPromise;
  };

  const idbGet = async (store, key) => {
    try {
      const db = await openDb();
      return await new Promise((resolve) => {
        const request = db.transaction(store, 'readonly').objectStore(store).get(key);
        request.onsuccess = () => resolve(request.result ?? null);
        request.onerror = () => resolve(null);
      });
    } catch { return null; }
  };

  const idbSet = async (store, key, value) => {
    try {
      const db = await openDb();
      return await new Promise((resolve) => {
        const tx = db.transaction(store, 'readwrite');
        if (value) tx.objectStore(store).put(value, key);
        else tx.objectStore(store).delete(key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch { return false; }
  };

  const getFileHandle = () => idbGet(IDB_FILE_STORE, 'file');
  const setFileHandle = (handle) => idbSet(IDB_FILE_STORE, 'file', handle);
  const getDirHandle  = () => idbGet(IDB_DIR_STORE, 'root');
  const setDirHandle  = (handle) => idbSet(IDB_DIR_STORE, 'root', handle);

  // ── content.js (de)serialising ─────────────────────────────────────────────
  const serialize = () => {
    const { works, posts } = window.App.store;
    return `/* THE STORAGE FILE: all work and blog entries live here. Replace this file with the one downloaded from the admin panel to publish changes. */\nwindow.SITE_CONTENT = ${JSON.stringify({ works, posts }, null, 2)};\n`;
  };

  /** Read `window.SITE_CONTENT = {...};` back into an object, or null if the text isn't that. */
  const parseContentScript = (text) => {
    const match = /window\.SITE_CONTENT\s*=\s*([\s\S]*?);?\s*$/.exec(text);
    if (!match) return null;
    try {
      const data = JSON.parse(match[1]);
      return Array.isArray(data.works) && Array.isArray(data.posts) ? data : null;
    } catch { return null; }
  };

  // ── GitHub client ──────────────────────────────────────────────────────────
  class GitHubError extends Error {
    constructor(status, message) { super(message); this.status = status; }
  }

  const cleanToken = (raw) =>
    String(raw || '').trim().replace(/^["']+|["']+$/g, '').replace(/^(?:bearer|token)\s+/i, '').trim();

  const cleanDir = (raw) => String(raw || '').trim().replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');

  /** Path inside the repository for a site-relative path (adds the optional site folder). */
  const repoPath = (path) =>
    (gitConfig.dir ? `${gitConfig.dir}/${path}` : path).split('/').map(encodeURIComponent).join('/');

  /**
   * Call the GitHub Contents API for a site-relative `path`.
   * Throws GitHubError with a message that says what to do next.
   */
  const ghFetch = async (method, path, body) => {
    const repo = gitConfig.repo.trim().replace(/^\/+|\/+$/g, '');
    const branch = (gitConfig.branch || 'main').trim();
    const query = method === 'GET' ? `?ref=${encodeURIComponent(branch)}` : '';
    const token = cleanToken(gitConfig.token);

    let response;
    try {
      response = await fetch(`https://api.github.com/repos/${repo}/contents/${repoPath(path)}${query}`, {
        method,
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          ...(body ? { 'Content-Type': 'application/json' } : {})
        },
        body: body ? JSON.stringify(body) : undefined
      });
    } catch {
      throw new GitHubError(0, 'Could not reach GitHub. Check your internet connection and that nothing is blocking api.github.com.');
    }

    const data = await response.json().catch(() => ({}));
    if (response.ok) return data;

    const { status } = response;
    const detail = data.message ? ` (GitHub says: ${data.message})` : '';
    if (status === 401) {
      throw new GitHubError(status, 'GitHub rejected the access token. It is wrong, expired or revoked. Create a new token and paste it again.');
    }
    if (status === 403 && /rate limit/i.test(data.message || '')) {
      throw new GitHubError(status, 'GitHub rate limit reached. Wait a few minutes and try again.');
    }
    if (status === 403) {
      throw new GitHubError(status, `The token is not allowed to do this. Give it access to the "${repo}" repository with Contents set to Read and write.${detail}`);
    }
    if (status === 404) {
      throw new GitHubError(status, `Not found: "${path}" in "${repo}" on branch "${branch}". Check the repository name, the branch, the folder field, and that the token can access this repository.`);
    }
    if (status === 409 || status === 422) {
      throw new GitHubError(status, `GitHub says this file changed since you connected. Click Disconnect, connect again, then repeat your change.${detail}`);
    }
    throw new GitHubError(status, data.message || `GitHub returned HTTP ${status}.`);
  };

  /** Work out which repository / folder the website URL most likely points at. */
  const repoCandidates = (rawUrl, repoInput, dirInput) => {
    const dir = cleanDir(dirInput);
    const repo = repoInput.trim().replace(/^https?:\/\/github\.com\//i, '').replace(/\.git$/i, '').replace(/^\/+|\/+$/g, '');
    if (repo) return /^[\w.-]+\/[\w.-]+$/.test(repo) ? [{ repo, dir }] : [];

    let url;
    try { url = new URL(rawUrl); } catch { return []; }

    if (url.hostname === 'github.com') {
      const [owner, name] = url.pathname.split('/').filter(Boolean);
      return owner && name ? [{ repo: `${owner}/${name.replace(/\.git$/i, '')}`, dir }] : [];
    }

    const pages = /^([^.]+)\.github\.io$/i.exec(url.hostname);
    if (!pages) return [];
    const owner = pages[1];
    const first = url.pathname.split('/').filter(Boolean)[0] || '';
    const looksLikeFile = /\.[a-z0-9]+$/i.test(first);

    if (!first || looksLikeFile) return [{ repo: `${owner}/${owner}.github.io`, dir }];
    return [
      { repo: `${owner}/${first}`, dir },                                // project site: owner.github.io/<repo>
      { repo: `${owner}/${owner}.github.io`, dir: dir || first }         // user site that keeps the site in a folder
    ];
  };

  const loadFromGitHub = async () => {
    const file = await ghFetch('GET', CONTENT_PATH);
    if (!file.content) throw new GitHubError(0, `${CONTENT_PATH} on GitHub is too large to read through the API.`);
    const parsed = parseContentScript(base64ToText(file.content));
    if (!parsed) throw new GitHubError(0, `${CONTENT_PATH} on GitHub is not a valid content file.`);
    githubSha = file.sha;
    return parsed;
  };

  /** Try each repo/folder/branch guess until data/content.js loads. */
  const connectToGitHub = async ({ url, repo, dir, branch, token }) => {
    const candidates = repoCandidates(url, repo, dir);
    if (!candidates.length) {
      throw new Error('Could not work out the repository. Type it in the repository box as owner/repo.');
    }
    const branches = [...new Set([branch || 'main', ...(branch === 'main' || !branch ? ['master'] : [])])];

    for (const candidate of candidates) {
      for (const tryBranch of branches) {
        gitConfig = { url, repo: candidate.repo, dir: candidate.dir, branch: tryBranch, token: cleanToken(token) };
        try {
          return { data: await loadFromGitHub(), config: gitConfig };
        } catch (err) {
          if (err instanceof GitHubError && err.status === 404) continue;
          gitConfig = null;
          throw err;
        }
      }
    }
    gitConfig = null;
    const tried = candidates.map((c) => `${c.repo}${c.dir ? ` / ${c.dir}` : ''}`).join(', ');
    throw new Error(`${CONTENT_PATH} was not found. Tried: ${tried} on branch ${branches.join(' / ')}. If your site files sit inside a folder of the repository, type that folder name in the folder box. A private repository also shows "not found" when the token has no access to it.`);
  };

  /** Commit data/content.js (or write the local file). Returns true on success. */
  const persist = async () => {
    if (gitConfig) {
      try {
        const result = await ghFetch('PUT', CONTENT_PATH, {
          message: 'Update content via portfolio admin panel',
          content: textToBase64(serialize()),
          sha: githubSha,
          branch: gitConfig.branch
        });
        githubSha = result.content.sha;
        return true;
      } catch (err) {
        setStatus(`Could not save to GitHub: ${err.message}`);
        return false;
      }
    }

    if (!localFileHandle) {
      setStatus('Please connect your website or a local content.js file before saving.');
      return false;
    }
    try {
      const writable = await localFileHandle.createWritable();
      await writable.write(serialize());
      await writable.close();
      return true;
    } catch (err) {
      setStatus(`Could not write to the local file: ${err.message}`);
      return false;
    }
  };

  // ── Saving uploaded media ──────────────────────────────────────────────────

  /** Save one uploaded file; returns its site-relative path. Throws with a readable message. */
  const saveMedia = async (file, folder) => {
    const safeName = file.name.replace(/[^a-z0-9._-]/gi, '_');
    const relPath = `${folder}/${safeName}`;

    if (gitConfig) {
      if (file.size > MAX_UPLOAD) {
        throw new Error(`"${file.name}" is larger than 25 MB. Compress it first (GitHub limits file size).`);
      }
      let sha = '';
      try { sha = (await ghFetch('GET', relPath)).sha || ''; } catch { /* new file */ }
      try {
        await ghFetch('PUT', relPath, {
          message: `Add media: ${safeName}`,
          content: await fileToBase64(file),
          branch: gitConfig.branch,
          ...(sha ? { sha } : {})
        });
      } catch (err) {
        throw new Error(`Could not upload "${file.name}": ${err.message}`);
      }
      return relPath;
    }

    if (!projectDirHandle && window.showDirectoryPicker) {
      try {
        setStatus('Select your website folder (the one that contains index.html) so files can be saved there…');
        projectDirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
        await setDirHandle(projectDirHandle);
      } catch {
        triggerDownload(safeName, file, file.type);
        setStatus(`Downloaded "${safeName}". Move it into your website's ${folder}/ folder.`);
        return relPath;
      }
    }

    if (projectDirHandle) {
      try {
        let permission = await projectDirHandle.queryPermission({ mode: 'readwrite' });
        if (permission !== 'granted') permission = await projectDirHandle.requestPermission({ mode: 'readwrite' });
        if (permission !== 'granted') throw new Error('permission was denied');

        let dir = projectDirHandle;
        for (const part of folder.split('/')) dir = await dir.getDirectoryHandle(part, { create: true });
        const handle = await dir.getFileHandle(safeName, { create: true });
        const writable = await handle.createWritable();
        await writable.write(file);
        await writable.close();
        return relPath;
      } catch (err) {
        throw new Error(`Could not save "${file.name}": ${err.message}`);
      }
    }

    triggerDownload(safeName, file, file.type);
    setStatus(`Downloaded "${safeName}". Move it into your website's ${folder}/ folder.`);
    return relPath;
  };

  // ── Video widget ───────────────────────────────────────────────────────────
  const clearVideoPreview = () => {
    pendingVideo = null;
    if (dom.videoInput) dom.videoInput.value = '';
    if (dom.videoPreview) {
      dom.videoPreview.pause();
      if (dom.videoPreview.src.startsWith('blob:')) URL.revokeObjectURL(dom.videoPreview.src);
      dom.videoPreview.removeAttribute('src');
      dom.videoPreview.load();
    }
    if (dom.videoPreviewWrap) dom.videoPreviewWrap.hidden = true;
    if (dom.videoPrompt) dom.videoPrompt.hidden = false;
  };

  const showVideoPreview = (file) => {
    dom.videoPreview.src = URL.createObjectURL(file);
    dom.videoMeta.textContent = `${file.name}  ·  ${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    dom.videoPrompt.hidden = true;
    dom.videoPreviewWrap.hidden = false;
  };

  dom.videoInput?.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    pendingVideo = file;
    showVideoPreview(file);
  });
  dom.videoClearBtn?.addEventListener('click', clearVideoPreview);
  dom.videoRemoveSavedBtn?.addEventListener('click', () => {
    removeSavedVideo = true;
    dom.videoCurrent.hidden = true;
  });

  const resolveVideo = async (existing) => {
    if (pendingVideo) return saveMedia(pendingVideo, FOLDERS.video);
    return removeSavedVideo ? '' : existing || '';
  };

  // ── Attachments widget (images & documents, drag to reorder) ───────────────
  const ICON_FILE = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
  const ICON_GRIP = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="8" x2="19" y2="8"/><line x1="5" y1="12" x2="19" y2="12"/><line x1="5" y1="16" x2="19" y2="16"/></svg>';
  const ICON_CLOSE = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  const renderAttachGrid = () => {
    if (!dom.attachGrid) return;
    dom.attachGrid.innerHTML = attachItems.map((item, index) => {
      const src = item.objectUrl || sanitizeUrl(item.path, true);
      const thumb = item.isImage && src
        ? `<img src="${esc(src)}" alt="${esc(item.name)}" class="ac-thumb" loading="lazy">`
        : `<div class="ac-doc-icon">${ICON_FILE}</div>`;
      return `
        <div class="attach-card" data-id="${esc(item.id)}" draggable="true">
          <div class="ac-order">${index + 1}</div>
          <div class="ac-drag-handle" title="Drag to reorder">${ICON_GRIP}</div>
          <button type="button" class="ac-remove" data-rid="${esc(item.id)}" title="Remove" aria-label="Remove ${esc(item.name)}">${ICON_CLOSE}</button>
          ${thumb}
          <div class="ac-name" title="${esc(item.name)}">${esc(item.name)}</div>
          ${item.file ? '' : '<span class="ac-saved-badge">saved</span>'}
        </div>`;
    }).join('');
  };

  const clearAttachments = () => {
    attachItems.forEach((item) => item.objectUrl && URL.revokeObjectURL(item.objectUrl));
    attachItems = [];
    renderAttachGrid();
  };

  const addFiles = (fileList) => {
    Array.from(fileList).forEach((file) => {
      const image = isImage(file.name);
      attachItems.push({
        id: `a${++attachSeed}`, file, path: '', name: file.name,
        isImage: image, objectUrl: image ? URL.createObjectURL(file) : null
      });
    });
    renderAttachGrid();
  };

  const loadExistingAttachments = (paths) => {
    clearAttachments();
    (paths || []).forEach((path) => {
      const name = path.split('/').pop();
      attachItems.push({ id: `a${++attachSeed}`, file: null, path, name, isImage: isImage(name), objectUrl: null });
    });
    renderAttachGrid();
  };

  const resolveAttachments = async () => {
    const paths = [];
    for (const item of attachItems) {
      if (item.file) paths.push(await saveMedia(item.file, item.isImage ? FOLDERS.image : FOLDERS.doc));
      else if (item.path) paths.push(item.path);
    }
    return paths;
  };

  if (dom.attachGrid) {
    const clearDragMarks = () =>
      dom.attachGrid.querySelectorAll('.attach-card').forEach((c) => c.classList.remove('drag-over', 'is-dragging'));

    dom.attachGrid.addEventListener('click', (event) => {
      const button = event.target.closest('[data-rid]');
      if (!button) return;
      const index = attachItems.findIndex((item) => item.id === button.dataset.rid);
      if (index < 0) return;
      if (attachItems[index].objectUrl) URL.revokeObjectURL(attachItems[index].objectUrl);
      attachItems.splice(index, 1);
      renderAttachGrid();
    });

    dom.attachGrid.addEventListener('dragstart', (event) => {
      const card = event.target.closest('.attach-card');
      if (!card) return;
      dragId = card.dataset.id;
      card.classList.add('is-dragging');
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', dragId);
    });

    dom.attachGrid.addEventListener('dragover', (event) => {
      const card = event.target.closest('.attach-card');
      if (!card || !dragId) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      dom.attachGrid.querySelectorAll('.drag-over').forEach((c) => c.classList.remove('drag-over'));
      card.classList.add('drag-over');
    });

    dom.attachGrid.addEventListener('drop', (event) => {
      const card = event.target.closest('.attach-card');
      if (!card || !dragId) return;
      event.preventDefault();
      const from = attachItems.findIndex((item) => item.id === dragId);
      const to = attachItems.findIndex((item) => item.id === card.dataset.id);
      dragId = null;
      if (from >= 0 && to >= 0 && from !== to) {
        attachItems.splice(to, 0, attachItems.splice(from, 1)[0]);
        renderAttachGrid();
      }
    });

    dom.attachGrid.addEventListener('dragend', () => { dragId = null; clearDragMarks(); });
  }

  dom.attachInput?.addEventListener('change', (event) => {
    if (event.target.files?.length) addFiles(event.target.files);
    dom.attachInput.value = '';
  });

  if (dom.attachDropzone) {
    dom.attachDropzone.addEventListener('dragover', (event) => {
      event.preventDefault();
      dom.attachDropzone.classList.add('dragover');
    });
    dom.attachDropzone.addEventListener('dragleave', () => dom.attachDropzone.classList.remove('dragover'));
    dom.attachDropzone.addEventListener('drop', (event) => {
      event.preventDefault();
      dom.attachDropzone.classList.remove('dragover');
      if (event.dataTransfer.files?.length) addFiles(event.dataTransfer.files);
    });
  }

  // ── Form helpers ───────────────────────────────────────────────────────────
  const syncWorksFields = () => {
    if (!dom.entryForm) return;
    const isWork = dom.entryForm.kind.value === 'works';
    if (dom.dashboardUrlField) dom.dashboardUrlField.style.display = isWork ? '' : 'none';
    if (dom.videoField) dom.videoField.style.display = isWork ? '' : 'none';
    if (!isWork) {
      if (dom.dashboardUrl) dom.dashboardUrl.value = '';
      clearVideoPreview();
    }
  };

  const resetForm = () => {
    if (!dom.entryForm) return;
    dom.entryForm.reset();
    dom.entryForm.orig.value = '';
    dom.entryForm.kind.disabled = false;
    dom.entryForm.date.value = todayIso();
    if (dom.saveBtn) dom.saveBtn.textContent = 'Add entry';
    if (dom.cancelBtn) dom.cancelBtn.hidden = true;
    slugTouched = false;
    removeSavedVideo = false;
    clearVideoPreview();
    if (dom.videoCurrent) dom.videoCurrent.hidden = true;
    if (dom.videoCurrentPath) dom.videoCurrentPath.textContent = '';
    clearAttachments();
    syncWorksFields();
  };

  const validate = (entry) => {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(entry.slug) || entry.slug.length > 80) return 'Slug: lowercase letters, numbers and hyphens (max 80 characters).';
    if (!entry.title || entry.title.length > 120) return 'Title is required (up to 120 characters).';
    if (!entry.summary || entry.summary.length > 200) return 'Summary is required (up to 200 characters).';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) return 'Date must be YYYY-MM-DD.';
    if (!entry.body) return 'Content body is required.';
    if (entry.dashboardUrl && !/^https:\/\//i.test(sanitizeUrl(entry.dashboardUrl, false))) {
      return 'Dashboard URL must be a valid https:// web address.';
    }
    return '';
  };

  // ── Entry list ─────────────────────────────────────────────────────────────
  const renderList = () => {
    if (!dom.entries) return;
    const rows = [['works', 'Work'], ['posts', 'Blog']].flatMap(([collection, label]) =>
      window.App.all(collection).map((item) => `
        <div class="li">
          <span class="li-title"><span class="li-type-badge">${label}</span>${esc(item.title)}</span>
          <span class="li-actions">
            <button class="o" type="button" data-edit="${collection}|${esc(item.slug)}">Edit</button>
            <button class="o" type="button" data-delete="${collection}|${esc(item.slug)}">Delete</button>
          </span>
        </div>`));
    dom.entries.innerHTML = rows.join('') || '<p class="note">No entries created yet.</p>';
  };

  const startEdit = (collection, slug) => {
    const item = (window.App.store[collection] || []).find((entry) => entry.slug === slug);
    const form = dom.entryForm;
    if (!item || !form) return;

    form.kind.value = collection;
    form.kind.disabled = true;
    form.orig.value = item.slug;
    form.title.value = item.title;
    form.slug.value = item.slug;
    form.summary.value = item.summary;
    form.tags.value = (item.tags || []).join(', ');
    form.date.value = item.date;
    form.body.value = item.body;
    if (dom.dashboardUrl) dom.dashboardUrl.value = item.dashboardUrl || '';

    pendingVideo = null;
    removeSavedVideo = false;
    clearVideoPreview();
    const hasVideo = Boolean(item.videoPath);
    if (dom.videoCurrent) dom.videoCurrent.hidden = !hasVideo;
    if (dom.videoCurrentPath) dom.videoCurrentPath.textContent = item.videoPath || '';

    loadExistingAttachments(item.attachments);
    syncWorksFields();

    if (dom.saveBtn) dom.saveBtn.textContent = 'Save changes';
    if (dom.cancelBtn) dom.cancelBtn.hidden = false;
    slugTouched = true;
    setStatus(`Editing: "${item.title}"`);
    form.scrollIntoView({ behavior: 'smooth' });
  };

  const deleteEntry = async (collection, slug) => {
    if (!confirm(`Permanently delete "${slug}"?`)) return;
    const previous = window.App.store[collection];
    window.App.store[collection] = previous.filter((entry) => entry.slug !== slug);
    setStatus('Saving deletion…');
    if (await persist()) {
      renderList();
      setStatus(gitConfig ? 'Entry deleted. The live site updates in about a minute.' : 'Entry deleted.');
    } else {
      window.App.store[collection] = previous;
    }
  };

  dom.entries?.addEventListener('click', (event) => {
    const edit = event.target.closest('[data-edit]');
    const del = event.target.closest('[data-delete]');
    if (edit) startEdit(...edit.dataset.edit.split('|'));
    else if (del) deleteEntry(...del.dataset.delete.split('|'));
  });

  // ── Connection UI ──────────────────────────────────────────────────────────
  const activateEditor = (data, note) => {
    window.App.set(data);
    if (dom.editor) dom.editor.hidden = false;
    if (dom.gitForm) dom.gitForm.hidden = true;
    if (dom.connectBtn) dom.connectBtn.hidden = true;
    if (dom.forgetBtn) dom.forgetBtn.hidden = false;
    if (dom.fileNote) dom.fileNote.textContent = note;
    setStatus('');
    resetForm();
    renderList();
  };

  const describeConnection = (config) =>
    `Connected to ${config.repo}${config.dir ? ` / ${config.dir}` : ''} (${config.branch}). Changes are committed automatically.`;

  dom.gitForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = dom.gitForm;
    const submit = form.querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;
    setStatus('Connecting to GitHub…');
    try {
      const { data, config } = await connectToGitHub({
        url: form.url.value.trim(),
        repo: form.repo.value,
        dir: form.dir.value,
        branch: form.branch.value.trim(),
        token: form.token.value
      });
      writeSession(GIT_KEY, config);
      form.token.value = '';
      activateEditor(data, describeConnection(config));
    } catch (err) {
      setStatus(err.message);
    } finally {
      if (submit) submit.disabled = false;
    }
  });

  const attachLocalHandle = async (handle, askPermission) => {
    let permission = await handle.queryPermission({ mode: 'readwrite' });
    if (permission !== 'granted' && askPermission) permission = await handle.requestPermission({ mode: 'readwrite' });
    if (permission !== 'granted') {
      if (askPermission) setStatus('Write permission was not granted.');
      return false;
    }

    const data = parseContentScript(await (await handle.getFile()).text());
    if (!data) {
      setStatus('That file is not a valid content.js (it should start with window.SITE_CONTENT = ).');
      return false;
    }
    await setFileHandle(handle);
    localFileHandle = handle;
    activateEditor(data, 'Connected to your local content.js. Edits are saved to that file immediately.');
    return true;
  };

  dom.connectBtn?.addEventListener('click', async () => {
    if (!window.showOpenFilePicker) {
      setStatus('This browser cannot edit local files. Use Chrome or Edge, or connect through GitHub.');
      return;
    }
    try {
      let handle = cachedFileHandle;
      if (!handle) {
        [handle] = await window.showOpenFilePicker({
          multiple: false,
          types: [{ description: 'content.js', accept: { 'text/javascript': ['.js'] } }]
        });
        if (handle.name !== 'content.js') {
          setStatus("Please select the file named 'content.js' inside the data/ folder.");
          return;
        }
      }
      await attachLocalHandle(handle, true);
    } catch {
      if (cachedFileHandle) {
        cachedFileHandle = null;
        await setFileHandle(null);
        dom.connectBtn.textContent = 'Use a local file instead';
        setStatus('Could not reopen the saved file. Please select it again.');
      } else {
        setStatus('File selection was cancelled.');
      }
    }
  });

  dom.forgetBtn?.addEventListener('click', async () => {
    writeSession(GIT_KEY, null);
    await setFileHandle(null);
    await setDirHandle(null);
    location.reload();
  });

  /** On page load: reconnect using whatever the last session saved. */
  const restoreConnection = async () => {
    const saved = readSession(GIT_KEY);
    if (saved) {
      const form = dom.gitForm;
      if (form) {
        form.url.value = saved.url || '';
        form.repo.value = saved.repo || '';
        form.dir.value = saved.dir || '';
        form.branch.value = saved.branch || 'main';
      }
      gitConfig = saved;
      setStatus('Reconnecting to GitHub…');
      try {
        const data = await loadFromGitHub();
        activateEditor(data, describeConnection(gitConfig));
      } catch (err) {
        gitConfig = null;
        writeSession(GIT_KEY, null);
        setStatus(`Reconnection failed: ${err.message}`);
      }
      return;
    }

    if (!window.showOpenFilePicker) return;
    cachedFileHandle = await getFileHandle();
    projectDirHandle = await getDirHandle();
    if (!cachedFileHandle) return;
    try {
      if (!(await attachLocalHandle(cachedFileHandle, false))) {
        dom.connectBtn.textContent = 'Allow access to local content.js';
        dom.fileNote.textContent = 'Welcome back. Click "Allow access" to reconnect to your content file.';
      }
    } catch {
      cachedFileHandle = null;
      await setFileHandle(null);
    }
  };

  dom.downloadBtn?.addEventListener('click', () =>
    triggerDownload('content.js', serialize(), 'text/javascript;charset=utf-8'));

  dom.downloadSitemapBtn?.addEventListener('click', () => {
    const base = (dom.gitForm?.url.value.trim() || gitConfig?.url || '').replace(/\/(?:index\.html)?$/, '');
    if (!/^https?:\/\//.test(base)) { setStatus('Enter a valid website URL in the connection box first.'); return; }
    const pages = ['index.html', 'about.html', 'work.html', 'blog.html'].map((page) => [page]);
    window.App.all('works').forEach((item) => pages.push([`work-detail.html?slug=${encodeURIComponent(item.slug)}`, item.date]));
    window.App.all('posts').forEach((item) => pages.push([`blog-post.html?slug=${encodeURIComponent(item.slug)}`, item.date]));
    const urls = pages.map(([page, date]) =>
      `  <url>\n    <loc>${esc(`${base}/${page}`)}</loc>${date ? `\n    <lastmod>${date}</lastmod>` : ''}\n  </url>`);
    triggerDownload('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`, 'application/xml;charset=utf-8');
    setStatus('sitemap.xml downloaded. Place it in the root folder of your website.');
  });

  // ── Entry form ─────────────────────────────────────────────────────────────
  if (dom.entryForm) {
    const form = dom.entryForm;

    form.title.addEventListener('input', () => {
      if (!slugTouched && !form.orig.value) form.slug.value = slugify(form.title.value);
    });
    form.slug.addEventListener('input', () => { slugTouched = true; });
    form.kind.addEventListener('change', syncWorksFields);
    dom.cancelBtn?.addEventListener('click', () => { resetForm(); setStatus('Edit cancelled.'); });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (dom.saveBtn.disabled) return;

      const kind = form.kind.value;
      const orig = form.orig.value;
      const collection = window.App.store[kind] || [];
      const index = orig ? collection.findIndex((item) => item.slug === orig) : -1;
      const existing = index >= 0 ? collection[index] : null;

      const entry = {
        slug: form.slug.value.trim(),
        title: form.title.value.trim(),
        summary: form.summary.value.trim(),
        tags: form.tags.value.split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 10),
        date: form.date.value,
        body: form.body.value.trim()
      };
      const dashboardUrl = kind === 'works' && dom.dashboardUrl ? dom.dashboardUrl.value.trim() : '';
      if (dashboardUrl) entry.dashboardUrl = dashboardUrl;

      const problem = validate(entry);
      if (problem) { setStatus(problem); return; }
      if (collection.some((item, n) => item.slug === entry.slug && n !== index)) {
        setStatus('An entry with that slug already exists.');
        return;
      }

      dom.saveBtn.disabled = true;
      try {
        if (kind === 'works') {
          setStatus('Processing video…');
          const video = await resolveVideo(existing?.videoPath);
          if (video) entry.videoPath = video;
        }
        if (attachItems.length) {
          setStatus('Saving attachments…');
          const paths = await resolveAttachments();
          if (paths.length) entry.attachments = paths;
        }
      } catch (err) {
        setStatus(err.message);
        dom.saveBtn.disabled = false;
        return;
      }

      const backup = [...collection];
      if (index >= 0) collection[index] = entry; else collection.push(entry);

      setStatus('Saving entry…');
      const saved = await persist();
      dom.saveBtn.disabled = false;

      if (saved) {
        const liveNote = gitConfig ? ' The live site updates in about a minute.' : '';
        renderList();
        resetForm();
        setStatus(`${orig ? 'Changes saved.' : 'New entry published.'}${liveNote}`);
      } else {
        window.App.store[kind] = backup;
      }
    });
  }

  // ── Sign-in ────────────────────────────────────────────────────────────────
  const showDashboard = () => {
    dom.gate.hidden = true;
    dom.panel.hidden = false;
    restoreConnection();
  };

  const bindLogin = () => {
    if (!authConfig) {
      if (dom.loginMsg) dom.loginMsg.textContent = 'No admin account configured yet. Open setup.html to generate one.';
      const button = dom.loginForm?.querySelector('button');
      if (button) button.disabled = true;
      return;
    }

    dom.loginForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (Date.now() < lockedUntil) {
        dom.loginMsg.textContent = 'Too many attempts. Please wait 15 minutes.';
        return;
      }
      const user = dom.loginForm.username.value.trim();
      const pass = dom.loginForm.password.value;
      try {
        const hash = await window.Auth.derive(pass, authConfig.salt, authConfig.iter);
        if (hash === authConfig.hash && user === authConfig.user) {
          failedLogins = 0;
          dom.loginMsg.textContent = '';
          writeSession(SESSION_KEY, { exp: Date.now() + SESSION_MS });
          dom.loginForm.reset();
          showDashboard();
        } else {
          if (++failedLogins >= MAX_ATTEMPTS) { lockedUntil = Date.now() + LOCKOUT_MS; failedLogins = 0; }
          dom.loginMsg.textContent = 'Invalid username or password.';
          dom.loginForm.password.value = '';
        }
      } catch (err) {
        dom.loginMsg.textContent = err.message;
      }
    });

    dom.logoutBtn?.addEventListener('click', () => {
      writeSession(SESSION_KEY, null);
      writeSession(GIT_KEY, null);   // never leave the GitHub token behind after signing out
      location.reload();
    });
  };

  // ── Boot (must stay last: see the note at the top of this file) ───────────
  const boot = () => {
    try { localStorage.removeItem(GIT_KEY); localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
    bindLogin();
    const session = readSession(SESSION_KEY);
    if (authConfig && session && session.exp > Date.now()) showDashboard();
  };

  boot();
})();
