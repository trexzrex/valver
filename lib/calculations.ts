import {
  KalibrasiRow,
  ReplicateRow,
  SpikeRow,
  CalibrationResult,
  KorelasiCara1Result,
  KorelasiCara2Result,
  LinearTableResult,
  ReplicateResult,
  PrecisionResult,
  AccuracyResult,
  MDLResult,
  AcceptanceCriteria,
  AcceptanceCriteriaItem,
  LinearRow,
  Korelasi1Row,
  Korelasi2Row,
} from "@/lib/types";

const num = (v: string | number | null | undefined): number => {
  if (v === '' || v === null || v === undefined) return NaN;
  const strVal = typeof v === 'string' ? v.replace(/,/g, '.') : v;
  const parsed = typeof strVal === 'string' ? parseFloat(strVal) : strVal;
  return isNaN(parsed) ? NaN : parsed;
};

export function computeCalibration(kalData: KalibrasiRow[]): CalibrationResult | null {
  const rows = kalData
    .map((r) => ({ x: num(r.x), y: num(r.y) }))
    .filter((r) => !isNaN(r.x) && !isNaN(r.y));
  const n = rows.length;

  if (n < 2) return null;

  const sumx = rows.reduce((a, r) => a + r.x, 0);
  const sumy = rows.reduce((a, r) => a + r.y, 0);
  const sumx2 = rows.reduce((a, r) => a + r.x * r.x, 0);
  const sumy2 = rows.reduce((a, r) => a + r.y * r.y, 0);
  const sumxy = rows.reduce((a, r) => a + r.x * r.y, 0);

  const avgx = sumx / n;
  const avgy = sumy / n;

  const B = (n * sumxy - sumx * sumy) / (n * sumx2 - sumx * sumx);
  const A = avgy - B * avgx;

  const r1num = n * sumxy - sumx * sumy;
  const r1den = Math.sqrt((n * sumx2 - sumx * sumx) * (n * sumy2 - sumy * sumy));
  const R1 = r1num / r1den;

  let sxy = 0, sxx = 0, syy = 0;
  rows.forEach((r) => {
    sxy += (r.x - avgx) * (r.y - avgy);
    sxx += (r.x - avgx) * (r.x - avgx);
    syy += (r.y - avgy) * (r.y - avgy);
  });
  const R2 = sxy / (Math.sqrt(sxx) * Math.sqrt(syy));

  const computedRows = kalData.map((row) => {
    const x = num(row.x);
    const y = num(row.y);
    if (isNaN(x) || isNaN(y)) {
      return { x: NaN, y: NaN, x2: NaN, y2: NaN, xy: NaN };
    }
    return {
      x,
      y,
      x2: x * x,
      y2: y * y,
      xy: x * y,
    };
  });

  return {
    rows,
    n,
    sumx,
    sumy,
    sumx2,
    sumy2,
    sumxy,
    avgx,
    avgy,
    A,
    B,
    R1,
    R2,
    validRows: rows,
    computedRows,
    sumRow: { sumx, sumy, sumx2, sumy2, sumxy },
    avgRow: { avgx, avgy },
  };
}

export function computeKorelasiCara1(calibration: CalibrationResult): KorelasiCara1Result | null {
  if (!calibration || calibration.validRows.length < 2) return null;

  const rows: Korelasi1Row[] = calibration.computedRows.map((r, i) => ({
    no: i + 1,
    x: r.x,
    y: r.y,
    x2: r.x2,
    y2: r.y2,
    xy: r.xy,
  }));

  return {
    rows,
    sumRow: calibration.sumRow,
    R1: calibration.R1,
  };
}

export function computeKorelasiCara2(calibration: CalibrationResult): KorelasiCara2Result | null {
  if (!calibration || calibration.validRows.length < 2) return null;

  const { avgx, avgy } = calibration;
  const rows: Korelasi2Row[] = calibration.computedRows.map((r, i) => {
    const valid = !isNaN(r.x) && !isNaN(r.y);
    const dx = valid ? r.x - avgx : NaN;
    const dy = valid ? r.y - avgy : NaN;
    const dx2 = valid ? dx * dx : NaN;
    const dy2 = valid ? dy * dy : NaN;
    const dxdy = valid ? dx * dy : NaN;

    return {
      no: i + 1,
      x: r.x,
      y: r.y,
      dx,
      dx2,
      dy,
      dy2,
      dxdy,
    };
  });

  const validRows = rows.filter((row) => !isNaN(row.x) && !isNaN(row.y));
  const sumdx2 = validRows.reduce((sum, row) => sum + row.dx2, 0);
  const sumdy2 = validRows.reduce((sum, row) => sum + row.dy2, 0);
  const sumdxdy = validRows.reduce((sum, row) => sum + row.dxdy, 0); 

  const R2 = sumdxdy / (Math.sqrt(sumdx2) * Math.sqrt(sumdy2));

  return {
    rows,
    sumRow: { sumdx2, sumdy2, sumdxdy },
    R2,
  };
}

