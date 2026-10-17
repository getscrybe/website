/* Scrybe analytics — PostHog.
 *
 * Setup (one time):
 *   1. Create a project at https://us.posthog.com (or https://eu.posthog.com).
 *   2. Project settings -> Project API Key -> copy the key (starts with "phc_").
 *   3. Paste it below as POSTHOG_KEY and set POSTHOG_HOST to your region.
 *
 * The project API key is a *public* client key — it is safe to ship in the site.
 * Never put a personal "phx_" key here.
 */
(function () {
  /* ─── Clean URLs ───
     Strip a trailing .html/.htm from the address bar so visitors never see
     getscrybe.net/index.html or /purchase.html. Canonical tags keep search
     engines on the extensionless version. */
  try {
    var p = window.location.pathname;
    if (/\.html?$/i.test(p)) {
      var clean = p.replace(/\/index\.html?$/i, '/').replace(/\.html?$/i, '');
      window.history.replaceState(null, '', clean + window.location.search + window.location.hash);
    }
  } catch (e) {}

  var POSTHOG_KEY  = 'phc_rdKunrFnC9t6eeDkaR6tz7FTtEXw3yPDYpEkF6ZqUMRy';
  var POSTHOG_HOST = 'https://us.i.posthog.com';
  var DISABLED     = /REPLACE_WITH_YOUR_KEY|YOUR_KEY/i.test(POSTHOG_KEY);

  /* ─── Attribution: capture ?src / UTM once and persist it ───
     QR posters use ?src=qr_<poster>. Any UTM_* is also stored so the whole
     funnel (install -> sign in -> checkout) is attributed to the source. */
  var ATTR_KEYS = ['src', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var attribution = {};
  try { attribution = JSON.parse(localStorage.getItem('scrybe_attr') || '{}'); } catch (e) {}
  var attrChanged = false;
  try {
    var params = new URLSearchParams(window.location.search);
    ATTR_KEYS.forEach(function (k) {
      var v = params.get(k);
      if (v) { attribution[k] = v; attrChanged = true; }
    });
    if (!attribution.first_landing) { attribution.first_landing = window.location.pathname; attrChanged = true; }
    if (attrChanged) localStorage.setItem('scrybe_attr', JSON.stringify(attribution));
  } catch (e) {}

  /* Safe no-op tracker. Real tracking is swapped in once PostHog loads. */
  window.scrybeTrack = function () {};
  window.scrybeAttribution = attribution;

  if (DISABLED) {
    console.warn('[Scrybe analytics] PostHog key not set — events are NOT being sent. Edit assets/analytics.js');
    return;
  }

  /* ─── Official PostHog loader ─── */
  !function (t, e) {
    var o, n, p, r;
    e.__SV || (window.posthog = e, e._i = [], e.init = function (i, s, a) {
      function g(t, e) {
        var o = e.split('.');
        2 == o.length && (t = t[o[0]], e = o[1]),
          t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); };
      }
      (p = t.createElement('script')).type = 'text/javascript';
      p.crossOrigin = 'anonymous';
      p.async = !0;
      p.src = s.api_host.replace('.i.posthog.com', '-assets.i.posthog.com') + '/static/array.js';
      (r = t.getElementsByTagName('script')[0]).parentNode.insertBefore(p, r);
      var u = e;
      void 0 !== a ? u = e[a] = [] : a = 'posthog';
      u.people = u.people || [];
      u.toString = function (t) { var e = 'posthog'; return 'posthog' !== a && (e += '.' + a), t || (e += ' (stub)'), e; };
      u.people.toString = function () { return u.toString(1) + '.people (stub)'; };
      o = 'capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId'.split(' ');
      for (n = 0; n < o.length; n++) g(u, o[n]);
      e._i.push([i, s, a]);
    }, e.__SV = 1);
  }(document, window.posthog || []);

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
    persistence: 'localStorage+cookie'
  });

  /* Attach attribution to every event and to the person profile. */
  if (Object.keys(attribution).length) {
    posthog.register(attribution);
  }

  window.scrybeTrack = function (name, props) {
    try {
      posthog.capture(name, Object.assign({}, attribution, props || {}));
    } catch (e) {}
  };

  /* Delegated click tracking: any element with data-evt="event_name" fires.
     Add extra data-* attributes to pass props (e.g. data-location="hero"). */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-evt]');
    if (!el) return;
    var props = {};
    Object.keys(el.dataset).forEach(function (k) {
      if (k !== 'evt') props[k] = el.dataset[k];
    });
    window.scrybeTrack(el.dataset.evt, props);
  });
})();
