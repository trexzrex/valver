# Autosave perhitungan

Satu draft lokal disimpan pada `valver-draft-v1` di localStorage setelah perubahan input berhenti 500 ms. Semua tabel, jumlah baris, dan tiga pengaturan nominal disimpan; identitas, cookie, token, dan hasil perhitungan tidak ikut disimpan. Hasil dihitung ulang setelah pemulihan.

Saat kalkulator dibuka kembali, pengguna memilih Lanjutkan draft atau Mulai baru. Form identitas tidak menghapus draft. Sesi akses tetap wajib valid dan identitas laporan harus diperiksa kembali oleh pengguna. Draft bukan bukti kepemilikan; pengguna lain pada profil browser yang sama bisa mengaksesnya.

Draft kedaluwarsa 3 hari setelah perubahan terakhir dan dihapus saat pembukaan berikutnya. Reset perhitungan / Hapus draft memerlukan konfirmasi, membatalkan simpan tertunda, menghapus draft, dan mengembalikan input default tanpa menghapus identitas laporan. Draft kosong tidak langsung dibuat lagi.

Web Locks mengunci satu editor per origin. Tab kedua diblokir sampai tab pertama ditutup dan tab kedua dimuat ulang. Penguncian dilepas otomatis ketika dokumen ditutup. Fitur ini memerlukan browser yang mendukung Web Locks serta secure context (HTTPS atau localhost). Jika tidak tersedia atau storage diblokir, kalkulator tetap dapat digunakan tanpa autosave dan menampilkan peringatan.

Draft hanya tersedia pada perangkat, profil browser, dan origin yang sama. Localhost, IP LAN, dan domain produksi adalah penyimpanan berbeda. Menghapus data situs, mode privat, atau kebijakan penghapusan storage browser dapat menghapus draft. Penyimpanan saat halaman disembunyikan/pagehide diusahakan, tetapi crash mendadak dapat kehilangan perubahan terakhir. Tidak ada sinkronisasi cloud.

## Verifikasi

- `node --test tests/*.test.cjs` menguji round trip input, allowlist tanpa identitas/hasil, kedaluwarsa, format rusak, versi tidak dikenal, dan batas ukuran.
- `npx tsc --noEmit --incremental false`
- `npm run build`
- Uji browser: isi input, tunggu status tersimpan, tutup tab, buka kembali, lanjutkan draft; buka tab kedua dan pastikan diblokir; reset lalu refresh dan pastikan draft tidak kembali.
