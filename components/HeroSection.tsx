"use client";

import { motion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="instrument-hero relative min-h-[100dvh] flex items-center overflow-hidden pt-24 pb-12 px-6 md:px-8">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--accent-muted), transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-6"
              style={{
                color: "var(--accent)",
                background: "var(--accent-muted)",
                border: "1px solid var(--accent)",
              }}
            >
              Verifikasi &amp; Validasi Metode Analisis
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.1] mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Kalkulator Valver Spektrofotometer
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl leading-relaxed mb-8 max-w-[65ch]"
              style={{ color: "var(--text-secondary)" }}
            >
              Otomatisasi perhitungan Kurva Kalibrasi, Linearitas, Working Range, Presisi,
              Akurasi, MDL, dan Uji Spike. Akurat, cepat, terpusat.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href="/input"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] shadow-lg"
                style={{
                  background: "var(--accent)",
                  color: "var(--surface)",
                  boxShadow: "0 8px 30px var(--accent-muted)",
                }}
              >
                Get Started
                <ArrowRight size={20} weight="bold" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Real photography of spectrophotometer/lab instrument */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/3] w-full max-w-xl mx-auto rounded-2xl overflow-hidden border"
              style={{ borderColor: "var(--border-default)" }}
            >
              <div className="cinematic-instrument" role="img" aria-label="Ilustrasi spektrofotometer UV-Vis di laboratorium analitik">
                <div className="instrument-light" />
                <div className="instrument-bench" />
                <div className="instrument-body">
                  <div className="instrument-top">
                    <div className="instrument-lens" />
                    <div className="instrument-slot" />
                  </div>
                  <div className="instrument-panel">
                    <div className="instrument-screen">
                      <span>UV-VIS</span>
                      <strong>0.842</strong>
                      <i />
                    </div>
                    <div className="instrument-controls">
                      <i /><i /><i />
                    </div>
                  </div>
                </div>
                <div className="instrument-cuvette">
                  <div className="cuvette-liquid" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
