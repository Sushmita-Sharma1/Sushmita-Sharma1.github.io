/**
 * Home page scroll story: 90 dots morph between four chart layouts
 * (noise → clusters → trend line → KPI grid) as the reader scrolls.
 *
 * Performance: dots are positioned with `transform` (compositor-only) instead of
 * left/top, so animating them never triggers layout. Layout coordinates are kept
 * as percentages and converted to pixels whenever the stage is resized.
 */
(function () {
  'use strict';

  const DOT_COUNT = 90;
  const SEED = 11;
  const CLUSTER_COLORS = ['#087a40', '#12b85a', '#8fdcb0'];
  const NOISE_COLOR = '#b8cfc0';
  const PRIMARY_COLOR = '#087a40';

  /** Deterministic pseudo-random generator so the layout is identical on every visit. */
  const createRng = (seed) => () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  /** Build the target [x%, y%, cluster] for every dot in each of the 4 steps. */
  const buildLayouts = () => {
    const random = createRng(SEED);
    const clusterX = [20, 50, 80];
    const layouts = [[], [], [], []];

    for (let i = 0; i < DOT_COUNT; i++) {
      const cluster = i % 10 < 5 ? 0 : i % 10 < 8 ? 1 : 2; // 50% / 30% / 20%
      const progress = i / (DOT_COUNT - 1);

      layouts[0].push([6 + random() * 88, 8 + random() * 78, cluster]);                                  // noise
      layouts[1].push([clusterX[cluster] + (random() - 0.5) * 20, 42 + (random() - 0.5) * 36, cluster]); // grouped causes
      layouts[2].push([6 + progress * 88, 22 + progress * 50 + (random() - 0.5) * 9, 0]);                // downward trend
      layouts[3].push([8 + (i % 15) * 6.1, 18 + Math.floor(i / 15) * 11, 0]);                            // KPI grid
    }
    return layouts;
  };

  const initStory = () => {
    const stage = document.getElementById('stage');
    if (!stage) return;

    stage.querySelectorAll('i').forEach((el) => el.remove());

    const layouts = buildLayouts();
    const dots = [];
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < DOT_COUNT; i++) {
      const dot = document.createElement('i');
      dot.setAttribute('aria-hidden', 'true');
      fragment.appendChild(dot);
      dots.push(dot);
    }

    let step = 0;
    let width = 0;
    let height = 0;

    /** Apply the current step to every dot (position, colour, opacity). */
    const paint = () => {
      const layout = layouts[step];
      for (let i = 0; i < DOT_COUNT; i++) {
        const [x, y, cluster] = layout[i];
        const dot = dots[i];
        dot.style.transform = `translate(${(x * width) / 100}px, ${(y * height) / 100}px)`;
        dot.style.background = step === 0 ? NOISE_COLOR : step === 1 ? CLUSTER_COLORS[cluster] : PRIMARY_COLOR;
        dot.style.opacity = step === 0 || step === 1 ? '0.85' : step === 2 ? '0.95' : '1';
      }
    };

    const measure = () => {
      width = stage.clientWidth;
      height = stage.clientHeight;
    };

    // Place dots at their first position with transitions off, so they don't fly in from (0,0).
    measure();
    paint();
    stage.appendChild(fragment);
    requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.add('ready')));

    if ('ResizeObserver' in window) {
      new ResizeObserver(() => { measure(); paint(); }).observe(stage);
    }

    const chapters = document.querySelectorAll('.ch');
    if (!chapters.length) return;

    if (!('IntersectionObserver' in window)) {
      chapters.forEach((ch) => ch.classList.add('on'));
      step = 3;
      paint();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        chapters.forEach((ch) => ch.classList.remove('on'));
        entry.target.classList.add('on');
        step = Number(entry.target.dataset.i || 0);
        requestAnimationFrame(paint);
      });
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

    chapters.forEach((ch) => observer.observe(ch));
  };

  window.initStory = initStory;
})();
