// Scales a container down (never up) so its full content always fits within
// the viewport, even on TVs/browsers that misreport viewport size or apply
// their own zoom. Never enlarges content, to avoid blurry upscaled text.
(function () {
  function fitToScreen(elementId, options) {
    var el = document.getElementById(elementId);
    if (!el) return;

    var maxScale = (options && options.maxScale) || 1;
    var minScale = (options && options.minScale) || 0.3;
    var padding = options && options.padding;

    function measureAndScale() {
      el.style.transform = 'none';
      var rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // Default padding: 2.5% of the smaller viewport dimension, so scaled
      // content keeps a margin from the screen edges (TVs also tend to crop
      // slightly at the edges via overscan).
      var pad = padding != null ? padding : Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.025);
      var availWidth = window.innerWidth - pad * 2;
      var availHeight = window.innerHeight - pad * 2;
      var scale = Math.min(availWidth / rect.width, availHeight / rect.height, maxScale);
      scale = Math.max(minScale, scale);

      // Fits already (allowing subpixel slack): leave the layout untouched.
      if (scale >= maxScale - 0.005) {
        el.style.transform = 'none';
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        return;
      }

      // Scale from the element's layout origin and translate so the scaled
      // box is centered in the viewport. Scaling around the default center
      // origin leaves content offset when the element is taller than the
      // screen and not flex-centered by its page.
      var targetLeft = (window.innerWidth - rect.width * scale) / 2;
      var targetTop = (window.innerHeight - rect.height * scale) / 2;
      el.style.transformOrigin = 'top left';
      el.style.transform = 'translate(' + (targetLeft - rect.left) + 'px, ' + (targetTop - rect.top) + 'px) scale(' + scale + ')';

      // The unscaled layout still occupies its full height, which would
      // leave a scrollable void below the scaled content.
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }

    // Coalesce bursts of triggers (resize, font/CSS loading, etc.) into a
    // single recompute shortly after. Uses setTimeout rather than
    // requestAnimationFrame because some embedded/TV webviews never fire
    // rAF callbacks while the page isn't actively compositing.
    var debounceTimer = null;
    function apply() {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(measureAndScale, 50);
    }

    measureAndScale();
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);
    window.addEventListener('load', apply);

    // Some TV/embedded webviews report an incorrect viewport size on first
    // paint and never fire a resize event to correct it. Re-check a few
    // times after load as a safety net, independent of any event firing.
    [300, 1000, 2500].forEach(function (delay) {
      setTimeout(measureAndScale, delay);
    });

    // Content can change size after this runs (CDN Tailwind styles landing,
    // web fonts swapping in, async data). Re-fit whenever that happens
    // instead of relying on a single well-timed call.
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(apply);
      ro.observe(el);
    }

    el.__refit = apply;
    return apply;
  }

  window.fitToScreen = fitToScreen;
})();
