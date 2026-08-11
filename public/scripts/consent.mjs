/**
 * Consent manager — pure vanilla JS, no deps.
 * State: 'granted' | 'denied' | null (null = undecided → banner shows).
 */
(function () {
  var KEY = 'image-tools-consent';
  var listeners = [];

  function read() {
    try {
      var v = window.localStorage.getItem(KEY);
      return v === 'granted' || v === 'denied' ? v : null;
    } catch (_) {
      return null;
    }
  }

  function write(state) {
    try {
      window.localStorage.setItem(KEY, state);
    } catch (_) {}
  }

  function set(state) {
    var prev = read();
    if (prev === state) return;
    write(state);
    for (var i = 0; i < listeners.length; i++) listeners[i](state);
    updateDom();
  }

  function toggle() {
    set(read() === 'granted' ? 'denied' : 'granted');
  }

  var LABEL_ON = 'الموافقة على ملفات تعريف الارتباط مفعّلة';
  var LABEL_OFF = 'الموافقة على ملفات تعريف الارتباط معطّلة';

  function updateDom() {
    var state = read();
    document.querySelectorAll('[data-consent-toggle]').forEach(function (btn) {
      var on = state === 'granted';
      btn.setAttribute('data-consent-state', state || 'unknown');
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    document.querySelectorAll('[data-consent-label]').forEach(function (el) {
      el.textContent = state === 'granted' ? LABEL_ON : LABEL_OFF;
    });
    document.querySelectorAll('[data-consent-banner]').forEach(function (banner) {
      var debug = banner.hasAttribute('data-consent-debug');
      banner.hidden = state !== null && !debug;
    });
    document.dispatchEvent(new CustomEvent('consent:change', { detail: state }));
  }

  window.imageTools = window.imageTools || {};
  window.imageTools.consent = {
    get state() {
      return read();
    },
    subscribe: function (fn) {
      listeners.push(fn);
      fn(read());
      return function () {
        listeners = listeners.filter(function (l) { return l !== fn; });
      };
    },
    accept: function () { set('granted'); },
    deny: function () { set('denied'); },
    toggle: toggle,
  };

  // Wire toggles + banner buttons after DOM is ready.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { window.imageTools.consent.toggle && document.dispatchEvent(new Event('image-tools:consent-ready')); wire(); });
  } else {
    wire();
  }

  function wire() {
    var consent = window.imageTools.consent;
    document.querySelectorAll('[data-consent-toggle]').forEach(function (btn) {
      btn.addEventListener('click', consent.toggle);
    });
    document.querySelectorAll('[data-consent-accept]').forEach(function (btn) {
      btn.addEventListener('click', consent.accept);
    });
    document.querySelectorAll('[data-consent-deny]').forEach(function (btn) {
      btn.addEventListener('click', consent.deny);
    });
    updateDom();
  }
})();
