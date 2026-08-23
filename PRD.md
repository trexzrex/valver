# Product Requirements Document (PRD) - Web Verifikasi dan Validasi (Valver) Spektrofotometer

## 1. Informasi Proyek
* **Nama Proyek:** Aplikasi Web Valver (Verifikasi & Validasi) Spektrofotometer
* **Tujuan Utama:** Membangun ulang (redesign) antarmuka kalkulator verifikasi metode analisis spektrofotometer dengan logika perhitungan yang persis sama dengan versi HTML lama, namun dengan desain yang jauh lebih modern, interaktif, responsif, dan memiliki fitur penyimpanan data pengguna (database).

## 2. Rekomendasi Teknologi (Tech Stack)
Untuk memudahkan AI agent bekerja secara terstruktur dan menghasilkan web yang modern, interaktif, dan mudah disambungkan ke database, berikut adalah rekomendasi *tech stack* yang paling ideal:
* **Frontend:** **Next.js (React.js)** 
  * *Alasan:* Sangat populer, AI sangat pintar membuat kode React, performanya cepat, dan mudah memisahkan komponen (UI).
* **Styling & Animasi:** **Tailwind CSS** & **Framer Motion**
  * *Alasan:* Tailwind membuat desain responsif (PC & HP) jadi sangat mudah. Framer Motion digunakan untuk membuat animasi spektrofotometer dan transisi halaman yang mulus.
* **Backend & Database:** **Supabase (PostgreSQL)** atau **Next.js API routes + Prisma + MongoDB**
  * *Alasan:* Supabase sangat cepat diintegrasikan untuk menyimpan data formulir (Nama, NIS, Kelas) tanpa perlu membangun backend dari nol. Alternatifnya, menggunakan Next.js secara *Full-stack* (API menyatu dengan frontend) lebih memudahkan fokus pengembangan.

## 3. Latar Belakang: Spektrofotometer & Valver
*(Bagian ini akan ditampilkan di Halaman Utama / Landing Page)*
* **Spektrofotometer:** Merupakan instrumen analitik yang digunakan untuk mengukur absorbansi suatu sampel cair pada panjang gelombang tertentu. Alat ini menembakkan cahaya ke sampel dan menghitung seberapa banyak cahaya yang diserap, yang kemudian dikonversi menjadi data konsentrasi zat.
* **Valver (Verifikasi dan Validasi):** Sebelum instrumen dan metode analisis digunakan secara rutin, diperlukan proses verifikasi dan validasi untuk memastikan metode tersebut memberikan hasil yang akurat, presisi, dan konsisten. Perhitungan Valver meliputi Kurva Kalibrasi, Linearitas, *Working Range*, Presisi, Akurasi, Limit Deteksi (MDL), dan Uji Spike.

## 4. Tujuan dan Manfaat Web
* **Memudahkan Analis/Siswa:** Mengganti proses perhitungan manual yang rentan *human-error* dengan perhitungan otomatis yang presisi.
* **Sentralisasi Data:** Melacak siapa saja yang telah melakukan pengujian melalui form pendataan (Nama, NIS, Kelas).
* **Efisiensi Waktu:** Semua parameter Valver (dari kalibrasi hingga uji keberterimaan) saling terhubung dan dihitung dalam hitungan detik (otomatis).

## 5. Alur Pengguna (User Flow) & Kebutuhan UI/UX
Pengembangan UI/UX harus memiliki desain yang semenarik mungkin, tidak terlihat kaku, menggunakan komponen *card*, animasi interaktif, dan 100% responsif untuk Mobile dan PC.

### Tahap 1: Landing Page (Halaman Utama)
* **Visual:** Terdapat gambar/ilustrasi instrumen Spektrofotometer yang dianimasikan (misalnya animasi cahaya berpendar atau instrumen melayang perlahan).
* **Konten:** Memuat "Penjelasan Spektro & Valver" serta "Tujuan & Manfaat" web.
* **Aksi:** Tombol pemanggil aksi utama (Call to Action) bertuliskan **"Get Started"**.
* Tombol ini akan mengarahkan pengguna ke halaman Input Data.

### Tahap 2: Pre-Calculation (Halaman Input Data Umum)
* Sebelum melihat tabel perhitungan, pengguna diwajibkan mengisi formulir.
* **Field Data:** 
  1. Nama (Teks)
  2. NIS (Angka/Teks)
  3. Kelas (Teks)
* **Validasi:** Semua *field* bersifat **Wajib (Required)**. Tombol "Lanjut ke Perhitungan" tidak bisa diklik jika data belum terisi penuh.
* **Sistem:** Saat disubmit, data ini langsung **dikirim dan disimpan ke Database**.

### Tahap 3: Calculation Page (Halaman Perhitungan Utama)
* Menampilkan kembali tabel-tabel verifikasi (mengacu pada sistem HTML referensi).
* **Kebutuhan Sistem:** Logika matematika (Sum, Rata-rata, Pangkat, Regresi Linear, Standar Deviasi, dll) **HARUS PERSIS** seperti file HTML referensi.
* **Kebutuhan Desain:** 
  * Desain tabel dibuat lebih modern (misal: gaya *Glassmorphism* atau *Clean Material Design*).
  * Input fields tidak terlihat seperti kotak kaku, melainkan menyatu dengan tabel.
  * *Badge* status (OK / NOT OK) dibuat menonjol dengan warna cerah (Hijau/Merah).
  * Menampilkan grafik (Chart) Kurva Kalibrasi secara dinamis (menggunakan *recharts* atau *chart.js*).

## 6. Struktur Database (Sederhana)
Tabel: `users_analysis`
* `id` (UUID, Primary Key)
* `nama` (String)
* `nis` (String)
* `kelas` (String)
* `created_at` (Timestamp)

## 7. Roadmap & Strategi Instruksi ke AI Agent
Agar pengembangan terfokus dan tidak berantakan, perintahkan AI agent untuk mengerjakan aplikasi dengan fase berikut:

* **Fase 1: Inisialisasi & Frontend Dasar (Landing Page)**
  * *Fokus:* Setup Next.js, Tailwind, dan buat desain Landing Page (Animasi Spektrofotometer, Penjelasan, Tombol Get Started). Jangan pikirkan logika perhitungan dulu.
* **Fase 2: Backend & Database (Form Input)**
  * *Fokus:* Setup database (Supabase/MongoDB). Buat halaman form (Nama, NIS, Kelas) dan pastikan data bisa masuk ke database. Buat proteksi agar halaman perhitungan tidak bisa diakses tanpa mengisi form.
* **Fase 3: Frontend Logika Perhitungan (Kalkulator Valver)**
  * *Fokus:* Terjemahkan seluruh fungsi Javascript dari HTML lama (regresi, presisi, akurasi, MDL) ke dalam state management React. Buat UI tabel yang modern dan responsif.
* **Fase 4: Integrasi Grafik & Finalisasi (PDF Export)**
  * *Fokus:* Tambahkan fitur *Chart* untuk kurva kalibrasi dan fitur unduh PDF (seperti pada HTML lama namun dengan tata letak yang lebih rapi). Uji coba di mode HP dan PC.
