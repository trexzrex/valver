🧪 ValVer - Spectrophotometer Verification & Validation Suite


  Status
  Chemistry
  License
  Love




  ValVer (Validasi & Verifikasi) adalah aplikasi otomatisasi perhitungan dan manajemen pelaporan untuk kalibrasi, verifikasi, serta validasi metode instrumen Spektrofotometer UV-Vis di laboratorium kimia & analisis instrumen.




📌 Daftar Isi


✨ Fitur Utama

🔬 Parameter Analisis & Validasi

🛠️ Arsitektur & Tech Stack

🚀 Panduan Instalasi & Menjalankan

📂 Struktur Proyek

📖 Alur Penggunaan (Workflow)

🤝 Kontribusi

📄 Lisensi



✨ Fitur Utama


📋 Form Metadata Siswa / Praktikan: Registrasi otomatis data identitas praktikan (Nama, NIS/NIM, Kelas/Kelompok, Tanggal, dan Instrumen).

📈 Kurva Kalibrasi & Regresi Linier Otomatis: Menghitung slope ($b$), intercept ($a$), dan koefisien determinasi ($R^2$) secara real-time.

🎯 Parameter ValVer Komprehensif:
Akurasi (Bias / % Recovery)
Presisi (Repeatability & % RSD)
Linieritas (Koefisien Korelasi $r$)
Batas Deteksi (Limit of Detection / LOD)
Batas Kuantitasi (Limit of Quantification / LOQ)
Verifikasi Panjang Gelombang ($\lambda$) & Fotometrik

📊 Visualisasi Interaktif: Plot kurva standar otomatis yang dinamis dan informatif.

🖨️ Ekspor Laporan Cepat: Konversi instan data dan hasil verifikasi ke format tabel/PDF siap cetak untuk laporan praktikum/analisis laboratorium.



🔬 Parameter Analisis & Validasi

Aplikasi ini mengintegrasikan rumus standar analisis kimia instrumen:


Parameter	Rumus / Metrik Acuan	Syarat Keberterimaan (Acceptance)
Linieritas	$y = bx + a$, Koefisien Determinasi ($R^2$)	$R^2 \ge 0.995$ / $r \ge 0.997$
Presisi (Keterulangan)	$%RSD = \frac{SD}{\bar{x}} \times 100%$	$%RSD \le 2%$ (atau Horwitz Value)
Akurasi (Perolehan Kembali)	$%Recovery = \frac{C_{terukur}}{C_{sebenarnya}} \times 100%$	$95% - 105%$ (rentang analitik)
LOD (Limit of Detection)	$LOD = \frac{3.3 \times SD_{blangko}}{b}$	Batas konsentrasi terendah terdeteksi
LOQ (Limit of Quantitation)	$LOQ = \frac{10 \times SD_{blangko}}{b}$	Batas konsentrasi kuantifikasi presisi


🛠️ Arsitektur & Tech Stack

Aplikasi dirancang dengan pendekatan modular dan UI yang modern:



Frontend: Web Modern UI (HTML5, Tailwind CSS / Vanilla CSS, JavaScript / TypeScript / React)

State & Kalkulasi: Dedicated Chemistry Math Logic Engine

Data Persistence: Local Storage / Backend Database API

Export Engine: Formatter & Laporan Generator



🚀 Panduan Instalasi & Menjalankan

Prasyarat


Git terpasang di komputer Anda

Node.js (jika menggunakan environment Node) atau browser modern


Langkah Instalasi


Clone Repository

git clone https://github.com/trexzrex/valver.git
cd valver

Instal Dependensi (jika ada package.json)

npm install

Jalankan Aplikasi

Mode Development:
npm run dev
Mode Standalone (Static HTML/JS): Cukup buka file index.html langsung di browser Anda atau gunakan ekstensi Live Server pada VS Code.



📂 Struktur Proyek

valver/
├── assets/             # Aset gambar, ikon, dan stylesheet
├── src/ / js/          # Source code logic validasi & verifikasi
│   ├── calculations/   # Modul perhitungan statistika & kimia
│   ├── components/     # Komponen UI (form input, tabel, chart)
│   └── utils/          # Helper fungsi formatting & ekspor
├── index.html          # Halaman utama aplikasi
├── README.md           # Dokumentasi proyek
└── package.json        # Dependensi dan script build (opsional)


📖 Alur Penggunaan (Workflow)

flowchart LR
    A[Isi Metadata Siswa] --> B[Input Data Absorbansi & Konsentrasi]
    B --> C[Kalkulasi Otomatis Regresi & Presisi/Akurasi]
    C --> D[Evaluasi Syarat Keberterimaan ValVer]
    D --> E[Cetak / Ekspor Laporan Hasil]


Input Identitas: Masukkan Nama, NIS, dan Kelas pada bagian form metadata.

Input Data Absorbansi: Masukkan deret standar konsentrasi dan nilai absorbansi hasil pengukuran spektrofotometer.

Analisis Hasil: Sistem akan memvalidasi secara otomatis dan menampilkan kurva serta status evaluasi (Memenuhi Syarat / Tidak).

Unduh Laporan: Simpan hasil akhir sebagai bukti pengujian instrumen laboratorium.



🤝 Kontribusi

Kontribusi selalu terbuka untuk pengembangan fitur laboratorium lainnya!



Fork repositori ini

Buat branch fitur baru (git checkout -b fitur/FiturKeren)

Commit perubahan Anda (git commit -m 'Menambahkan fitur kalkulasi baru')

Push ke branch (git push origin fitur/FiturKeren)

Ajukan Pull Request



📄 Lisensi

Didistribusikan di bawah lisensi MIT. Lihat LICENSE untuk informasi selengkapnya.




  Dibuat dengan dedikasi untuk mempermudah praktikum kimia analitik & instrumen. 🔬✨

- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
