const test = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { loadProjectFile } = require('./helpers/load-project.cjs');

test('surface themes expose an accessible mutually exclusive selection', () => {
  const { SurfaceThemeToggle } = loadProjectFile('components/calculator/SurfaceThemeToggle.tsx');
  for (const glass of [true, false]) {
    const html = renderToStaticMarkup(React.createElement(SurfaceThemeToggle, { glass, onChange() {} }));
    assert.match(html, /role="group" aria-label="Tema permukaan kalkulator"/);
    assert.equal((html.match(/aria-pressed="true"/g) || []).length, 1);
    assert.match(html, glass ? /aria-pressed="true"[^>]*>Liquid glass/ : /aria-pressed="true"[^>]*>Standar/);
  }
});