export function computeLinearTable(calibration: CalibrationResult): LinearTableResult | null {
  if (!calibration || calibration.validRows.length < 2) return null;

  const rows: LinearRow[] = calibration.validRows.map((r) => ({
    x: r.x,
    y: r.y,
    yPred: calibration.A + calibration.B * r.x,
  }));

  return { rows };
}

export function computeReplicateSet(dataArr: ReplicateRow[], spikeNominal?: number): ReplicateResult {
  const vals = dataArr.map((r) => num(r.ppm));
  const valid = vals.filter((v) => !isNaN(v));
  const n = valid.length;

  if (n === 0) {
    const emptyComputedRows = dataArr.map((r) => ({
      abs: r.abs,
      ppm: NaN,
      dev: null,
      devsq: null,
      recovery: null,
    }));
    return {
      vals,
      avg: NaN,
      devs: vals.map(() => null),
      devsq: vals.map(() => null),
      sumsq: 0,
      s2: NaN,
      n: 0,
      computedRows: emptyComputedRows,
      avgRow: { avg: NaN, sumsq: 0 },
    };
  }

  const avg = valid.reduce((a, b) => a + b, 0) / n;

  const devs = vals.map((v) => (isNaN(v) ? null : v - avg));
  const devsq = devs.map((d) => (d === null ? null : d * d));

  const sumsq = devsq.filter((v) => v !== null).reduce((a, b) => a + b, 0);
  const s2 = n > 1 ? sumsq / (n - 1) : NaN;

  const computedRows = dataArr.map((r, i) => {
    const ppm = num(r.ppm);
    const recovery = spikeNominal && !isNaN(ppm) && spikeNominal > 0 ? (ppm / spikeNominal) * 100 : null;
    return {
      abs: r.abs,
      ppm: isNaN(ppm) ? NaN : ppm,
      dev: devs[i],
      devsq: devsq[i],
      recovery,
    };
  });

  return {
    vals,
    avg,
    devs,
    devsq,
    sumsq,
    s2,
    n,
    computedRows,
    avgRow: { avg, sumsq },
  };
}

export function cvHorwitz(ppmConc: number): number {
  const C = ppmConc * 1e-6;
  return Math.pow(2, 1 - 0.5 * Math.log10(C));
}

export function computePrecision(
  lowResult: ReplicateResult,
  highResult: ReplicateResult,
  stdRendah: number,
  stdTinggi: number
): PrecisionResult {
  // Precision Low
  const sdLow = lowResult.s2 && lowResult.n >= 2 ? Math.sqrt(lowResult.s2) : NaN;
  const sdrLow = !isNaN(sdLow) && lowResult.avg !== 0 ? (sdLow * 100) / lowResult.avg : NaN;
  const cvLow = !isNaN(stdRendah) && stdRendah > 0 ? cvHorwitz(stdRendah) : NaN;
  const cv67Low = !isNaN(cvLow) ? 0.67 * cvLow : NaN;
  const precisionLowOK = !isNaN(sdrLow) && !isNaN(cv67Low) && sdrLow < cv67Low;

  // Precision High
  const sdHigh = highResult.s2 && highResult.n >= 2 ? Math.sqrt(highResult.s2) : NaN;
  const sdrHigh = !isNaN(sdHigh) && highResult.avg !== 0 ? (sdHigh * 100) / highResult.avg : NaN;
  const cvHigh = !isNaN(stdTinggi) && stdTinggi > 0 ? cvHorwitz(stdTinggi) : NaN;
  const cv67High = !isNaN(cvHigh) ? 0.67 * cvHigh : NaN;
  const precisionHighOK = !isNaN(sdrHigh) && !isNaN(cv67High) && sdrHigh < cv67High;

  return {
    sdLow,
    sdrLow,
    cvLow,
    cv67Low,
    precisionLowOK,
    sdHigh,
    sdrHigh,
    cvHigh,
    cv67High,
    precisionHighOK,
  };
}

export function computeAccuracy(
  avgConc: number,
  stdConc: number
): AccuracyResult {
  if (stdConc === 0) return { accuracy: NaN, isOK: false };
  const accuracy = (avgConc / stdConc) * 100;
  return { accuracy, isOK: accuracy > 91 && accuracy < 111 };
}

export function computeMDL(
  blankoResult: ReplicateResult,
  spikeResult: ReplicateResult,
  spikeNominal: number
): MDLResult {
  const mdlBlanko = blankoResult.s2 ? 5 * Math.sqrt(blankoResult.s2) : NaN;
  const mdlSpike = spikeResult.s2 ? 2.821 * Math.sqrt(spikeResult.s2) : NaN;
  const loqSpike = mdlSpike * 10;
  const recovery = spikeResult.avg && spikeNominal ? (spikeResult.avg / spikeNominal) * 100 : NaN;
  return { mdlBlanko, mdlSpike, loqSpike, recovery };
}

