const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

test('Instrument Glass is permanent across routes without the surface theme selector', () => {
  const layout = readFileSync('app/layout.tsx', 'utf8');
  const calculator = readFileSync('app/calculate/page.tsx', 'utf8');
  assert.match(layout, /instrument-glass/);
  assert.doesNotMatch(calculator, /SurfaceThemeToggle|setGlass|useState\(true\).*glass/);
  assert.match(calculator, /calculator-theme liquid-glass/);
});
