const test = require('node:test');
const assert = require('node:assert/strict');
const { loadProjectFile } = require('./helpers/load-project.cjs');
const calculations = loadProjectFile('lib/calculations.ts');

async function exportFixture(responseOK = true) {
  const tables = [];
  const images = [];
  let saved = false;
  const calibration = calculations.computeCalibration([{ x: '1', y: '.12' }, { x: '2', y: '.22' }, { x: '3', y: '.32' }]);
  const rows = [{ abs: '.12', ppm: '1' }, { abs: '.122', ppm: '1.02' }, { abs: '', ppm: '' }];
  const result = calculations.computeReplicateSet(rows, 2);
  const previous = { document: global.document, window: global.window, fetch: global.fetch };
  global.document = { querySelector: () => ({}), body: { classList: { remove() {} } } };
  global.window = { setTimeout() {} };
  global.fetch = async () => ({ ok: responseOK, json: async () => ({ identity: { nama: 'Penguji', nis: '123456', kelas: 'XII A' } }) });
  const pdf = new Proxy({ lastAutoTable: { finalY: 40 }, addImage(...args) { images.push(args); }, save() { saved = true; } }, { get(target, key) { return key in target ? target[key] : () => {}; } });
  const { PDFExportButton } = loadProjectFile('components/calculator/PDFExport.tsx', {
    react: { ...require('react'), useState: initial => [initial, () => {}] },
    'motion/react': { motion: { button: 'button' } },
    '@phosphor-icons/react': { CircleNotch: () => null, FileArrowDown: () => null },
    '@/lib/pdfFormula': { renderPdfFormula: async latex => ({ data: latex, width: 400, height: 60 }) },
    jspdf: { jsPDF: function () { return pdf; } },
    'jspdf-autotable': { default: (_pdf, options) => tables.push(options) },
  });
  try {
    const element = PDFExportButton({ calibration, lowResult: result, highResult: result, blankoResult: result, spikeResult: result,
      precision: calculations.computePrecision(result, result, 1, 3), accuracyLow: calculations.computeAccuracy(result.avg, 1), accuracyHigh: calculations.computeAccuracy(result.avg, 3),
      mdl: calculations.computeMDL(result, result, 2), acceptance: calculations.computeAcceptanceCriteria(result, result, result, result, 2, 1, 3, .07),
      stdRendah: '1', stdTinggi: '3', spikeNominal: '2', mdlRequirement: '.07',
      wrLowRows: rows, wrHighRows: rows, blankoRows: rows, spikeRows: rows,
      linearRows: calculations.computeLinearTable(calibration).rows,
    });
    await element.props.children[1].props.onClick();
    return { tables, saved, images };
  } finally { Object.assign(global, previous); }
}

test('PDF exports authenticated identity, references, valid means and calculation steps', async () => {
  const { tables, saved, images } = await exportFixture();
  assert.equal(saved, true);
  const rows = tables.flatMap(table => table.body);
  assert.ok(rows.some(row => row[0] === 'Nama' && row[1] === 'Penguji'));
  assert.ok(rows.some(row => row[0] === 'Batas MDL (ppm)' && row[1] === '0,070000'));
  assert.ok(rows.some(row => row[0] === 'Rata Rata' && row[1] === '0,121000' && row[2] === '1,010000'));
  assert.ok(rows.some(row => row[0] === 'Persamaan' && row[1] === 'y = 0.1x + 0.02'));
  assert.equal(tables.some(table => table.head[0].includes('Substitusi')), false);
  assert.equal(images.length, 22); // Six three-stage blocks, prediction formula and three rows.
  assert.ok(images.some(image => image[0].includes('\\frac')));
  assert.ok(images.every(image => image[2] === 18 && image[4] <= 174 && image[3] + image[5] <= 275));
  assert.equal(JSON.stringify(tables).includes('Σ'), false);
});

test('PDF refuses to download without authenticated report identity', async () => {
  const { saved, tables } = await exportFixture(false);
  assert.equal(saved, false);
  assert.equal(tables.length, 0);
});
