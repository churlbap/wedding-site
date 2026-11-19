/* Envelope opening overlay.
   Tap to break the seal, the flap swings open, the overlay fades out.
   Runs once per session so it does not obstruct repeat visits. */

(function () {
  var overlay = document.querySelector('.env-overlay');
  if (!overlay) return;

  var KEY = 'envelopeSeen';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Anyone who asked their phone for less motion skips straight to the site.
  if (reduce.matches) {
    overlay.remove();
    return;
  }

  // Already opened this session: no second showing.
  try {
    if (sessionStorage.getItem(KEY) === '1') {
      overlay.remove();
      return;
    }
  } catch (e) {
    /* private mode can throw; carry on and show it */
  }

  var opened = false;
  var done = false;

  function finish() {
    if (done) return;
    done = true;
    overlay.classList.add('is-done');
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    // take it out of the layer stack once the fade has finished
    window.setTimeout(function () {
      if (overlay.parentNode) overlay.remove();
    }, 950);
  }

  function open() {
    if (opened) return;
    opened = true;
    overlay.classList.add('is-open');
    // let the flap swing and the seal crack before the fade
    window.setTimeout(finish, 1250);
  }

  // A tap or click anywhere opens it.
  overlay.addEventListener('click', open);
  overlay.addEventListener('touchstart', open, { passive: true });

  // Keyboard users get it too.
  overlay.setAttribute('tabindex', '0');
  overlay.setAttribute('role', 'button');
  overlay.setAttribute('aria-label', 'Open the invitation');
  overlay.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });

  // The seal breathes on its own, but it does not open itself: a guest who
  // arrives and walks away should not lose the moment.
  // Escape gets anyone out immediately.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') finish();
  });
})();
