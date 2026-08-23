# VALVER Persistent Memory

## User Requirements

- Referensi utama untuk isi kalkulator dan logika perhitungan adalah `verifikasi-metode-uvvis-5.html`.
- Desain aplikasi tetap desain VALVER sendiri; jangan menyalin desain referensi.
- User boleh menginput manual nilai ppm dan absorbansi pada tabel kalibrasi, working range, limit deteksi/blanko, dan uji spike.
- Jangan mengubah konsep atau rumus perhitungan referensi.
- Setiap perubahan penting harus dicatat dalam folder `.agents/`.

## Struktur Halaman Calculate yang Disepakati

1. Kurva Kalibrasi: tabel ppm, absorbansi, x², y², x·y, sigma, ringkasan regresi, chart.
2. Korelasi: Cara 1 dan Cara 2; kedua tabel harus mempertahankan seluruh baris tabel kalibrasi termasuk baris kosong.
3. Working Range & Validasi: working range rendah dan tinggi, presisi, akurasi; layout harus responsive dan tabel dapat digeser horizontal di mobile.
4. Limit Deteksi/Blanko: tabel blanko, SD Blanko, Estimasi MDL = 5 × SD.
5. Uji Spike: tabel spike, recovery, SD Spike, MDL = 2,821 × SD, LOQ = 10 × MDL.
6. Keberterimaan MDL.

## Perubahan yang Sudah Dikerjakan

- Fixed Phosphor imports: `ChevronDown` → `CaretDown`, `Loader` → `CircleNotch`, warning icon valid.
- Fixed missing type/component imports and separated type imports from `lib/calculations` imports.
- Added `CalibrationResult.rows` and corrected calibration computed-row indexing.
- Removed ID fields Nama/NIS/Kelas from halaman calculate.
- Removed PDF export button from footer area; dipindahkan ke ujung kanan header menggantikan link Halaman Utama.
- PDF export no longer captures an empty hidden div; it captures main content through `contentRef`.
- Sidebar daftar isi (TOCNav) sudah dihilangkan dari halaman calculate, dan desain tabel dibuat agar lebarnya menggunakan penuh layar (full-width).
- Linear table digabung ke area Korelasi/Linearitas.
- Working Range Low dan High digabung dalam satu section responsive.
- Presisi dan Akurasi ditampilkan untuk standar rendah dan tinggi.
- Added/ensured SD Blanko, Estimasi MDL Blanko, SD Spike, MDL Spike, and LOQ Spike.
- ppm pada Working Range, Blanko, dan Spike dibuat editable/manual input.
- Working Range cards dibuat adaptive untuk mobile; tables use horizontal overflow scrolling.
- Fixed paste handler agar meneruskan event clipboard dan menangani decimal koma.
- Fixed array initialization `Array.fill` menjadi `Array.from` agar object tiap baris unik.
- Fixed stale closure pada `useSessionStorage`.
- Improved `SessionCleanup` supaya tidak menghapus data user yang sudah tersimpan.
- Fixed row-jump bug: computed rows harus mempertahankan index asli, termasuk saat baris awal kosong.
- Fixed sigma calculation agar nilai computed columns ikut dijumlahkan dan NaN/blank diperlakukan sebagai 0.
- Sigma harus tersedia untuk semua tabel yang memiliki kolom numerik, termasuk x, y, x², y², x·y, deviasi, kuadrat deviasi, dan kolom korelasi.
- Pada Korelasi, sigma harus berada di baris sigma tabel; card bawah hanya menampilkan nilai R, dipisahkan dari tabel.
- Korelasi Cara 1 dan Cara 2 harus mempunyai jumlah baris/nomor baris sama dengan tabel kalibrasi, termasuk baris kosong; perhitungan R/sigma hanya memakai data valid.

## File Penting

