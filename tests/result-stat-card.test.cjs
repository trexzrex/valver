const test = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { loadProjectFile } = require('./helpers/load-project.cjs');

test('result cards preserve labels and values while exposing distinct semantic tones', () => {
  const { ResultStatCard } = loadProjectFile('components/calculator/ResultStatCard.tsx');
  for (const tone of ['measurement', 'result', 'reference', 'accuracy']) {
    const html = renderToStaticMarkup(React.createElement(ResultStatCard, { label: 'SDR (%)', value: '1.400%', tone }));
    assert.ok(html.includes(`data-tone="${tone}"`));
    assert.ok(html.includes('SDR (%)') && html.includes('1.400%'));
    assert.ok(html.includes('result-stat-card'));
    assert.equal(html.includes('truncate'), false);
  }
});
