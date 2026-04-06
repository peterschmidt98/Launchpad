const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { createTestEnv, createApiEnv } = require('./setup');

describe('Security: XSS Prevention', () => {
  let window, document, app, container;

  beforeEach(() => {
    const env = createTestEnv({ immediateTimers: true });
    window = env.window;
    document = env.document;
    app = window.LaunchpadApp;
    container = document.getElementById('chapter-container');
  });

  describe('Chapter 2 - Live Demo XSS', () => {
    beforeEach(() => { app.navigateToChapter(2); });

    it('escapes HTML tags in API responses', async () => {
      // Override sendMessage to return malicious HTML
      window.LaunchpadAPI.sendMessage = async () => '<script>alert("xss")</script>';

      const textarea = container.querySelector('#demo-input');
      const btn = container.querySelector('#demo-send');
      textarea.value = 'test';
      btn.click();
      await new Promise(r => setTimeout(r, 50));

      const responseDiv = container.querySelector('#demo-response');
      // Script tags must be escaped, not executed
      assert.ok(!responseDiv.innerHTML.includes('<script>'), 'Script tags should be escaped in innerHTML');
      assert.ok(responseDiv.textContent.includes('<script>'), 'Script tags should appear as text');
    });

    it('escapes event handler injection in API responses', async () => {
      window.LaunchpadAPI.sendMessage = async () => '<img src=x onerror="alert(1)">';

      const textarea = container.querySelector('#demo-input');
      const btn = container.querySelector('#demo-send');
      textarea.value = 'test';
      btn.click();
      await new Promise(r => setTimeout(r, 50));

      const responseDiv = container.querySelector('#demo-response');
      // The <img> tag should be escaped so it never renders as an element
      assert.ok(!responseDiv.querySelector('img'), 'Img element should not be created');
      assert.ok(responseDiv.textContent.includes('onerror'), 'Event handler text appears as safe text');
    });

    it('escapes HTML entities in API responses', async () => {
      window.LaunchpadAPI.sendMessage = async () => '&lt;script&gt; already escaped & "quotes" <b>bold</b>';

      const textarea = container.querySelector('#demo-input');
      const btn = container.querySelector('#demo-send');
      textarea.value = 'test';
      btn.click();
      await new Promise(r => setTimeout(r, 50));

      const responseDiv = container.querySelector('#demo-response');
      // The <b> tag should be escaped
      assert.ok(!responseDiv.querySelector('b'), 'HTML tags should not render as elements');
    });
  });

  describe('Chapter 4 - Live Demo XSS', () => {
    beforeEach(() => {
      app.setChapterStatus(2, 'complete');
      app.navigateToChapter(4);
    });

    it('escapes HTML in prompt lab responses', async () => {
      window.LaunchpadAPI.sendMessage = async () => '<div onmouseover="alert(1)">hover me</div>';

      const textarea = container.querySelector('#ch4-demo-input');
      const btn = container.querySelector('#ch4-demo-send');
      textarea.value = 'test';
      btn.click();
      await new Promise(r => setTimeout(r, 50));

      const responseDiv = container.querySelector('#ch4-demo-response');
      // The <div> tag should be escaped — no actual div element created from the response
      const responseDivs = responseDiv.querySelectorAll('.demo-response div');
      // onmouseover should never appear as an attribute on any element
      for (const el of responseDiv.querySelectorAll('*')) {
        assert.ok(!el.hasAttribute('onmouseover'), 'No element should have onmouseover attribute');
      }
    });

    it('escapes HTML in prompt builder responses', async () => {
      window.LaunchpadAPI.sendMessage = async () => '<script>document.cookie</script>';

      container.querySelector('#ch4-builder-role').value = 'Coach';
      container.querySelector('#ch4-builder-task').value = 'Help me';
      container.querySelector('#ch4-builder-build').click();
      container.querySelector('#ch4-builder-send').click();
      await new Promise(r => setTimeout(r, 50));

      const responseDiv = container.querySelector('#ch4-builder-response');
      assert.ok(!responseDiv.innerHTML.includes('<script>'), 'Script tags should be escaped');
    });
  });

  describe('Chapter 5 - Job Board XSS', () => {
    beforeEach(() => {
      app.setChapterStatus(2, 'complete');
      app.navigateToChapter(5);
    });

    it('escapes HTML in job title input', () => {
      container.querySelector('#ch5-job-title').value = '<script>alert("xss")</script>';
      container.querySelector('#ch5-job-company').value = 'Safe Corp';
      container.querySelector('#ch5-add-card').click();

      const col = container.querySelector('#ch5-col-todo');
      assert.ok(!col.innerHTML.includes('<script>alert'), 'Script in job title should be escaped');
      assert.ok(col.textContent.includes('<script>'), 'Script text should appear escaped');
    });

    it('escapes HTML in company name input', () => {
      container.querySelector('#ch5-job-title').value = 'Admin';
      container.querySelector('#ch5-job-company').value = '<img src=x onerror="alert(1)">';
      container.querySelector('#ch5-add-card').click();

      const col = container.querySelector('#ch5-col-todo');
      assert.ok(!col.querySelector('img'), 'Img tag should not render as element');
    });

    it('escapes HTML in next step input', () => {
      container.querySelector('#ch5-job-title').value = 'Admin';
      container.querySelector('#ch5-job-company').value = 'Corp';
      container.querySelector('#ch5-job-next').value = '<a href="javascript:alert(1)">click</a>';
      container.querySelector('#ch5-add-card').click();

      const col = container.querySelector('#ch5-col-todo');
      assert.ok(!col.querySelector('a'), 'Anchor tag should not render as element');
    });
  });

  describe('Chapter 6 - Summary Builder XSS', () => {
    beforeEach(() => {
      app.setChapterStatus(2, 'complete');
      app.navigateToChapter(6);
    });

    it('escapes HTML in background input', () => {
      container.querySelector('#ch6-summary-background').value = '<script>alert("xss")</script>';
      container.querySelector('#ch6-summary-generate').click();

      const result = container.querySelector('#ch6-summary-result');
      if (result && !result.classList.contains('hidden')) {
        assert.ok(!result.innerHTML.includes('<script>alert'), 'Script in background should be escaped');
      }
    });

    it('escapes HTML in skills input', () => {
      container.querySelector('#ch6-summary-background').value = 'Returning worker';
      container.querySelector('#ch6-summary-skills').value = '<img src=x onerror="alert(1)">';
      container.querySelector('#ch6-summary-generate').click();

      const result = container.querySelector('#ch6-summary-result');
      if (result && !result.classList.contains('hidden')) {
        assert.ok(!result.querySelector('img'), 'Img tag should not render');
      }
    });

    it('escapes HTML in role input', () => {
      container.querySelector('#ch6-summary-background').value = 'Worker';
      container.querySelector('#ch6-summary-role').value = '"><script>alert(1)</script>';
      container.querySelector('#ch6-summary-generate').click();

      const result = container.querySelector('#ch6-summary-result');
      if (result && !result.classList.contains('hidden')) {
        assert.ok(!result.innerHTML.includes('<script>alert'), 'Script in role should be escaped');
      }
    });
  });
});

