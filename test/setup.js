/**
 * Test setup — creates a jsdom environment that mirrors index.html
 * and loads the app source files in the correct order.
 */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function readSource(filename) {
  return fs.readFileSync(path.join(ROOT, filename), 'utf-8');
}

/**
 * Creates a fresh jsdom environment with all app scripts loaded.
 * Each call gives an isolated window/document so tests don't leak state.
 */
function createTestEnv(options = {}) {
  let htmlSource = readSource('index.html');

  // Strip external scripts (CDN, local src scripts) and inline tailwind config
  // so jsdom doesn't try to load/execute them — we load sources manually via eval
  htmlSource = htmlSource
    .replace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/g, '')
    .replace(/<script>\s*tailwind\.config[\s\S]*?<\/script>/g, '')
    .replace(/<script src="[^"]*\.js"><\/script>/g, '');

  const dom = new JSDOM(htmlSource, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
  });

  const { window } = dom;

  // Stub scrollTo (not implemented in jsdom)
  window.scrollTo = () => {};

  // Stub setTimeout to execute immediately in tests if requested
  if (options.immediateTimers) {
    const origSetTimeout = window.setTimeout;
    window.setTimeout = (fn, _delay) => origSetTimeout(fn, 0);
  }

  // Intercept DOMContentLoaded listeners so we control when init() fires.
  // jsdom fires DOMContentLoaded asynchronously after parsing, which would
  // cause a double-init and reset navigation state between beforeEach and test.
  const dclListeners = [];
  const origAddEventListener = window.document.addEventListener.bind(window.document);
  window.document.addEventListener = function (type, fn, ...rest) {
    if (type === 'DOMContentLoaded') {
      dclListeners.push(fn);
      return;
    }
    return origAddEventListener(type, fn, ...rest);
  };

  // Load source files in dependency order (same as index.html)
  const scripts = [
    'api.js',
    'chapters/chapter1.js',
    'chapters/chapter2.js',
    'chapters/chapter3.js',
    'chapters/chapter4.js',
    'chapters/chapter5.js',
    'chapters/chapter6.js',
    'app.js',
  ];

  for (const script of scripts) {
    const code = readSource(script);
    window.eval(code);
  }

  // Fire captured DOMContentLoaded listeners exactly once
  if (!options.skipInit) {
    for (const fn of dclListeners) {
      fn();
    }
  }

  /**
   * Call this to trigger init() after setting up custom state (e.g. localStorage).
   * Only useful when skipInit: true.
   */
  function triggerInit() {
    for (const fn of dclListeners) {
      fn();
    }
  }

  return { dom, window, document: window.document, triggerInit };
}

/**
 * Creates a minimal env with just api.js loaded (no DOM dependencies).
 */
function createApiEnv() {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost',
    runScripts: 'dangerously',
  });

  const { window } = dom;
  const code = readSource('api.js');
  window.eval(code);

  return { dom, window, api: window.LaunchpadAPI };
}

module.exports = { createTestEnv, createApiEnv, readSource };
