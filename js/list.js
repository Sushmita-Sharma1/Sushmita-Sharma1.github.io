/**
 * Sushmita Sharma Portfolio - Catalogue List Controller
 * Handles list rendering for Work Case Studies (work.html) and Blog Articles (blog.html)
 */

(function () {
  'use strict';

  const renderListPage = () => {
    const gridContainer = document.getElementById('grid');
    if (!gridContainer) return;

    const kind = document.body.dataset.kind || 'work';
    const collectionKey = kind === 'blog' ? 'posts' : 'works';
    const items = window.App ? window.App.all(collectionKey) : [];

    if (items.length === 0) {
      gridContainer.innerHTML = `<p class="note">No ${kind === 'blog' ? 'articles' : 'case studies'} published yet.</p>`;
      return;
    }

    gridContainer.innerHTML = items
      .map((item) => window.App.card(item, kind))
      .join('');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderListPage, { once: true });
  } else {
    renderListPage();
  }
})();