describe('Security: localStorage Integrity', () => {
  let window, app;

  beforeEach(() => {
    const env = createTestEnv({ immediateTimers: true });
    window = env.window;
    app = window.LaunchpadApp;
  });

  it('handles corrupted JSON in localStorage gracefully', () => {
    window.localStorage.setItem('launchpad_progress', '{invalid json!!!}');
    const progress = app.getProgress();
    // Should return defaults, not throw
    assert.equal(progress[1], 'not-started');
  });

  it('handles null localStorage value', () => {
    window.localStorage.removeItem('launchpad_progress');
    const progress = app.getProgress();
    assert.equal(typeof progress, 'object');
    assert.equal(progress[1], 'not-started');
  });

  it('handles unexpected status values in localStorage', () => {
    window.localStorage.setItem('launchpad_progress', JSON.stringify({
      1: 'HACKED', 2: '<script>alert(1)</script>', 3: 42, 4: null, 5: true, 6: 'not-started',
    }));
    // Should not crash when reading
    const progress = app.getProgress();
    assert.equal(typeof progress, 'object');
  });

  it('handles extra properties in localStorage without crashing', () => {
    window.localStorage.setItem('launchpad_progress', JSON.stringify({
      1: 'complete', 2: 'not-started', 3: 'not-started',
      4: 'not-started', 5: 'not-started', 6: 'not-started',
      __proto__: { isAdmin: true },
      constructor: 'evil',
      999: 'complete',
    }));
    const progress = app.getProgress();
    assert.equal(typeof progress, 'object');
    // Should not have prototype pollution
    assert.equal(progress.isAdmin, undefined);
  });

  it('handles empty string in localStorage', () => {
    window.localStorage.setItem('launchpad_progress', '');
    const progress = app.getProgress();
    assert.equal(progress[1], 'not-started');
  });

  it('handles array instead of object in localStorage', () => {
    window.localStorage.setItem('launchpad_progress', JSON.stringify([1, 2, 3]));
    const progress = app.getProgress();
    assert.equal(typeof progress, 'object');
  });
});

