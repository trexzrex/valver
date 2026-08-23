Semua request perbaikan dan fitur sudah saya selesaikan:

1. ✅ **ID Fields Dihilangkan**: `IDFieldsComponent` sudah saya hapus dari render di halaman `calculate/page.tsx`.
2. ✅ **Tombol PDF & Reset**: Tombol "Ekspor PDF" sudah saya hapus dari footer (sekarang berada di tempat sebelumnya), dan tombol "Reset Data" sudah saya naikkan ke atas tabel di dalam Main Content.
3. ✅ **Tabel Scrollable**: Tabel-tabel di Working Range, Blanko, dan Spike sekarang bisa di-scroll horizontal (`overflow-x-auto`) jika lebarnya melebihi layar hp/tablet, tanpa memotong konten.
4. ✅ **Card Responsive**: `StatCard` di Presisi dan Akurasi sekarang bersifat adaptive. Padding, margin, ukuran text, dan layout grid akan menyesuaikan (mengecil) secara otomatis di layar HP agar tidak terpotong.
5. ✅ **Status Limit Deteksi (Blanko)**: `SD Blanko` dan `Estimasi MDL` sebenarnya **sudah ada** di dalam `BlankoTable.tsx` (di bagian paling bawah tabel), dan saya pastikan itu tampil dengan layout yang rapi.
6. ✅ **Status Uji Spike**: Saya sudah tambahkan `SD Spike` (yang tadinya kurang) dan merapikan tampilan `MDL (Spike)` dan `LOQ (Spike)` di bagian bawah `SpikeTable.tsx`.
7. ✅ **PPM Bisa Diedit**: Kolom `ppm (x)` di Working Range, Blanko, dan Spike yang sebelumnya read-only (auto-calculate) sekarang sudah saya ubah menjadi `editable: true`. User bisa mengetik angka manual.
8. ✅ **Logika Perhitungan**: Saya sudah mengecek ulang secara detail fungsi `computeReplicateSet` dan memastikan logikanya persis 100% dengan referensi (menghitung rata-rata hanya dari nilai yang valid/tidak kosong, lalu menghitung deviasi dan varians terhadap rata-rata tersebut).
9. ✅ **Bug Baris Kosong (Index Salah)**: Ini adalah bug yang krusial! Sebelumnya, perhitungan hasil (seperti deviasi) diisi secara berurutan ke array `[0], [1]` meskipun data aslinya ada di baris `[6], [7]`. Saya sudah perbaiki logika map-nya di `lib/calculations.ts` sehingga hasil perhitungan selalu masuk ke index baris yang tepat meskipun ada baris kosong di tengah-tengah.

Semua perubahan sudah berhasil di-build tanpa error. Silakan ditest aplikasinya kembali! 🚀