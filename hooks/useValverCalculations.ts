"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
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
} from "@/lib/types";
import {
  computeCalibration,
  computeKorelasiCara1,
  computeKorelasiCara2,
  computeLinearTable,
  computeReplicateSet,
  computePrecision,
  computeAccuracy,
  computeMDL,
  computeAcceptanceCriteria,
  computeAcceptanceCriteriaItems,
  predictConcentration,
  generateCalibrationCurvePoints,
} from "@/lib/calculations";
import { useSessionStorage } from "./useSessionStorage";
import { useCalculationDraft } from "./useCalculationDraft";
import type { DraftInputs } from "@/lib/draft";

function num(v: string): number {
  if (v === "" || v === null || v === undefined) return NaN;
  const parsed = parseFloat(v);
  return isNaN(parsed) ? NaN : parsed;
}

export function useValverCalculations() {
  const [kalibrasi, setKalibrasi] = useState<KalibrasiRow[]>(
    Array.from({ length: 12 }, () => ({ x: "", y: "" }))
  );
  const [wrLow, setWrLow] = useState<ReplicateRow[]>(
    Array.from({ length: 10 }, () => ({ abs: "", ppm: "" }))
  );
  const [wrHigh, setWrHigh] = useState<ReplicateRow[]>(
    Array.from({ length: 10 }, () => ({ abs: "", ppm: "" }))
  );
  const [blanko, setBlanko] = useState<ReplicateRow[]>(
    Array.from({ length: 10 }, () => ({ abs: "", ppm: "" }))
  );
  const [spike, setSpike] = useState<SpikeRow[]>(
    Array.from({ length: 10 }, () => ({ abs: "", ppm: "" }))
  );

  const [stdRendah, setStdRendah] = useState<string>("0.2");
  const [stdTinggi, setStdTinggi] = useState<string>("10");
  const [mdlRequirement, setMdlRequirement] = useState<string>("0.05");

  const [idFields, setIdFields] = useSessionStorage<{ nama: string; nis: string; kelas: string }>("valver-id-fields", {
    nama: "",
    nis: "",
    kelas: "",
  });

  const draftInputs = useMemo(() => ({ kalibrasi, wrLow, wrHigh, blanko, spike, stdRendah, stdTinggi, mdlRequirement }), [kalibrasi, wrLow, wrHigh, blanko, spike, stdRendah, stdTinggi, mdlRequirement]);
  const restoreInputs = useCallback((data: DraftInputs) => {
    setKalibrasi(data.kalibrasi);
    setWrLow(data.wrLow);
    setWrHigh(data.wrHigh);
    setBlanko(data.blanko);
    setSpike(data.spike);
    setStdRendah(data.stdRendah);
    setStdTinggi(data.stdTinggi);
    setMdlRequirement(data.mdlRequirement);
  }, []);
  const draft = useCalculationDraft(draftInputs, restoreInputs);

  const calibration = useMemo(() => computeCalibration(kalibrasi), [kalibrasi]);

  const korelasiCara1 = useMemo(() => calibration ? computeKorelasiCara1(calibration) : null, [calibration]);
  const korelasiCara2 = useMemo(() => calibration ? computeKorelasiCara2(calibration) : null, [calibration]);
  const linearTable = useMemo(() => calibration ? computeLinearTable(calibration) : null, [calibration]);

  const lowResult = useMemo(() => computeReplicateSet(wrLow), [wrLow]);
  const highResult = useMemo(() => computeReplicateSet(wrHigh), [wrHigh]);
  const blankoResult = useMemo(() => computeReplicateSet(blanko), [blanko]);
  const spikeNominalValue = useMemo(() => {
    const concentrations = calibration?.validRows
      .map((row) => row.x)
      .filter((value) => Number.isFinite(value) && value > 0)
      .sort((a, b) => a - b) ?? [];
    if (concentrations.length === 0) return NaN;
    const middle = Math.floor(concentrations.length / 2);
    return concentrations.length % 2 === 1
      ? concentrations[middle]
      : (concentrations[middle - 1] + concentrations[middle]) / 2;
  }, [calibration]);

  const effectiveSpikeNominal = Number.isFinite(spikeNominalValue)
    ? String(spikeNominalValue)
    : "";
  const spikeResult = useMemo(() => computeReplicateSet(spike, num(effectiveSpikeNominal)), [spike, effectiveSpikeNominal]);

  const precision = useMemo(
    () => computePrecision(lowResult, highResult, num(stdRendah), num(stdTinggi)),
    [lowResult, highResult, stdRendah, stdTinggi]
  );

  const accuracyLow = useMemo(() => {
    const concentrations = calibration?.validRows.map((row) => row.x).filter((value) => Number.isFinite(value) && value > 0) ?? [];
    const lowestStandard = concentrations.length > 0 ? Math.min(...concentrations) : NaN;
    return computeAccuracy(lowResult.avg, lowestStandard);
  }, [calibration, lowResult]);

  const accuracyHigh = useMemo(() => {
    const concentrations = calibration?.validRows.map((row) => row.x).filter((value) => Number.isFinite(value)) ?? [];
    const highestStandard = concentrations.length > 0 ? Math.max(...concentrations) : NaN;
    return computeAccuracy(highResult.avg, highestStandard);
  }, [calibration, highResult]);

  const mdl = useMemo(
    () => computeMDL(blankoResult, spikeResult, num(effectiveSpikeNominal)),
    [blankoResult, spikeResult, effectiveSpikeNominal]
  );

  const acceptance = useMemo(
    () =>
      computeAcceptanceCriteria(
        lowResult,
        highResult,
        blankoResult,
        spikeResult,
        num(effectiveSpikeNominal),
        num(stdRendah),
        num(stdTinggi),
        num(mdlRequirement)
      ),
    [lowResult, highResult, blankoResult, spikeResult, effectiveSpikeNominal, stdRendah, stdTinggi, mdlRequirement]
  );

  const acceptanceItems = useMemo(
    () =>
      computeAcceptanceCriteriaItems(
        lowResult,
        highResult,
        blankoResult,
        spikeResult,
        num(effectiveSpikeNominal),
        num(stdRendah),
        num(stdTinggi),
        num(mdlRequirement)
      ),
    [lowResult, highResult, blankoResult, spikeResult, effectiveSpikeNominal, stdRendah, stdTinggi, mdlRequirement]
  );

  const curvePoints = useMemo(
    () => (calibration ? generateCalibrationCurvePoints(calibration) : []),
    [calibration]
  );

  const updateKalibrasi = useCallback((index: number, field: "x" | "y", value: string) => {
    setKalibrasi((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const updateWrLow = useCallback((index: number, field: "abs" | "ppm", value: string) => {
    setWrLow((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const updateWrHigh = useCallback((index: number, field: "abs" | "ppm", value: string) => {
    setWrHigh((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const updateBlanko = useCallback((index: number, field: "abs" | "ppm", value: string) => {
    setBlanko((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const updateSpike = useCallback((index: number, field: "abs" | "ppm", value: string) => {
    setSpike((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const updateIdField = useCallback((field: "nama" | "nis" | "kelas", value: string) => {
    setIdFields((prev) => ({ ...prev, [field]: value }));
  }, []);

  const addRow = useCallback((setter: React.Dispatch<React.SetStateAction<ReplicateRow[]>>) => {
    setter((prev) => [...prev, { abs: "", ppm: "" }]);
  }, []);

  const removeRow = useCallback(
    (setter: React.Dispatch<React.SetStateAction<ReplicateRow[]>>, index: number) => {
      setter((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
    },
    []
  );

  const addKalibrasiRow = useCallback(() => {
    setKalibrasi((prev) => [...prev, { x: "", y: "" }]);
  }, []);

  const removeKalibrasiRow = useCallback((index: number) => {
    setKalibrasi((prev) => (prev.length > 2 ? prev.filter((_, i) => i !== index) : prev));
  }, []);

  const predictFromAbsorbance = useCallback(
    (abs: string) => {
      const absorbance = num(abs);
      if (isNaN(absorbance) || !calibration) return NaN;
      return predictConcentration(absorbance, calibration);
    },
    [calibration]
  );

  const resetAll = useCallback(() => {
    setKalibrasi(Array.from({ length: 12 }, () => ({ x: "", y: "" })));
    setWrLow(Array.from({ length: 10 }, () => ({ abs: "", ppm: "" })));
    setWrHigh(Array.from({ length: 10 }, () => ({ abs: "", ppm: "" })));
    setBlanko(Array.from({ length: 10 }, () => ({ abs: "", ppm: "" })));
    setSpike(Array.from({ length: 10 }, () => ({ abs: "", ppm: "" })));
    setStdRendah("0.2");
    setStdTinggi("10");
    setMdlRequirement("0.05");
    setIdFields({ nama: "", nis: "", kelas: "" });
  }, [setIdFields]);

  return {
    draft,
    kalibrasi,
    setKalibrasi,
    wrLow,
    wrHigh,
    blanko,
    spike,
    stdRendah,
    setStdRendah,
    stdTinggi,
    setStdTinggi,
    spikeNominal: effectiveSpikeNominal,
    mdlRequirement,
    setMdlRequirement,
    idFields,
    setIdFields: updateIdField,
    calibration,
    korelasiCara1,
    korelasiCara2,
    linearTable,
    lowResult,
    highResult,
    blankoResult,
    spikeResult,
    precision,
    accuracyLow,
    accuracyHigh,
    mdl,
    acceptance,
    acceptanceItems,
    curvePoints,
    updateKalibrasi,
    updateWrLow,
    updateWrHigh,
    updateBlanko,
    updateSpike,
    addRow,
    removeRow,
    addKalibrasiRow,
    removeKalibrasiRow,
    predictFromAbsorbance,
    setWrLow,
    setWrHigh,
    setBlanko,
    setSpike,
    resetAll,
  };
}