export function computeAcceptanceCriteria(
  lowResult: ReplicateResult,
  highResult: ReplicateResult,
  blankoResult: ReplicateResult,
  spikeResult: ReplicateResult,
  spikeNominal: number,
  stdRendah: number,
  stdTinggi: number,
  mdlRequirement: number = 0.05
): AcceptanceCriteria {
  const pg = highResult.s2 && lowResult.s2 ? highResult.s2 / lowResult.s2 : NaN;
  const workingRangeOK = !isNaN(pg) && pg < 5.18;

  const accuracyLow = computeAccuracy(lowResult.avg, stdRendah);
  const accuracyHigh = computeAccuracy(highResult.avg, stdTinggi);
  const accuracyOK = accuracyLow.isOK && accuracyHigh.isOK;

  const mdl = computeMDL(blankoResult, spikeResult, spikeNominal);
  const snRatio = spikeResult.avg && spikeResult.s2
    ? spikeResult.avg / Math.sqrt(spikeResult.s2)
    : NaN;

  return {
    workingRange: { pg, isOK: workingRangeOK },
    accuracy: { percentAccuracy: (accuracyLow.accuracy + accuracyHigh.accuracy) / 2, isOK: accuracyOK },
    lod: {
      mdlBlanko: mdl.mdlBlanko,
      mdlSpike: mdl.mdlSpike,
      loqSpike: mdl.loqSpike,
      recovery: mdl.recovery,
      criteria: {
        spikeLevel1: mdl.loqSpike > spikeResult.avg,
        spikeLevel2: mdl.mdlSpike < spikeResult.avg,
        mdlRequirement: mdl.mdlSpike < mdlRequirement,
        snRatio: snRatio > 2.5 && snRatio < 10,
        recovery: mdl.recovery > 85 && mdl.recovery < 115,
      },
    },
  };
}

export function computeAcceptanceCriteriaItems(
  lowResult: ReplicateResult,
  highResult: ReplicateResult,
  blankoResult: ReplicateResult,
  spikeResult: ReplicateResult,
  spikeNominal: number,
  stdRendah: number,
  stdTinggi: number,
  mdlRequirement: number = 0.05
): AcceptanceCriteriaItem[] {
  const pg = highResult.s2 && lowResult.s2 ? highResult.s2 / lowResult.s2 : NaN;
  const mdl = computeMDL(blankoResult, spikeResult, spikeNominal);
  const snRatio = spikeResult.avg && spikeResult.s2
    ? spikeResult.avg / Math.sqrt(spikeResult.s2)
    : NaN;
  const avgSpikeMeasured = spikeResult.avg;
  const LOQ = mdl.loqSpike;
  const MDL = mdl.mdlSpike;
  const avgRec = mdl.recovery;

  return [
    {
      label: '1. Spike level (10 × MDL > spike)',
      hasil: LOQ.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 }),
      requirement: avgSpikeMeasured.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 }),
      isOK: LOQ > avgSpikeMeasured,
    },
    {
      label: '2. Spike level (MDL < spike)',
      hasil: MDL.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 }),
      requirement: avgSpikeMeasured.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 }),
      isOK: MDL < avgSpikeMeasured,
    },
    {
      label: '3. MDL < Requirement',
      hasil: MDL.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 }),
      requirement: mdlRequirement.toLocaleString('id-ID', { minimumFractionDigits: 3, maximumFractionDigits: 3 }),
      isOK: MDL < mdlRequirement,
    },
    {
      label: '4. S/N (rata-rata/SD)',
      hasil: snRatio.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      requirement: '2,5 < S/N < 10',
      isOK: snRatio > 2.5 && snRatio < 10,
    },
    {
      label: '5. Recovery',
      hasil: avgRec.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%',
      requirement: '85% - 115%',
      isOK: avgRec > 85 && avgRec < 115,
    },
  ];
}

export function predictConcentration(absorbance: number, calibration: CalibrationResult): number {
  if (!calibration || calibration.B === 0) return NaN;
  return (absorbance - calibration.A) / calibration.B;
}

export function generateCalibrationCurvePoints(
  calibration: CalibrationResult,
  count: number = 50
): Array<{ x: number; y: number }> {
  if (!calibration || calibration.validRows.length < 2) return [];
  const xs = calibration.validRows.map((r) => r.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const step = (maxX - minX) / (count - 1);
  return Array.from({ length: count }, (_, i) => {
    const x = minX + i * step;
    return { x, y: calibration.A + calibration.B * x };
  });
}