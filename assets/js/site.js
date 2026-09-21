(function () {
  'use strict';

  // Human/Agent audience mode. Both toggles (nav + mobile menu) share one value,
  // persisted in localStorage. Agent swaps the page's own content for a Markdown
  // view of marcus-maute.md. #agent in the URL opens Agent view directly.
  var KEY = 'mm-mode';
  var buttons = document.querySelectorAll('.mode-toggle button[data-mode]');
  var humanView = document.getElementById('human-view');
  var agentView = document.getElementById('agent-view');
  var mdView = document.getElementById('md-view');
  var mdSource = document.getElementById('agent-md');

  function fillMarkdown() {
    if (mdView && mdSource && !mdView.textContent) {
      mdView.textContent = mdSource.textContent.replace(/^\n/, '').replace(/<\\\/script/g, '</script');
    }
  }

  function apply(mode) {
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-mode') === mode));
    });
    if (humanView && agentView) {
      if (mode === 'agent') fillMarkdown();
      humanView.hidden = mode === 'agent';
      agentView.hidden = mode !== 'agent';
    }
  }

  function setMode(mode, opts) {
    opts = opts || {};
    apply(mode);
    try { localStorage.setItem(KEY, mode); } catch (e) {}
    if (opts.scroll) window.scrollTo(0, 0);
  }

  var saved = 'human';
  try { saved = localStorage.getItem(KEY) === 'agent' ? 'agent' : 'human'; } catch (e) {}
  if (location.hash === '#agent') saved = 'agent';
  apply(saved);

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      setMode(b.getAttribute('data-mode'), { scroll: true });
    });
  });
  document.querySelectorAll('[data-mode-switch]').forEach(function (b) {
    b.addEventListener('click', function () {
      setMode(b.getAttribute('data-mode-switch'), { scroll: true });
    });
  });

  // Copy buttons: label -> "Copied" for 2s, resets even if the clipboard is unavailable.
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    var label = btn.textContent;
    btn.addEventListener('click', function () {
      if (btn.getAttribute('data-copy') === '#md-view') fillMarkdown();
      var el = document.querySelector(btn.getAttribute('data-copy'));
      var text = el ? el.textContent.trim() : '';
      var done = function () {
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = label; }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        done();
      }
    });
  });

  window.addEventListener('hashchange', function () {
    if (location.hash === '#agent') setMode('agent', { scroll: true });
  });

  // Mobile menu. Kept as a global so the existing onclick="toggleMenu()" markup keeps working.
  window.toggleMenu = function () {
    var m = document.getElementById('nav-mobile');
    if (m) m.classList.toggle('open');
  };
})();
