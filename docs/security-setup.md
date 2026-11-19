# Konfigurasi keamanan Valver

## Sebelum menjalankan versi ini

Form identitas sekarang memakai koneksi database khusus server dan cookie bertanda tangan. Tanpa konfigurasi berikut, penyimpanan identitas mengembalikan 503 dan kalkulator menolak sesi (fail closed).

1. Tambahkan `SUPABASE_SERVICE_ROLE_KEY` ke environment server dari pengaturan Supabase. Jangan gunakan awalan `NEXT_PUBLIC_`, jangan commit nilainya, dan jangan kirim melalui chat.
2. Buat `VALVER_SESSION_SECRET` acak minimal 32 karakter, misalnya `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Simpan di environment server yang sama pada semua instance.
3. Pastikan `NEXT_PUBLIC_SUPABASE_URL` benar. Restart server setelah mengubah environment.
4. Jalankan tes dan uji form di lingkungan staging.
5. Setelah server berfungsi, terapkan `supabase/migrations/20261118_restrict_identity_access.sql` melalui SQL Editor Supabase. Migrasi tidak menghapus data; akses anon/authenticated ke tabel identitas dicabut.
6. Verifikasi permintaan SELECT/INSERT memakai public key ditolak, sedangkan form melalui API server berhasil. Periksa juga kebijakan khusus lain di database aktif.

## Perilaku sesi

- Pengguna tetap wajib mengisi identitas, tanpa akun/password.
- Sesi berlaku 24 jam dan ditandatangani HMAC-SHA256. Cookie lama berisi UUID tidak diterima.
- Cookie HttpOnly, SameSite=Lax, Secure pada production HTTPS.
- Mengganti secret membatalkan semua sesi yang ada. Menghapus baris identitas tidak otomatis membatalkan token yang sudah diterbitkan; sesi ini bukan sistem akun dengan revokasi per pengguna.
- Membuka beranda menghapus cookie pada respons server, tanpa permintaan cleanup asinkron yang bisa berbenturan dengan pengiriman form. DELETE /api/session juga tersedia untuk penghapusan sesi eksplisit.
- API memeriksa origin yang sama, format JSON, batas body 4096 byte, dan format identitas server. Integrasi reverse proxy harus mempertahankan origin/host yang benar.

## Batas yang masih perlu ditangani

Pemeriksaan origin bukan perlindungan bot. Rate limiting terdistribusi/WAF belum disediakan; pasang melalui platform deployment sebelum trafik publik diperluas. Jangan mengandalkan pembatas berbasis memori proses pada deployment multi-instance.

Database aktif belum dimigrasi atau diaudit oleh perubahan kode ini. Kredensial produksi tidak dibuat atau diubah otomatis.

## Pengujian

`node --test tests/*.test.cjs`

`npx tsc --noEmit --incremental false`

`npm run build`

Tes route menggunakan adapter database uji; tidak mengirim identitas ke database produksi.