- `app/calculate/page.tsx`
- `components/calculator/KalibrasiTable.tsx`
- `components/calculator/KorelasiSection.tsx`
- `components/calculator/WorkingRangeTable.tsx`
- `components/calculator/BlankoTable.tsx`
- `components/calculator/SpikeTable.tsx`
- `components/calculator/EditableTable.tsx`
- `components/FooterActions.tsx`
- `components/TOCNav.tsx`
- `hooks/useValverCalculations.ts`
- `hooks/useSessionStorage.ts`
- `lib/calculations.ts`
- `lib/types.ts`
- `lib/utils/pasteHandler.ts`
- `.agents/EXECUTION_LOG.md`
- `.agents/SUMMARY.md`
- `.agents/MANUAL_TEST_REPORT.md`
- `.agents/UPDATE_SUMMARY.md`

## Verification Rules

- Always run `npm run build` after code changes.
- Current build has passed successfully; only known non-critical warning is Next.js middleware convention deprecation.
- Do not claim manual browser testing is complete unless it was actually performed.
- Do not alter calculation formulas without comparing against `verifikasi-metode-uvvis-5.html`.
- Avoid adding comments to source files unless explicitly requested.

## Latest Fix

- `lib/calculations.ts`: `computeKorelasiCara2` now maps from `calibration.computedRows` to retain all original rows.
- `components/calculator/EditableTable.tsx`: sigma values sanitize non-finite values to 0 and computed-column sigma is supported.
- `components/calculator/EditableTable.tsx`: Tombol "Tambah Baris" dibuat opsional (hanya dimunculkan bila `onAddRow` disediakan).
- Pada `KorelasiSection.tsx` (tabel Cara 1 dan Cara 2) serta `LinearTable.tsx`, properti `onAddRow` sudah dihapus sehingga tidak ada lagi tombol tambah baris.
- Working Range, Blanko, dan Spike: kolom turunan `x−x̄`, `(x−x̄)²`, dan `% Recovery` sekarang memiliki `getNumericValue`, sehingga baris Sigma menjumlahkan kolom-kolom tersebut, bukan hanya ppm dan absorbansi.
- Perhitungan akurasi Working Range memakai nilai ppm terkecil selain 0 dari kurva kalibrasi untuk standar rendah dan nilai ppm terbesar untuk standar tinggi; input stdRendah/stdTinggi tetap dipakai untuk presisi/CV Horwitz, bukan akurasi.
- `num()` di `lib/calculations.ts` menangani desimal koma Indonesia dengan mengubah koma menjadi titik.
- Card akurasi menampilkan peringatan jika kurva kalibrasi kosong atau kurang dari 2 titik valid.
- Saat kembali ke landing page, `SessionCleanup` menghapus hanya cookie/sessionStorage lokal, tidak menghapus record database.
- Form input identitas: Nama hanya huruf/spasi, NIS tepat 6 digit angka, Kelas huruf/angka/spasi.
- Saat masuk halaman calculate, modal disclaimer wajib tampil. Tombol Setuju menutup modal dan melanjutkan; tombol Batal menuju landing page. Disclaimer menyebut tujuan pembelajaran/developer, batas tanggung jawab, dan link Instagram developer `https://www.instagram.com/athaar.mp?igsi=MTl2NG5saHlkd21wYw==`. Validasi berlaku saat mengetik dan submit; database hanya menerima data valid. `/input` selalu dapat dibuka dan form identitas selalu dikosongkan, sedangkan `/calculate` tetap dilindungi cookie sesi baru.
- Working Range & Validasi: tabel parameter dan card Standar/Akurasi/Presisi lama dihapus. Diganti card `S² Standar Rendah`, `S² Standar Tinggi`, lalu card gabungan `PG`, `F tabel = 5,18`, dan status (`OK` jika PG < 5,18). Rumus perhitungan tidak diubah.
- Card `Perhitungan Presisi` dan `Perhitungan Akurasi` harus tetap ada di Working Range & Validasi; keduanya telah dikembalikan di bawah card PG/F tabel/status.
- Baris Sigma pada footer semua tabel diberi `border-b` cyan agar garis pemisah antara Sigma dan Rata Rata lebih jelas.
- Formatter angka di `lib/utils/numberFormat.ts` memakai notasi ilmiah hanya bila angka memiliki lebih dari 5 nol setelah koma sebelum digit nonzero; angka lain tetap desimal. Formatter berlaku untuk angka biasa, fixed, persen, dan fallback dash.
- Latest `npm run build` passed.
