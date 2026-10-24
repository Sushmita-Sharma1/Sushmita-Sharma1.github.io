/**
 * Sushmita Sharma Portfolio - Home Page Controller
 * Initializes portfolio grid and interactive scroll story visualization
 */

(function () {
  'use strict';

  const renderFeaturedWorks = () => {
    const gridContainer = document.getElementById('works-grid');
    if (!gridContainer) return;

    const works = window.App ? window.App.all('works') : [];

    if (works.length === 0) {
      gridContainer.innerHTML = '<p class="note">Case studies are loading or currently empty.</p>';
      return;
    }

    gridContainer.innerHTML = works
      .map((work) => window.App.card(work, 'work'))
      .join('');
  };

  const init = () => {
    if (typeof window.initStory === 'function') {
      window.initStory();
    }
    renderFeaturedWorks();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
