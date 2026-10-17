/* Shared behaviour for Scrybe SEO/AEO pages. */
(function () {
  /* FAQ accordions are native <details>, so nothing to wire for open/close.
     Track when a FAQ item is opened so we can see what people care about. */
  document.querySelectorAll('.faq details').forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open && window.scrybeTrack) {
        window.scrybeTrack('faq_open', { question: (d.querySelector('summary') || {}).textContent || '' });
      }
    });
  });

  /* Scroll depth milestones (25/50/75/100%) for long-form pages. */
  var marks = [25, 50, 75, 100], hit = {};
  window.addEventListener('scroll', function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (h <= 0) return;
    var pct = Math.round((window.scrollY / h) * 100);
    marks.forEach(function (m) {
      if (pct >= m && !hit[m]) { hit[m] = 1; if (window.scrybeTrack) window.scrybeTrack('scroll_depth', { percent: m }); }
    });
  }, { passive: true });
})();
