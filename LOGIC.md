# Dokumen Logika & Perhitungan (Valver Spektrofotometer)

Dokumen ini berisi penjelasan logika matematika dan potongan kode sumber (JavaScript) dari aplikasi perhitungan Verifikasi & Validasi (Valver) Spektrofotometer. 
Karena sistem baru akan menggunakan React/Next.js, kode ini dirancang sebagai referensi utama bagi AI Agent untuk menerjemahkan logika *Vanilla JavaScript* menjadi *State Management* React (misalnya menggunakan `useState`, `useMemo`, atau *custom hooks*).

## 1. Struktur Data (State)
Aplikasi membutuhkan 5 state utama berupa *array of objects* untuk menampung baris-baris tabel:
1. `kal` (Kurva Kalibrasi): `[{ x: '', y: '' }, ...]`
2. `wrLow` (Working Range Standar Rendah): `[{ abs: '', ppm: '' }, ...]`
3. `wrHigh` (Working Range Standar Tinggi): `[{ abs: '', ppm: '' }, ...]`
4. `blanko` (Limit Deteksi/Blanko): `[{ abs: '', ppm: '' }, ...]`
5. `spike` (Uji Spike): `[{ abs: '', ppm: '' }, ...]`

*Catatan: Variabel `x` melambangkan konsentrasi (ppm) dan `y` melambangkan Absorban pada tabel kalibrasi.*

## 2. Fungsi Pembantu (Helpers)
Pastikan semua nilai teks (string) dari input diubah ke angka (float) sebelum dihitung, dan tangani nilai `NaN`.

```javascript
const num = v => (v === '' || v === null || v === undefined || isNaN(v)) ? NaN : parseFloat(v);
```

## 3. Logika Inti 1: Regresi Linear & Kurva Kalibrasi
Fungsi ini menghitung Persamaan Garis ($y = Bx + A$) dan Koefisien Korelasi ($R$).

```javascript
function computeCalibration(kalData) {
  // Filter baris yang valid (x dan y berupa angka)
  const rows = kalData.map(r => ({ x: num(r.x), y: num(r.y) })).filter(r => !isNaN(r.x) && !isNaN(r.y));
  const n = rows.length;
  
  if (n < 2) return null; // Butuh minimal 2 titik

  const sumx = rows.reduce((a, r) => a + r.x, 0);
  const sumy = rows.reduce((a, r) => a + r.y, 0);
  const sumx2 = rows.reduce((a, r) => a + (r.x * r.x), 0);
  const sumy2 = rows.reduce((a, r) => a + (r.y * r.y), 0);
  const sumxy = rows.reduce((a, r) => a + (r.x * r.y), 0);
  
  const avgx = sumx / n;
  const avgy = sumy / n;

  // Slope (B) dan Intercept (A)
  const B = (n * sumxy - sumx * sumy) / (n * sumx2 - sumx * sumx);
  const A = avgy - B * avgx;

  // Korelasi (R) Cara 1
  const r1num = n * sumxy - sumx * sumy;
  const r1den = Math.sqrt((n * sumx2 - sumx * sumx) * (n * sumy2 - sumy * sumy));
  const R1 = r1num / r1den;

  // Korelasi (R) Cara 2
  let sxy = 0, sxx = 0, syy = 0;
  rows.forEach(r => {
    sxy += (r.x - avgx) * (r.y - avgy);
    sxx += (r.x - avgx) * (r.x - avgx);
    syy += (r.y - avgy) * (r.y - avgy);
  });
  const R2 = sxy / (Math.sqrt(sxx) * Math.sqrt(syy));

  return { n, sumx, sumy, sumx2, sumy2, sumxy, avgx, avgy, A, B, R1, R2 };
}
```

## 4. Logika Inti 2: Pengulangan (Replicate Data)
Fungsi ini digunakan secara berulang untuk tabel *Working Range*, *Blanko*, dan *Spike* untuk mencari Standar Deviasi (SD) dan Varian ($S^2$).

```javascript
function computeReplicateSet(dataArr) {
  // Ekstrak nilai ppm
  const vals = dataArr.map(r => num(r.ppm));
  const valid = vals.filter(v => !isNaN(v));
  const n = valid.length;
  
  if (n === 0) return { avg: NaN, s2: NaN, n: 0 };

  const avg = valid.reduce((a, b) => a + b, 0) / n;
  
  // Hitung deviasi dan kuadrat deviasi
  const devs = vals.map(v => isNaN(v) ? NaN : v - avg);
  const devsq = devs.map(d => isNaN(d) ? NaN : d * d);
  
  const sumsq = devsq.filter(v => !isNaN(v)).reduce((a, b) => a + b, 0);
  
  // Varian (S^2) -> n-1 (Sample Variance)
  const s2 = n > 1 ? sumsq / (n - 1) : NaN;
  
  return { vals, avg, devs, devsq, sumsq, s2, n };
}
```

## 5. Logika Inti 3: Presisi & CV Horwitz
Perhitungan Coefficient of Variation (CV) Horwitz sangat penting untuk uji presisi.

```javascript
function cvHorwitz(ppmConc) {
  // Konversi ppm ke fraksi (1 ppm = 10^-6)
  const C = ppmConc * 1e-6;
  return Math.pow(2, 1 - 0.5 * Math.log10(C));
}

// Implementasi Presisi:
// const stdRendah = ... (input nilai standar rendah, misal 0.2)
// const sdrRendah = (Math.sqrt(low.s2) * 100) / low.avg;
// const cvLow = cvHorwitz(stdRendah);
// const cv67Low = 0.67 * cvLow;
// const isPresisiOK = sdrRendah < cv67Low;
```

## 6. Logika Inti 4: Kriteria Uji Keberterimaan (Acceptance Criteria)
Berikut adalah rumus-rumus untuk menyelesaikan seluruh panel "Status (OK / NOT OK)" pada aplikasi.

### A. Working Range
* **PG (Perbandingan Varian):** `PG = S2_tinggi / S2_rendah`
* **Status Range:** OK jika `PG < 5.18` *(Asumsi F tabel 99%; df=11,9)*

### B. Akurasi
* **Persen Akurasi:** `(Rata-rata Konsentrasi / Konsentrasi Standar) * 100`
* **Status:** OK jika `91 < Akurasi < 111`

### C. LOD (Limit Deteksi) & Uji Spike
* **Est. MDL (Blanko):** `5 * SD_Blanko`
* **MDL (Spike):** `2.821 * SD_Spike` *(Nilai t-student, asumsi df=9)*
* **LOQ (Spike):** `10 * MDL_Spike`
* **Recovery (Spike):** `(Rata-rata Konsentrasi Spike / Konsentrasi Spike Nominal) * 100`

### D. Uji Keberterimaan MDL (Tabel Akhir)
1. **Spike Level (10x MDL > Spike):** `LOQ > Rata-rata Spike yang terukur`
2. **Spike Level (MDL < Spike):** `MDL_Spike < Rata-rata Spike yang terukur`
3. **MDL < Requirement:** `MDL_Spike < Target Requirement (contoh: 0.05)`
4. **S/N Ratio:** `2.5 < (Rata-rata Spike terukur / SD_Spike) < 10`
5. **Recovery:** `85% < Rata-rata Recovery < 115%`

---
*Instruksi untuk AI Agent: Gunakan logika matematika di atas untuk direplikasi di React. Gunakan `useMemo` agar setiap perubahan input pada form langsung merender ulang hasil secara instan (Reactivity) tanpa mengorbankan performa.*
