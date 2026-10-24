/**
 * Detail page controller: renders one case study (work-detail.html)
 * or one blog post (blog-post.html), chosen by <body data-kind> and ?slug=.
 */
(function () {
  'use strict';

  const { esc, sanitizeUrl, isImage } = window.App;

  /** Hosts allowed by the page CSP `frame-src`. Anything else is shown as a link, not an iframe. */
  const EMBED_HOSTS = new Set(['public.tableau.com', 'app.powerbi.com']);

  const VIDEO_TYPES = { mp4: 'video/mp4', webm: 'video/webm', ogg: 'video/ogg', ogv: 'video/ogg' };

  const ICON_EXTERNAL = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
  const ICON_DOWNLOAD = '<svg class="attach-doc-dl" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
  const ICON_BLOCKED = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>';

  /** File name safe for display: last path segment, unusual characters replaced. */
  const baseName = (path) =>
    (String(path || '').replace(/\\/g, '/').split('/').pop() || '').replace(/[^a-zA-Z0-9._-]/g, '_');

  /** Add Tableau's embed parameters so the viz renders without the Tableau Public chrome. */
  const toEmbedUrl = (url) => {
    try {
      const u = new URL(url);
      if (u.hostname.endsWith('tableau.com')) {
        if (!u.searchParams.has(':showVizHome')) u.searchParams.set(':showVizHome', 'no');
        if (!u.searchParams.has(':embed')) u.searchParams.set(':embed', 'true');
        return u.href;
      }
    } catch { /* fall through to the original URL */ }
    return url;
  };

  const sectionHeader = (title, href, linkLabel) => `
    <div class="dashboard-header">
      <h2 class="dashboard-title">${title}</h2>
      <a class="btn dashboard-open-btn" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${ICON_EXTERNAL} ${linkLabel}</a>
    </div>`;

  const renderDashboard = (item) => {
    const href = item.dashboardUrl ? sanitizeUrl(item.dashboardUrl, false) : '';
    if (!/^https:\/\//i.test(href)) return '';

    let host = '';
    try { host = new URL(href).hostname; } catch { return ''; }
    const canEmbed = EMBED_HOSTS.has(host);

    const fallback = `
      <div class="dashboard-blocked" id="dashboard-fallback"${canEmbed ? ' hidden' : ''}>
        ${ICON_BLOCKED}
        <p>This interactive dashboard opens in its own tab.</p>
        <a class="btn" href="${esc(href)}" target="_blank" rel="noopener noreferrer">Open Dashboard Directly &rarr;</a>
      </div>`;

    const frame = canEmbed ? `
      <iframe src="${esc(toEmbedUrl(href))}" class="dashboard-iframe" id="dashboard-iframe"
        title="Live interactive visualization for ${esc(item.title)}" loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms" allowfullscreen></iframe>` : '';

    return `
      <div class="dashboard-section">
        ${sectionHeader('Live Dashboard', href, 'Open in new tab')}
        <div class="dashboard-iframe-wrap">${fallback}${frame}</div>
      </div>`;
  };

  const renderVideo = (item) => {
    const src = item.videoPath ? sanitizeUrl(item.videoPath, true) : '';
    if (!src) return '';
    const ext = (src.split('?')[0].split('.').pop() || '').toLowerCase();
    const type = VIDEO_TYPES[ext] || 'video/mp4';

    return `
      <div class="project-video-section">
        ${sectionHeader('Project Walkthrough', src, 'View in new tab')}
        <div class="project-video-wrap">
          <video class="project-video-player" controls preload="metadata" playsinline>
            <source src="${esc(src)}" type="${type}">
            <p class="note">Your browser does not support HTML5 video.
              <a href="${esc(src)}" download>Download the video</a> to watch it.</p>
          </video>
        </div>
      </div>`;
  };

  const renderAttachments = (item) => {
    if (!Array.isArray(item.attachments) || !item.attachments.length) return '';
    const paths = item.attachments.map((p) => sanitizeUrl(p, true)).filter(Boolean);
    const images = paths.filter(isImage);
    const docs = paths.filter((p) => !isImage(p));
    if (!images.length && !docs.length) return '';

    const imageGrid = images.length ? `
      <div class="attach-image-grid">
        ${images.map((p) => `
          <figure class="attach-figure">
            <a href="${esc(p)}" target="_blank" rel="noopener noreferrer" class="attach-img-link">
              <img src="${esc(p)}" alt="${esc(baseName(p))}" loading="lazy" decoding="async" class="attach-img">
            </a>
          </figure>`).join('')}
      </div>` : '';

    const docList = docs.length ? `
      <div class="attach-doc-list">
        ${docs.map((p) => {
          const name = baseName(p);
          const ext = (name.split('.').pop() || 'DOC').toUpperCase();
          return `
          <a href="${esc(p)}" target="_blank" rel="noopener noreferrer" class="attach-doc-card" download>
            <span class="attach-doc-ext">${esc(ext)}</span>
            <span class="attach-doc-name">${esc(name)}</span>
            ${ICON_DOWNLOAD}
          </a>`;
        }).join('')}
      </div>` : '';

    return `
      <div class="attach-section">
        <h2 class="attach-section-title">Project Assets &amp; Documentation</h2>
        ${imageGrid}${docList}
      </div>`;
  };

  const setStructuredData = (item, isBlog) => {
    document.getElementById('dynamic-jsonld')?.remove();
    const script = document.createElement('script');
    script.id = 'dynamic-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': isBlog ? 'BlogPosting' : 'CreativeWork',
      headline: item.title,
      description: item.summary,
      datePublished: item.date,
      author: { '@type': 'Person', name: 'Sushmita Sharma' }
    });
    document.head.appendChild(script);
  };

  const render = () => {
    const container = document.getElementById('art');
    if (!container) return;

    const isBlog = document.body.dataset.kind === 'blog';
    const backUrl = isBlog ? 'blog.html' : 'work.html';
    const backLabel = isBlog ? 'All posts' : 'All work';
    const typeLabel = isBlog ? 'Blog' : 'Case study';

    const slug = window.App.qs('slug');
    const item = window.App.all(isBlog ? 'posts' : 'works').find((entry) => entry.slug === slug);

    if (!item) {
      container.innerHTML = `
        <div class="not-found-state">
          <h1>Entry Not Found</h1>
          <p class="lead">The requested ${esc(typeLabel.toLowerCase())} could not be located or may have been renamed.</p>
          <div class="row"><a class="btn" href="${backUrl}">&larr; Return to ${esc(backLabel.toLowerCase())}</a></div>
        </div>`;
      window.App.meta('Page Not Found', 'The requested page was not found.');
      return;
    }

    window.App.meta(item.title, item.summary);
    try { setStructuredData(item, isBlog); } catch { /* SEO extra only */ }

    const subject = encodeURIComponent(`Discussing: ${item.title}`);

    container.innerHTML = `
      <a class="art-back" href="${backUrl}"><span aria-hidden="true">&larr;</span> ${backLabel}</a>
      <p class="meta">${typeLabel} &middot; <time datetime="${esc(item.date)}">${esc(window.App.fd(item.date))}</time></p>
      <h1>${esc(item.title)}</h1>
      ${window.App.chips(item.tags)}
      <div class="art-body">${window.App.md(item.body)}</div>
      ${renderAttachments(item)}
      ${renderVideo(item)}
      ${renderDashboard(item)}
      <div class="art-cta-section">
        <div class="row">
          <a class="btn" href="mailto:sushmitasharma741@gmail.com?subject=${subject}">Discuss this project</a>
          <a class="btn o" href="${backUrl}">Back to ${esc(backLabel.toLowerCase())}</a>
        </div>
      </div>`;

    // Show the fallback if the embed fails to load.
    const frame = document.getElementById('dashboard-iframe');
    const fallback = document.getElementById('dashboard-fallback');
    if (frame && fallback) {
      frame.addEventListener('error', () => { frame.hidden = true; fallback.hidden = false; });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render, { once: true });
  } else {
    render();
  }
})();
