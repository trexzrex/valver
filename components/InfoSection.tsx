"use client";

import { motion } from "motion/react";
import { useState } from "react";
import {
  Flask,
  Target,
  Lightning,
  Database,
  Clock,
  ShieldCheck,
  ChartBar,
  FileText,
} from "@phosphor-icons/react";

const features = [
  {
    icon: Flask,
    title: "Spektrofotometer",
    description:
      "Instrumen analitik yang mengukur absorbansi sampel cair pada panjang gelombang tertentu. Cahaya ditembakkan ke sampel dan dihitung seberapa banyak yang diserap, lalu dikonversi ke data konsentrasi.",
  },
  {
    icon: Target,
    title: "Valver (Verifikasi & Validasi)",
    description:
      "Proses wajib sebelum instrumen dan metode digunakan rutin. Memastikan metode memberikan hasil akurat, presisi, dan konsisten melalui parameter standar internasional.",
  },
  {
    icon: Lightning,
    title: "Perhitungan Otomatis",
    description:
      "Mengganti proses manual yang rentan human-error. Semua parameter dihitung dalam detik, bukan jam.",
  },
  {
    icon: Database,
    title: "Sentralisasi Data",
    description:
      "Setiap pengujian tercatat dengan identitas analis (Nama, NIS, Kelas). Melacak siapa saja yang telah melakukan pengujian untuk audit trail.",
  },
  {
    icon: Clock,
    title: "Efisiensi Waktu",
    description:
      "Parameter Valver saling terhubung dan dihitung secara otomatis end-to-end. Dari input data hingga laporan PDF siap pakai dalam hitungan menit.",
  },
  {
    icon: ShieldCheck,
    title: "Standar Keberterimaan",
    description:
      "Kriteria ketat: Linearitas R di atas 0.995, Presisi CV di bawah 0.67x Horwitz, Akurasi 91-111%, Recovery Spike 85-115%, MDL di bawah Requirement. Status OK/NOT OK otomatis.",
  },
];

const benefits = [
  { label: "Regresi Linear & R squared otomatis", icon: ChartBar },
  { label: "CV Horwitz & Standar Deviasi", icon: Target },
  { label: "MDL & LOQ per standar EPA", icon: Flask },
  { label: "Recovery 85-115% & S/N Ratio", icon: Lightning },
  { label: "Ekspor PDF dengan layout rapi", icon: FileText },
];

