const test = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { loadProjectFile } = require('./helpers/load-project.cjs');

const { EditableTable } = loadProjectFile('components/calculator/EditableTable.tsx', {
  '@phosphor-icons/react': { Plus: () => null, Trash: () => null },
  'motion/react': { motion: { tr: ({ children, className, style }) => React.createElement('tr', { className, style }, children) } },
});

test('shared tables fill their card and retain a scrollable minimum width with unbroken row labels', () => {
  const html = renderToStaticMarkup(React.createElement(EditableTable, {
    data: [{ no: 'Spike 1', ppm: '1.5313' }],
    columns: [{ key: 'no', header: 'No', className: 'w-12' }, { key: 'ppm', header: 'PPM' }],
    onRemoveRow() {},
  }));
  assert.match(html, /<table class="w-full min-w-\[760px\] text-sm"/);
  assert.match(html, /overflow-x-auto/);
  assert.match(html, /<td class="[^"]*whitespace-nowrap[^"]*">Spike 1<\/td>/);
});
