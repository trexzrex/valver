"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { nextNavigationHidden } from "@/lib/navigationScroll";
import { Flask, List, X } from "@phosphor-icons/react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let hidden = false;
    let anchor = Math.max(0, window.scrollY);
    let frame = 0;
    const update = () => {
      frame = 0;
      const locked = menuOpen || !!headerRef.current?.contains(document.activeElement);
      const next = nextNavigationHidden(hidden, anchor, Math.max(0, window.scrollY), locked);
      hidden = next.hidden;
      anchor = next.anchor;
      document.documentElement.dataset.navigationHidden = String(hidden);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    headerRef.current?.addEventListener("focusin", schedule);
    update();
    const header = headerRef.current;
    return () => {
      window.removeEventListener("scroll", schedule);
      header?.removeEventListener("focusin", schedule);
      cancelAnimationFrame(frame);
      delete document.documentElement.dataset.navigationHidden;
    };
  }, [menuOpen]);

  return (
    <header ref={headerRef}
      className="site-navigation fixed top-3 left-3 right-3 z-50 rounded-2xl border"
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
            href="/#tentang"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
          >
            Tentang
          </Link>
          <Link
            href="/#manfaat"
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
                href="/#tentang"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium py-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Tentang
              </Link>
              <Link
                href="/#manfaat"
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
    </header>
  );
}
