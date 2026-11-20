import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Valver | Kalkulator Verifikasi & Validasi Spektrofotometer",
  description:
    "Aplikasi web otomatisasi perhitungan Valver (Verifikasi & Validasi) metode analisis spektrofotometer. Kurva Kalibrasi, Linearitas, Working Range, Presisi, Akurasi, MDL, Uji Spike. Akurat, cepat, terpusat.",
  keywords: ["spektrofotometer", "valver", "verifikasi validasi", "kurva kalibrasi", "laboratorium", "kimia analitik"],
  authors: [{ name: "Valver Team" }],
  openGraph: {
    title: "Valver | Kalkulator Verifikasi & Validasi Spektrofotometer",
    description:
      "Otomatisasi perhitungan Valver spektrofotometer untuk laboratorium pendidikan dan industri.",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// Inline script to prevent FOUC. Runs before hydration.
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('valver-theme');
    var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (systemPrefersDark ? 'dark' : 'light');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="instrument-glass min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