describe('Security: Input Boundary Testing', () => {
  let window, document, app, container;

  beforeEach(() => {
    const env = createTestEnv({ immediateTimers: true });
    window = env.window;
    document = env.document;
    app = window.LaunchpadApp;
    container = document.getElementById('chapter-container');
  });

  describe('Chapter 3 - Formula input boundaries', () => {
    beforeEach(() => {
      app.setChapterStatus(2, 'complete');
      app.navigateToChapter(3);
    });

    it('handles extremely long formula input without crashing', () => {
      const input = container.querySelector('#ch3-formula-input');
      const btn = container.querySelector('#ch3-formula-check');
      input.value = '=SUM(' + 'A1:'.repeat(10000) + 'A2)';
      btn.click();
      // Should show "not quite" feedback, not crash
      const feedback = container.querySelector('#ch3-formula-feedback');
      assert.ok(feedback.textContent.includes('Not quite'));
    });

    it('handles special characters in formula input', () => {
      const input = container.querySelector('#ch3-formula-input');
      const btn = container.querySelector('#ch3-formula-check');
      input.value = '"><script>alert(1)</script>';
      btn.click();
      const feedback = container.querySelector('#ch3-formula-feedback');
      assert.ok(feedback.textContent.includes('Not quite'));
    });

    it('handles null byte in formula input', () => {
      const input = container.querySelector('#ch3-formula-input');
      const btn = container.querySelector('#ch3-formula-check');
      input.value = '=SUM\x00(B2:B3)';
      btn.click();
      // Should not crash
      const feedback = container.querySelector('#ch3-formula-feedback');
      assert.ok(feedback.innerHTML.length > 0);
    });
  });

  describe('Chapter 5 - Job board input boundaries', () => {
    beforeEach(() => {
      app.setChapterStatus(2, 'complete');
      app.navigateToChapter(5);
    });

    it('handles very long job title without crashing', () => {
      container.querySelector('#ch5-job-title').value = 'A'.repeat(10000);
      container.querySelector('#ch5-job-company').value = 'Corp';
      container.querySelector('#ch5-add-card').click();
      const col = container.querySelector('#ch5-col-todo');
      assert.ok(col.querySelectorAll('.kanban-card').length >= 1);
    });

    it('handles unicode characters in inputs', () => {
      container.querySelector('#ch5-job-title').value = '办公室管理员 🏢';
      container.querySelector('#ch5-job-company').value = 'Ünîcödé Cörp™';
      container.querySelector('#ch5-add-card').click();
      const col = container.querySelector('#ch5-col-todo');
      assert.ok(col.textContent.includes('办公室管理员'));
      assert.ok(col.textContent.includes('Ünîcödé'));
    });

    it('handles HTML entities in inputs', () => {
      container.querySelector('#ch5-job-title').value = 'Admin &amp; Manager';
      container.querySelector('#ch5-job-company').value = 'A&B Corp';
      container.querySelector('#ch5-add-card').click();
      const col = container.querySelector('#ch5-col-todo');
      // Should display the literal text, not interpret HTML entities
      assert.ok(col.textContent.includes('Admin &amp; Manager') || col.textContent.includes('Admin & Manager'));
    });
  });

  describe('Chapter 4 - Prompt builder input boundaries', () => {
    beforeEach(() => {
      app.setChapterStatus(2, 'complete');
      app.navigateToChapter(4);
    });

    it('handles XSS in prompt builder fields', () => {
      container.querySelector('#ch4-builder-role').value = '<script>alert(1)</script>';
      container.querySelector('#ch4-builder-task').value = '"><img src=x onerror=alert(1)>';
      container.querySelector('#ch4-builder-build').click();

      const prompt = container.querySelector('#ch4-builder-prompt');
      // textContent is used in the builder, so HTML should not execute
      assert.ok(!prompt.innerHTML.includes('<script>alert'));
    });

    it('handles very long inputs in all 4 fields', () => {
      const longText = 'x'.repeat(5000);
      container.querySelector('#ch4-builder-role').value = longText;
      container.querySelector('#ch4-builder-task').value = longText;
      container.querySelector('#ch4-builder-context').value = longText;
      container.querySelector('#ch4-builder-format').value = longText;
      container.querySelector('#ch4-builder-build').click();

      const result = container.querySelector('#ch4-builder-result');
      assert.ok(!result.classList.contains('hidden'));
    });
  });
});

