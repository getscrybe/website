(function () {
  'use strict';

  var NOTICE_KEY = 'scrybe_mobile_notice_dismissed';

  function track(name, props) {
    try {
      if (window.scrybeTrack) window.scrybeTrack(name, props || {});
    } catch (e) {}
  }

  function sessionGet(key) {
    try { return sessionStorage.getItem(key); } catch (e) { return null; }
  }

  function sessionSet(key, value) {
    try { sessionStorage.setItem(key, value); } catch (e) {}
  }

  function isMobileDevice() {
    var narrow = window.matchMedia('(max-width: 900px)').matches;
    if (!narrow) return false;

    if (navigator.userAgentData && navigator.userAgentData.mobile === true) return true;

    var ua = navigator.userAgent || '';
    var mobileUa = /Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile/i.test(ua);
    var coarse = window.matchMedia('(pointer: coarse)').matches;
    return mobileUa || coarse;
  }

  var isMobile = isMobileDevice();

  function mountMobileNotice(container, options) {
    if (!isMobile || !container) return null;
    if (sessionGet(NOTICE_KEY) === '1') return null;
    if (document.querySelector('.cm-mobile-note')) return document.querySelector('.cm-mobile-note');

    var opts = options || {};
    var note = document.createElement('div');
    note.className = 'cm-mobile-note';
    note.innerHTML =
      '<div class="cm-mobile-note__icon" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
          '<rect x="3" y="4" width="18" height="12" rx="2"></rect>' +
          '<path d="M2 20h20"></path>' +
        '</svg>' +
      '</div>' +
      '<div class="cm-mobile-note__body">' +
        '<div class="cm-mobile-note__title"></div>' +
        '<div class="cm-mobile-note__text"></div>' +
        '<a class="cm-mobile-note__cta"></a>' +
      '</div>' +
      '<button type="button" class="cm-mobile-note__close" aria-label="Dismiss">&times;</button>';

    note.querySelector('.cm-mobile-note__title').textContent =
      opts.title || 'Scrybe is a Chrome extension.';
    note.querySelector('.cm-mobile-note__text').textContent =
      opts.text || 'It only runs on a laptop or desktop. Open getscrybe.net there to use Scrybe inside Google Docs.';

    var cta = note.querySelector('.cm-mobile-note__cta');
    cta.href = opts.ctaHref || '/scan?src=mobile_notice';
    cta.textContent = opts.ctaText || 'Email me the link';
    cta.addEventListener('click', function () {
      track('mobile_desktop_notice_cta', { target: cta.getAttribute('href') });
    });

    note.querySelector('.cm-mobile-note__close').addEventListener('click', function () {
      sessionSet(NOTICE_KEY, '1');
      track('mobile_desktop_notice_dismissed');
      note.remove();
    });

    if (opts.before && opts.before.parentNode === container) {
      container.insertBefore(note, opts.before);
    } else if (opts.position === 'afterbegin') {
      container.insertBefore(note, container.firstChild);
    } else {
      container.appendChild(note);
    }

    track('mobile_desktop_notice_shown', { page: window.location.pathname });
    return note;
  }

  function bindAccountMenu(trigger, menu) {
    if (!trigger || !menu) return;

    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('role', 'menu');
    menu.querySelectorAll('a, button').forEach(function (item) {
      item.setAttribute('role', 'menuitem');
    });

    function closeMenu() {
      menu.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    }

    function openMenu() {
      menu.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }

    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (menu.classList.contains('is-open')) closeMenu();
      else openMenu();
    });

    menu.addEventListener('click', function (event) {
      if (event.target.closest('a, button')) closeMenu();
    });

    document.addEventListener('click', function (event) {
      if (!menu.contains(event.target) && !trigger.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
        trigger.focus();
      }
    });
  }

  function removeToast(toast) {
    toast.classList.remove('is-visible');
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 240);
  }

  function showLogoutConfirm(onConfirm) {
    var existing = document.querySelector('.cm-toast--confirm');
    if (existing) {
      var existingCancel = existing.querySelector('[data-action="cancel"]');
      if (existingCancel) existingCancel.focus();
      return;
    }

    var previousFocus = document.activeElement;
    var toast = document.createElement('div');
    toast.className = 'cm-toast cm-toast--confirm';
    toast.setAttribute('role', 'dialog');
    toast.setAttribute('aria-modal', 'false');
    toast.setAttribute('aria-labelledby', 'cm-logout-title');
    toast.innerHTML =
      '<div class="cm-toast__body">' +
        '<div class="cm-toast__title" id="cm-logout-title">Log out of Scrybe?</div>' +
        '<div class="cm-toast__text">You&rsquo;ll be signed out on the website and in the Chrome extension.</div>' +
      '</div>' +
      '<div class="cm-toast__actions">' +
        '<button type="button" class="cm-toast__btn cm-toast__btn--danger" data-action="confirm">Log out</button>' +
        '<button type="button" class="cm-toast__btn cm-toast__btn--ghost" data-action="cancel">Cancel</button>' +
      '</div>';

    document.body.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add('is-visible'); });

    var confirmBtn = toast.querySelector('[data-action="confirm"]');
    var cancelBtn = toast.querySelector('[data-action="cancel"]');

    function onKey(event) {
      if (event.key === 'Escape') cancel();
    }

    function close(restoreFocus) {
      document.removeEventListener('keydown', onKey);
      removeToast(toast);
      if (restoreFocus && previousFocus && previousFocus.focus) {
        try { previousFocus.focus(); } catch (e) {}
      }
    }

    function cancel() {
      track('logout_cancelled');
      close(true);
    }

    cancelBtn.addEventListener('click', cancel);
    confirmBtn.addEventListener('click', function () {
      confirmBtn.disabled = true;
      cancelBtn.disabled = true;
      Promise.resolve()
        .then(function () { return onConfirm ? onConfirm() : null; })
        .then(function () { close(false); })
        .catch(function (error) {
          confirmBtn.disabled = false;
          cancelBtn.disabled = false;
          track('logout_error', { message: error && error.message ? error.message : String(error) });
        });
    });

    document.addEventListener('keydown', onKey);

    track('logout_confirm_shown');
    setTimeout(function () { cancelBtn.focus(); }, 30);
  }

  function showWelcomeToast(options) {
    var opts = options || {};
    var existing = document.querySelector('.cm-toast--welcome');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'cm-toast cm-toast--welcome';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML =
      '<div class="cm-toast__body">' +
        '<div class="cm-toast__title"></div>' +
        '<div class="cm-toast__text"></div>' +
      '</div>' +
      '<button type="button" class="cm-toast__close" aria-label="Dismiss">&times;</button>';

    toast.querySelector('.cm-toast__title').textContent = opts.title || 'Scrybe is ready.';
    var textEl = toast.querySelector('.cm-toast__text');
    textEl.textContent = opts.text || 'You’re signed in.';

    if (opts.linkHref && opts.linkText) {
      textEl.appendChild(document.createTextNode(' '));
      var link = document.createElement('a');
      link.href = opts.linkHref;
      link.textContent = opts.linkText;
      link.addEventListener('click', function () {
        track('extension_welcome_notice_click', { target: opts.linkHref });
      });
      textEl.appendChild(link);
    }

    document.body.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add('is-visible'); });

    var hideTimer = null;
    function dismiss() {
      if (hideTimer) clearTimeout(hideTimer);
      removeToast(toast);
    }

    toast.querySelector('.cm-toast__close').addEventListener('click', dismiss);

    var delay = typeof opts.autoHide === 'number' ? opts.autoHide : 9000;
    if (delay > 0) hideTimer = setTimeout(dismiss, delay);

    track(opts.event || 'extension_welcome_notice_shown', opts.props || {});
    return toast;
  }

  function useScanLinks(selector, label) {
    if (!isMobile) return;
    document.querySelectorAll(selector).forEach(function (link) {
      link.href = '/scan?src=mobile_cta';
      link.removeAttribute('target');
      link.removeAttribute('rel');
      link.dataset.target = 'scan';
      if (label) link.textContent = label;
    });
  }

  var api = {
    isMobile: isMobile,
    mountMobileNotice: mountMobileNotice,
    bindAccountMenu: bindAccountMenu,
    showLogoutConfirm: showLogoutConfirm,
    showWelcomeToast: showWelcomeToast,
    useScanLinks: useScanLinks
  };

  window.scrybeUI = api;
  window.scrybeIsMobile = isMobile;
  window.scrybeShowLogoutConfirm = showLogoutConfirm;
})();
