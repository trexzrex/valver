"use client";

import { motion } from "motion/react";
import { ArrowLeft, User, Hash, GraduationCap, CircleNotch, WarningCircle, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function InputPage() {
  const [formData, setFormData] = useState({ nama: "", nis: "", kelas: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const router = useRouter();

  useEffect(() => {
    sessionStorage.removeItem("valver-id-fields");
    queueMicrotask(() => setFormData({ nama: "", nis: "", kelas: "" }));
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nama.trim()) newErrors.nama = "Nama wajib diisi";
    else if (!/^[A-Za-z\u00C0-\u017F ]+$/.test(formData.nama.trim())) newErrors.nama = "Nama hanya boleh berisi huruf dan spasi";
    if (!/^\d{6}$/.test(formData.nis.trim())) newErrors.nis = "NIS wajib terdiri dari tepat 6 digit angka";
    if (!formData.kelas.trim()) newErrors.kelas = "Kelas wajib diisi";
    else if (!/^[A-Za-z0-9 ]+$/.test(formData.kelas.trim())) newErrors.kelas = "Kelas hanya boleh berisi huruf, angka, dan spasi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan data");
      }

      router.push("/calculate");
      router.refresh();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const rawValue = e.target.value;
    const value = name === "nama"
      ? rawValue.replace(/[^A-Za-z\u00C0-\u017F ]/g, "")
      : name === "nis"
        ? rawValue.replace(/\D/g, "").slice(0, 6)
        : rawValue.replace(/[^A-Za-z0-9 ]/g, "");
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (submitError) setSubmitError("");
  };

  const isFormValid = formData.nama.trim() && formData.nis.trim() && formData.kelas.trim();

  return (
    <div className="input-page min-h-[100dvh] py-20 px-6 md:px-8" style={{ background: "var(--surface)" }}>
      <div className="input-atmosphere" aria-hidden="true">
        <span className="input-orbit input-orbit-one" />
        <span className="input-orbit input-orbit-two" />
        <span className="input-beam" />
        <span className="input-grid" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="input-content max-w-2xl mx-auto"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-opacity hover:opacity-80"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft size={18} weight="bold" />
          Kembali ke Beranda
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3" style={{ color: "var(--text-primary)" }}>
            Data Analis
          </h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Isi identitas analis untuk melanjutkan ke perhitungan.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit}
          className="glassmorphism-strong rounded-2xl p-8 space-y-6"
        >
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border rounded-lg text-sm flex items-center gap-2"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                borderColor: "rgba(239, 68, 68, 0.3)",
                color: "#ef4444",
              }}
              role="alert"
            >
              <WarningCircle size={20} weight="bold" className="flex-shrink-0" />
              {submitError}
            </motion.div>
          )}

          {/* Nama */}
          <div className="space-y-2">
            <label htmlFor="nama" className="block text-sm font-medium flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
              <User size={16} weight="bold" style={{ color: "var(--accent)" }} />
              Nama Lengkap
            </label>
            <div className="relative">
              <User size={20} weight="bold" className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2" style={{ color: "var(--text-muted)" }} aria-hidden="true" />
              <input
                type="text"
                id="nama"
                name="nama"
                inputMode="text"
                autoComplete="name"
                maxLength={100}
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                disabled={isSubmitting}
                className="input-with-icon w-full pr-4 py-3 border rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "var(--surface-muted)",
                  borderColor: errors.nama ? "rgba(239, 68, 68, 0.5)" : "var(--border-default)",
                  color: "var(--text-primary)",
                }}
                aria-invalid={errors.nama ? "true" : "false"}
                aria-describedby={errors.nama ? "nama-error" : undefined}
              />
            </div>
            {errors.nama && (
              <motion.p
                id="nama-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm flex items-center gap-1"
                style={{ color: "#ef4444" }}
                role="alert"
              >
                <WarningCircle size={14} weight="bold" />
                {errors.nama}
              </motion.p>
            )}
          </div>

          {/* NIS */}
          <div className="space-y-2">
            <label htmlFor="nis" className="block text-sm font-medium flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
              <Hash size={16} weight="bold" style={{ color: "var(--accent)" }} />
              NIS / Nomor Induk
            </label>
            <div className="relative">
              <Hash size={20} weight="bold" className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2" style={{ color: "var(--text-muted)" }} aria-hidden="true" />
              <input
                type="text"
                id="nis"
                name="nis"
                inputMode="numeric"
                maxLength={6}
                autoComplete="off"
                value={formData.nis}
                onChange={handleChange}
                placeholder="Masukkan NIS / Nomor Induk"
                disabled={isSubmitting}
                className="input-with-icon w-full pr-4 py-3 border rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "var(--surface-muted)",
                  borderColor: errors.nis ? "rgba(239, 68, 68, 0.5)" : "var(--border-default)",
                  color: "var(--text-primary)",
                }}
                aria-invalid={errors.nis ? "true" : "false"}
                aria-describedby={errors.nis ? "nis-error" : undefined}
              />
            </div>
            {errors.nis && (
              <motion.p
                id="nis-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm flex items-center gap-1"
                style={{ color: "#ef4444" }}
                role="alert"
              >
                <WarningCircle size={14} weight="bold" />
                {errors.nis}
              </motion.p>
            )}
          </div>

          {/* Kelas */}
          <div className="space-y-2">
            <label htmlFor="kelas" className="block text-sm font-medium flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
              <GraduationCap size={16} weight="bold" style={{ color: "var(--accent)" }} />
              Kelas / Grup
            </label>
            <div className="relative">
              <GraduationCap size={20} weight="bold" className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2" style={{ color: "var(--text-muted)" }} aria-hidden="true" />
              <input
                type="text"
                id="kelas"
                name="kelas"
                maxLength={50}
                inputMode="text"
                autoComplete="off"
                value={formData.kelas}
                onChange={handleChange}
                placeholder="Contoh: XII IPA 1 / Kelompok 3"
                disabled={isSubmitting}
                className="input-with-icon w-full pr-4 py-3 border rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "var(--surface-muted)",
                  borderColor: errors.kelas ? "rgba(239, 68, 68, 0.5)" : "var(--border-default)",
                  color: "var(--text-primary)",
                }}
                aria-invalid={errors.kelas ? "true" : "false"}
                aria-describedby={errors.kelas ? "kelas-error" : undefined}
              />
            </div>
            {errors.kelas && (
              <motion.p
                id="kelas-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm flex items-center gap-1"
                style={{ color: "#ef4444" }}
                role="alert"
              >
                <WarningCircle size={14} weight="bold" />
                {errors.kelas}
              </motion.p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            whileHover={{ scale: isFormValid && !isSubmitting ? 1.02 : 1 }}
            whileTap={{ scale: isFormValid && !isSubmitting ? 0.98 : 1 }}
            className="w-full py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:cursor-not-allowed"
            style={{
              background: isFormValid && !isSubmitting ? "var(--accent)" : "var(--surface-muted)",
              color: isFormValid && !isSubmitting ? "var(--surface)" : "var(--text-muted)",
              cursor: isFormValid && !isSubmitting ? "pointer" : "not-allowed",
              opacity: isFormValid && !isSubmitting ? 1 : 0.5,
            }}
          >
            {isSubmitting ? (
              <>
                <CircleNotch size={20} weight="bold" className="animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                Lanjut ke Perhitungan
                <ArrowRight size={20} weight="bold" />
              </>
            )}
          </motion.button>

        </motion.form>
      </motion.div>
    </div>
  );
}