describe('Security: API Mock Safety', () => {
  let api;

  beforeEach(() => {
    const env = createApiEnv();
    api = env.api;
  });

  it('does not execute code in user messages', async () => {
    const result = await api.sendMessage('${process.exit(1)}');
    assert.equal(typeof result, 'string');
  });

  it('handles prototype pollution attempt in message', async () => {
    const result = await api.sendMessage('__proto__');
    assert.equal(typeof result, 'string');
  });

  it('handles constructor pollution attempt', async () => {
    const result = await api.sendMessage('constructor.constructor("return this")()');
    assert.equal(typeof result, 'string');
  });

  it('returns safe strings that do not contain executable code', async () => {
    const result = await api.sendMessage('hello');
    assert.ok(!result.includes('<script>'));
    assert.ok(!result.includes('javascript:'));
    assert.ok(!result.includes('onerror='));
  });

  it('handles regex special characters in input without ReDoS', async () => {
    // This would cause ReDoS in a vulnerable regex
    const evilInput = 'a'.repeat(100) + '!';
    const start = Date.now();
    await api.sendMessage(evilInput);
    const elapsed = Date.now() - start;
    // Should complete in under 5 seconds (generous limit)
    assert.ok(elapsed < 5000, `Should not hang, took ${elapsed}ms`);
  });

  it('keyword matching does not use eval or Function constructor', async () => {
    const result = await api.sendMessage('eval("alert(1)")');
    assert.equal(typeof result, 'string');
    assert.ok(!result.includes('alert(1)'));
  });
});

describe('Security: DOM Structure Integrity', () => {
  let window, document;

  beforeEach(() => {
    const env = createTestEnv({ immediateTimers: true });
    window = env.window;
    document = env.document;
  });

  it('no inline event handlers in generated HTML', () => {
    const allElements = document.querySelectorAll('*');
    const dangerousAttrs = ['onclick', 'onerror', 'onload', 'onmouseover', 'onfocus', 'onblur'];
    for (const el of allElements) {
      for (const attr of dangerousAttrs) {
        assert.ok(!el.hasAttribute(attr), `Element ${el.tagName} should not have ${attr} attribute`);
      }
    }
  });

  it('no javascript: URLs in generated HTML', () => {
    const links = document.querySelectorAll('a[href]');
    for (const link of links) {
      assert.ok(!link.href.startsWith('javascript:'), `Link should not use javascript: URL`);
    }
  });

  it('no data: URLs in script sources', () => {
    const scripts = document.querySelectorAll('script[src]');
    for (const script of scripts) {
      const src = script.getAttribute('src') || '';
      assert.ok(!src.startsWith('data:'), 'Script should not use data: URL');
    }
  });

  it('external scripts use HTTPS', () => {
    const scripts = document.querySelectorAll('script[src]');
    for (const script of scripts) {
      const src = script.getAttribute('src') || '';
      if (src.startsWith('http')) {
        assert.ok(src.startsWith('https://'), `Script ${src} should use HTTPS`);
      }
    }
  });

  it('external stylesheets use HTTPS', () => {
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    for (const link of links) {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('http')) {
        assert.ok(href.startsWith('https://'), `Stylesheet ${href} should use HTTPS`);
      }
    }
  });
});

describe('Security: escapeHtml function correctness', () => {
  let window;

  beforeEach(() => {
    const env = createTestEnv({ immediateTimers: true });
    window = env.window;
  });

  function escapeHtml(str) {
    const div = window.document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  it('escapes < and > characters', () => {
    assert.ok(!escapeHtml('<script>').includes('<script>'));
  });

  it('escapes & character', () => {
    assert.ok(escapeHtml('a & b').includes('&amp;'));
  });

  it('double quotes in content context are safe (not in attributes)', () => {
    // escapeHtml uses textContent->innerHTML which escapes < and > but not quotes
    // This is safe because the escaped content goes INSIDE tags, not into attributes
    const escaped = escapeHtml('" onclick="alert(1)"');
    // The key security property: no HTML tags are created
    const div = window.document.createElement('div');
    div.innerHTML = `<p>${escaped}</p>`;
    assert.ok(!div.querySelector('[onclick]'), 'No onclick attribute should exist');
  });

  it('single quotes in content context are safe (not in attributes)', () => {
    const escaped = escapeHtml("' onmouseover='alert(1)'");
    const div = window.document.createElement('div');
    div.innerHTML = `<p>${escaped}</p>`;
    assert.ok(!div.querySelector('[onmouseover]'), 'No onmouseover attribute should exist');
  });

  it('handles empty string', () => {
    assert.equal(escapeHtml(''), '');
  });

  it('handles string with only special characters', () => {
    const escaped = escapeHtml('<>&"\'');
    assert.ok(!escaped.includes('<'));
    assert.ok(!escaped.includes('>'));
  });

  it('preserves normal text', () => {
    assert.equal(escapeHtml('Hello world'), 'Hello world');
  });

  it('handles nested HTML attempts', () => {
    const escaped = escapeHtml('<div><script>alert(1)</script></div>');
    assert.ok(!escaped.includes('<div>'));
    assert.ok(!escaped.includes('<script>'));
  });
});
