import type { CalculationStatus } from "@/lib/calculationStatus";

export interface KalibrasiRow {
  x: string;
  y: string;
  x2?: number;
  y2?: number;
  xy?: number;
}

export interface ReplicateRow {
  abs: string;
  ppm?: string | number;
  dev?: number;
  devsq?: number;
  recovery?: number;
}

export interface SpikeRow extends ReplicateRow {
  recovery?: number;
}

export interface LinearRow {
  x: number;
  y: number;
  yPred: number;
}

export interface Korelasi1Row {
  no: number;
  x: number;
  y: number;
  x2: number;
  y2: number;
  xy: number;
}

export interface Korelasi2Row {
  no: number;
  x: number;
  y: number;
  dx: number;
  dx2: number;
  dy: number;
  dy2: number;
  dxdy: number;
}

export interface CalibrationResult {
  rows: Array<{ x: number; y: number }>;
  n: number;
  sumx: number;
  sumy: number;
  sumx2: number;
  sumy2: number;
  sumxy: number;
  avgx: number;
  avgy: number;
  A: number;
  B: number;
  R1: number;
  R2: number;
  validRows: Array<{ x: number; y: number }>;
  computedRows: Array<{
    x: number;
    y: number;
    x2: number;
    y2: number;
    xy: number;
  }>;
  sumRow: {
    sumx: number;
    sumy: number;
    sumx2: number;
    sumy2: number;
    sumxy: number;
  };
  avgRow: {
    avgx: number;
    avgy: number;
  };
}

export interface KorelasiCara1Result {
  rows: Korelasi1Row[];
  sumRow: {
    sumx: number;
    sumy: number;
    sumx2: number;
    sumy2: number;
    sumxy: number;
  };
  R1: number;
}

export interface KorelasiCara2Result {
  rows: Korelasi2Row[];
  sumRow: {
    sumdx2: number;
    sumdy2: number;
    sumdxdy: number;
  };
  R2: number;
}

export interface LinearTableResult {
  rows: LinearRow[];
}

export interface ReplicateResult {
  vals: number[];
  avg: number;
  devs: (number | null)[];
  devsq: (number | null)[];
  sumsq: number;
  s2: number;
  n: number;
  computedRows: Array<{
    abs: string;
    ppm: number;
    dev: number | null;
    devsq: number | null;
    recovery?: number | null;
  }>;
  avgRow: {
    avg: number;
    sumsq: number;
    avgRecovery?: number;
  };
}

export interface PrecisionResult {
  sdLow: number;
  sdrLow: number;
  cvLow: number;
  cv67Low: number;
  precisionLowOK: boolean;
  statusLow: CalculationStatus;
  sdHigh: number;
  sdrHigh: number;
  cvHigh: number;
  cv67High: number;
  precisionHighOK: boolean;
  statusHigh: CalculationStatus;
}

export interface AccuracyResult {
  status: CalculationStatus;
  accuracy: number;
  isOK: boolean;
}

export interface MDLResult {
  mdlBlanko: number;
  mdlSpike: number;
  loqSpike: number;
  recovery: number;
}

export interface AcceptanceCriteriaItem {
  status: CalculationStatus;
  label: string;
  hasil: string;
  requirement: string;
  isOK: boolean;
}

export interface AcceptanceCriteria {
  workingRange: { pg: number; isOK: boolean; status: CalculationStatus };
  accuracy: { percentAccuracy: number; isOK: boolean };
  lod: {
    mdlBlanko: number;
    mdlSpike: number;
    loqSpike: number;
    recovery: number;
    criteria: {
      spikeLevel1: boolean;
      spikeLevel2: boolean;
      mdlRequirement: boolean;
      snRatio: boolean;
      recovery: boolean;
    };
  };
}

export interface IDFields {
  nama: string;
  nis: string;
  kelas: string;
}