export function InfoSection() {
  const [activeFeature, setActiveFeature] = useState(0);
  const stackedFeatures = features.slice(0, 3);

  return (
    <section id="tentang" className="relative py-16 md:py-24 px-6 md:px-8" style={{ background: "var(--surface)" }}>
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 md:mb-16 text-center"
        >
          <p className="mb-3 text-sm font-semibold tracking-[0.18em] uppercase" style={{ color: "var(--accent)" }}>
            Tentang Valver
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl mx-auto"
            style={{ color: "var(--text-primary)" }}
          >
            Mengapa Valver Spektrofotometer?
          </h2>
          <p
            className="mt-4 text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Standarisasi perhitungan analisis spektrofotometer untuk laboratorium pendidikan
            dan industri, menghilangkan kesalahan manual dan mempercepat pengambilan keputusan.
          </p>
        </motion.div>

        {/* Stacked cards: centered, full-width on desktop */}
        <div className="mb-16 md:mb-20">
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>Mengenal alat dan prosesnya</h3>
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>Tekan kartu untuk membuka penjelasan lengkap.</p>
          </div>
          <div className="feature-stack mx-auto" aria-label="Penjelasan utama Valver" style={{ maxWidth: "42rem" }}>
            {stackedFeatures.map((feature, index) => {
              const distance = (index - activeFeature + stackedFeatures.length) % stackedFeatures.length;
              const isActive = index === activeFeature;
              return (
                <motion.button
                  key={feature.title}
                  type="button"
                  className={`stacked-feature-card ${isActive ? "is-active" : ""}`}
                  animate={{
                    y: distance * 72,
                    scale: 1 - distance * 0.045,
                    opacity: distance > 2 ? 0 : 1 - distance * 0.12,
                    zIndex: stackedFeatures.length - distance,
                  }}
                  transition={{ type: "spring", stiffness: 180, damping: 24 }}
                  onClick={() => setActiveFeature((current) => (current + 1) % stackedFeatures.length)}
                  aria-pressed={isActive}
                >
                  <span className="stacked-feature-icon">
                    <feature.icon size={24} weight="bold" />
                  </span>
                  <span className="stacked-feature-copy">
                    <strong>{feature.title}</strong>
                    <span>{isActive ? feature.description : "Pilih kartu untuk melihat penjelasan"}</span>
                  </span>
                  <span className="stacked-feature-index">0{index + 1}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Lab visual + Manfaat utama: symmetric 2-col */}
        <div id="manfaat" className="grid md:grid-cols-2 gap-8 mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden border"
            style={{ borderColor: "var(--border-default)" }}
          >
            <div className="cinematic-lab" role="img" aria-label="Ilustrasi meja laboratorium analitik dengan alat ukur, kuvet, labu, dan grafik absorbansi">
              <div className="lab-glow" />
              <div className="lab-grid" />
              <div className="lab-flask"><i /></div>
              <div className="lab-cuvette"><i /></div>
              <div className="lab-pipette" />
              <div className="lab-chart">
                <span /><span /><span /><span /><span />
              </div>
              <div className="lab-label">ABSORBANCE / 540 nm</div>
            </div>
          </motion.div>

          <div className="flex flex-col justify-center gap-4">
            <div className="mb-2">
              <h3 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>Manfaat utama</h3>
              <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>Ruang kerja analisis yang lebih cepat dan terukur.</p>
            </div>
            {features.slice(3).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="feature-card group flex gap-4 rounded-2xl border p-5"
                style={{
                  background: "var(--surface-muted)",
                  borderColor: "var(--border-default)",
                }}
              >
                <div className="feature-card-icon flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center">
                  <feature.icon size={20} weight="bold" style={{ color: "var(--accent)" }} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                    {feature.title}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Metric cards: symmetric 2-col */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16 md:mb-20"
        >
          <div className="metric-card metric-card-chart rounded-2xl border p-6" style={{ background: "var(--surface-muted)", borderColor: "var(--border-default)" }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Kurva Kalibrasi</p>
                <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>Regresi linear berjalan saat data masuk.</p>
              </div>
              <span className="metric-live" style={{ color: "var(--accent)" }}>LIVE</span>
            </div>
            <div className="mini-chart" aria-hidden="true"><i /><i /><i /><i /><i /><i /><b /></div>
          </div>
          <div className="metric-card rounded-2xl border p-6 flex flex-col justify-center" style={{ background: "var(--accent-muted)", borderColor: "var(--accent)" }}>
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Status Metode</p>
            <strong className="metric-value" style={{ color: "var(--accent)" }}>OK</strong>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Kriteria keberterimaan siap ditinjau.</p>
          </div>
        </motion.div>

        {/* Benefits grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <div className="mb-5 text-center">
            <h3 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>Manfaat dalam satu pandangan</h3>
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>Parameter penting yang membantu menjaga hasil analisis.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 p-4 rounded-xl border"
                style={{
                  background: "var(--surface-muted)",
                  borderColor: "var(--border-default)",
                }}
              >
                <benefit.icon
                  size={20}
                  weight="bold"
                  style={{ color: "var(--accent)" }}
                  className="flex-shrink-0"
                />
                <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  {benefit.label}
                </span>
              </motion.div>
            ))}
            {/* Filler card to keep grid symmetric with 5 items + 1 filler = 6 cells */}
            <div
              className="flex items-center gap-3 p-4 rounded-xl border"
              style={{
                background: "var(--accent-muted)",
                borderColor: "var(--accent)",
              }}
            >
              <ShieldCheck size={20} weight="bold" style={{ color: "var(--accent)" }} className="flex-shrink-0" />
              <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
                Status OK/NOT OK otomatis
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
