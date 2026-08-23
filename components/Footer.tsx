"use client";

import Link from "next/link";
import { Flask } from "@phosphor-icons/react";

export function Footer() {
  return (
    <footer
      className="px-6 md:px-8 py-8 border-t"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border-subtle)",
        boxShadow: "0 -12px 40px rgba(34, 211, 238, 0.08), 0 -4px 12px rgba(0, 0, 0, 0.12)",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-hover))" }}
          >
            <Flask size={18} weight="fill" className="text-white" />
          </span>
          Valver
        </Link>

        <nav className="flex items-center gap-6" aria-label="Footer navigation">
          <Link
            href="/input"
            className="text-sm transition-colors hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
          >
            Mulai
          </Link>
          <Link
            href="#tentang"
            className="text-sm transition-colors hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
          >
            Tentang
          </Link>
        </nav>

        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Dibuat oleh Athar. <a href="https://www.instagram.com/athaar.mp" target="_blank" rel="noreferrer" className="underline underline-offset-4 transition-opacity hover:opacity-80" style={{ color: "var(--accent)" }}>Instagram @athaar.mp</a>
        </p>
      </div>
    </footer>
  );
}
