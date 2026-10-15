(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* storage blocked */ } },
  };
  const cookie = $('#cookie');
  const settings = $('#cookie-settings');

  let analyticsLoaded = false;
  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    // Analytics slot: insert Yandex.Metrika / GA4 here (and add its host to the CSP in <head>).
    // Runs only after the visitor accepts cookies.
  }
  function applyConsent() { if (store.get('cookie-consent') === 'all') loadAnalytics(); }

  // Moving focus into the banner makes screen readers announce it.
  function show(target) {
    cookie.hidden = false;
    (target || cookie).focus({ preventScroll: true });
  }
  function hide(e) {
    cookie.hidden = true;
    // Return focus only for keyboard users (detail 0), so mouse clicks do not jump the page.
    if (!e || e.detail === 0) settings.focus({ preventScroll: true });
  }
  function choose(v, e) {
    const withdrawn = v === 'necessary' && store.get('cookie-consent') === 'all';
    store.set('cookie-consent', v);
    hide(e);
    if (withdrawn) location.reload(); // drop already-loaded analytics scripts
    else applyConsent();
  }

  $('#cookie-yes').addEventListener('click', (e) => choose('all', e));
  $('#cookie-no').addEventListener('click', (e) => choose('necessary', e));
  settings.addEventListener('click', () => show($('#cookie-yes')));
  cookie.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
  applyConsent();
  if (!store.get('cookie-consent')) setTimeout(show, 1200);
})();
