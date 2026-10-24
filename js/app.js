/**
 * Portfolio core: content store, safe rendering helpers, shared utilities.
 *
 * Loaded on every page. Exposes one frozen global, `window.App`.
 * Design rules:
 *   - Every string that reaches innerHTML is escaped first (see `esc`).
 *   - Every URL that reaches an href/src passes through `sanitizeUrl`.
 *   - No dependencies, no build step.
 */
(function () {
  'use strict';

  // ── Escaping & URL safety ─────────────────────────────────────────────────

  const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  /** Escape text for safe insertion into HTML (text nodes and quoted attributes). */
  const esc = (value) =>
    value == null ? '' : String(value).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);

  const unescapeAmp = (value) => value.replace(/&amp;/g, '&');

  const CONTROL_CHARS   = /[\u0000-\u001F\u007F-\u009F]/;
  const SAFE_PROTOCOLS  = new Set(['http:', 'https:', 'mailto:', 'tel:']);
  const RELATIVE_START  = /^(?:\.\/|\/(?!\/)|media\/|docs\/|images\/|videos\/)/i;
  const BARE_FILE       = /^[a-z0-9_-]+\.(?:html|pdf|mp4|webm|ogg|png|jpe?g|gif|webp|svg)(?:\?.*)?$/i;
  const IMAGE_EXT       = /\.(?:jpe?g|png|gif|webp|svg|bmp|avif|ico)$/i;

  /** True when a path or file name has an image extension. */
  const isImage = (name) => IMAGE_EXT.test(String(name || ''));

  /**
   * Return a safe URL string, or '' when the input is not allowed.
   * Allows http(s), mailto, tel and (optionally) site-relative paths.
   * Blocks javascript:/data:/vbscript:, protocol-relative `//host` URLs,
   * control characters and directory traversal.
   */
  const sanitizeUrl = (rawUrl, allowRelative = true) => {
    if (!rawUrl || typeof rawUrl !== 'string') return '';
    const url = rawUrl.trim();
    if (!url || CONTROL_CHARS.test(url)) return '';

    if (allowRelative && (RELATIVE_START.test(url) || BARE_FILE.test(url))) {
      if (/\.\.[\\/]/.test(url) || url.includes('\\')) return '';
      try {
        return encodeURI(decodeURI(url));
      } catch {
        return ''; // malformed %-escape
      }
    }

    try {
      const parsed = new URL(url, window.location.origin);
      return SAFE_PROTOCOLS.has(parsed.protocol) ? parsed.href : '';
    } catch {
      return '';
    }
  };

  // ── Dates ─────────────────────────────────────────────────────────────────

  /** "2025-06-01" → "Jun 2025". Formatted in UTC so the month never shifts by timezone. */
  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return Number.isNaN(date.getTime())
      ? ''
      : date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  };

  // ── Markdown (small, safe subset) ─────────────────────────────────────────

  const externalAttrs = (href) =>
    /^https?:\/\//i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : '';

  /** Inline formatting: [label](url), bare URLs, `code`, **bold**, *italic*. Escapes first. */
  const formatInline = (text) => {
    if (!text) return '';
    let out = esc(text);

    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
      const href = sanitizeUrl(unescapeAmp(url));
      return href ? `<a href="${esc(href)}"${externalAttrs(href)}>${label}</a>` : label;
    });

    // Bare URLs not already inside an href or an anchor label.
    out = out.replace(/(^|[^"=>])(https?:\/\/[^\s<]*[^\s<.,;:!?)])/g, (match, prefix, rawUrl) => {
      const href = sanitizeUrl(unescapeAmp(rawUrl));
      return href ? `${prefix}<a href="${esc(href)}"${externalAttrs(href)}>${rawUrl}</a>` : match;
    });

    return out
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
  };

  /** Markdown → HTML. Supports ##/### headings, "- " bullets, paragraphs and inline formatting. */
  const md = (markdown) => {
    if (!markdown) return '';

    return String(markdown)
      .replace(/\r\n/g, '\n')
      .split(/\n\s*\n/)
      .map((block) => {
        let html = '';
        let items = [];
        const flushList = () => {
          if (items.length) html += `<ul>${items.join('')}</ul>`;
          items = [];
        };

        block.trim().split('\n').forEach((raw) => {
          const line = raw.trim();
          if (!line) return;
          if (line.startsWith('### '))      { flushList(); html += `<h3>${esc(line.slice(4))}</h3>`; }
          else if (line.startsWith('## '))  { flushList(); html += `<h2>${esc(line.slice(3))}</h2>`; }
          else if (line.startsWith('- '))   { items.push(`<li>${formatInline(line.slice(2))}</li>`); }
          else                              { flushList(); html += `<p>${formatInline(line)}</p>`; }
        });

        flushList();
        return html;
      })
      .join('');
  };

  // ── Components ────────────────────────────────────────────────────────────

  const chips = (tags) => {
    if (!Array.isArray(tags)) return '';
    const spans = tags
      .map((tag) => String(tag ?? '').trim())
      .filter(Boolean)
      .map((tag) => `<span>${esc(tag)}</span>`)
      .join('');
    return spans ? `<div class="chips">${spans}</div>` : '';
  };

  /** Card markup for a case study (`kind` 'work') or blog post (`kind` 'blog'). */
  const card = (item, kind) => {
    if (!item || !item.slug) return '';
    const page = kind === 'blog' ? 'blog-post.html' : 'work-detail.html';
    return `
      <a class="card" href="${page}?slug=${encodeURIComponent(item.slug)}">
        <small>${esc(formatDate(item.date))}</small>
        <h3>${esc(item.title || 'Untitled')}</h3>
        <p>${esc(item.summary || '')}</p>
        ${chips(item.tags)}
      </a>`;
  };

  const qs = (name) => {
    try {
      return new URLSearchParams(window.location.search).get(name);
    } catch {
      return null;
    }
  };

  /** Set document title and meta description for dynamic pages. */
  const meta = (title, description) => {
    if (title) document.title = `${title} | Sushmita Sharma`;
    if (description) {
      const tag = document.querySelector('meta[name="description"]');
      if (tag) tag.setAttribute('content', String(description).slice(0, 160));
    }
  };

  // ── Content store ─────────────────────────────────────────────────────────

  const source = window.SITE_CONTENT || {};
  const store = {
    works: Array.isArray(source.works) ? [...source.works] : [],
    posts: Array.isArray(source.posts) ? [...source.posts] : []
  };

  /** A collection ('works' | 'posts') as a new array, newest first. */
  const all = (collection) =>
    [...(store[collection] || [])].sort((a, b) =>
      String(b.date || '').localeCompare(String(a.date || '')));

  /** Replace the in-memory collections (used by the admin panel after loading data). */
  const set = (content) => {
    if (content && Array.isArray(content.works)) store.works = [...content.works];
    if (content && Array.isArray(content.posts)) store.posts = [...content.posts];
  };

  // ── Footer year ───────────────────────────────────────────────────────────

  const stampYear = () => {
    const el = document.getElementById('yr');
    if (el) el.textContent = String(new Date().getFullYear());
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', stampYear, { once: true });
  } else {
    stampYear();
  }

  window.App = Object.freeze({
    store, all, set,
    esc, sanitizeUrl, isImage,
    md, chips, card, fd: formatDate,
    qs, meta
  });
})();
