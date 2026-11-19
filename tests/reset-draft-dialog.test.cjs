const test = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { loadProjectFile } = require('./helpers/load-project.cjs');
const { ResetDraftDialog } = loadProjectFile('components/calculator/ResetDraftDialog.tsx', {
  // Decorative icon only; its package CJS entry is incompatible with this Node test loader.
  '@phosphor-icons/react': { Trash: () => null },
});

test('reset confirmation has a labelled modal, consequence text and explicit actions', () => {
  const html = renderToStaticMarkup(React.createElement(ResetDraftDialog, { draft: {
    clearRequested: false, cancelClear() {}, confirmClear() {},
  } }));
  assert.match(html, /<dialog/);
  assert.match(html, /aria-modal="true"/);
  assert.match(html, /aria-labelledby=/);
  assert.match(html, /aria-describedby=/);
  assert.match(html, /Mulai perhitungan baru\?/);
  assert.match(html, /Tindakan ini tidak dapat dibatalkan/);
  assert.match(html, />Batal<\/button>/);
  assert.match(html, /Hapus &amp; mulai baru/);
  assert.doesNotMatch(html, /<dialog[^>]* open/);
});
