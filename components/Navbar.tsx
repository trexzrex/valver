"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Flask, List, X } from "@phosphor-icons/react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{
        background: "color-mix(in srgb, var(--surface) 80%, transparent)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <nav
        className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
          style={{ color: "var(--text-primary)" }}
          aria-label="Valver Home"
        >
          <span className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-hover))" }}
          >
            <Flask size={18} weight="fill" className="text-white" />
          </span>
          <span className="hidden sm:block">Valver</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#tentang"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
          >
            Tentang
          </Link>
          <Link
            href="#manfaat"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
          >
            Manfaat
          </Link>
          <Link
            href="/input"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
          >
            Mulai
          </Link>
          <ThemeToggle />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center justify-center w-9 h-9 rounded-lg border"
            style={{
              borderColor: "var(--border-default)",
              color: "var(--text-secondary)",
            }}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t"
            style={{
              borderColor: "var(--border-subtle)",
              background: "var(--surface)",
            }}
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              <Link
                href="#tentang"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium py-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Tentang
              </Link>
              <Link
                href="#manfaat"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium py-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Manfaat
              </Link>
              <Link
                href="/input"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium py-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Mulai
              </Link>
            </div>
          </motion.div>
        )}
    </motion.header>
  );
}
