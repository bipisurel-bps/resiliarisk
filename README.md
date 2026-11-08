# Resilia — Belajar Manajemen Risiko

Resilia adalah ruang belajar mandiri untuk memahami manajemen risiko melalui konsep, studi kasus, dan latihan mengambil keputusan. Materi pengantar mencakup prinsip ISO 31000, konteks dan proses risiko, anatomi penyebab–peristiwa–dampak, pilihan perlakuan, serta pengenalan RCSA dan indikator risiko.

Tujuan utamanya adalah membantu peserta memahami cara berpikir risiko. Perangkat heatmap, RCSA, KRI, dan ekspor laporan tersedia sebagai latihan tambahan; saat ini fitur tersebut berjalan di browser dan bukan layanan kolaborasi tim.

## Jalur belajar

- Materi prinsip ISO 31000 dan konteks manajemen risiko.
- Anatomi risiko: menghubungkan penyebab, peristiwa, dan dampak.
- Studi kasus dan simulasi pilihan tindakan dengan umpan balik.
- Pengenalan model Three Lines, kategori risiko, dan perlakuan risiko.
- Evaluasi pemahaman. Dokumen yang tersedia adalah bukti penyelesaian belajar mandiri, bukan sertifikasi profesi, akreditasi ISO, atau pengakuan lembaga eksternal.

## Perangkat latihan

- Heatmap kemungkinan dan dampak.
- Lembar latihan RCSA dengan identifikasi risiko, pengendalian, dan rencana tindakan.
- Pemantauan indikator risiko (KRI).
- Contoh industri, laporan latihan, ekspor CSV, serta impor dan pencadangan JSON.

Data latihan risiko disimpan di `localStorage` pada browser yang digunakan. Data tidak tersinkron antarperangkat atau antaranggota tim. Hindari memasukkan informasi risiko organisasi yang bersifat rahasia.

---

## Teknologi & Dependensi

- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons:** Lucide React
- **Build Tool:** Vite 6
- **Antarmuka:** Halaman belajar responsif dengan materi dan perangkat latihan terpisah

---

## Cara Menjalankan Secara Lokal

```bash
cd resilia

# Menjalankan mode development
npm run dev

# Membangun file produksi (build)
npm run build

# Menjalankan preview lokal hasil build
npm run preview
```

---

## Panduan Deploy ke VPS (Caddy Server)

1. Jalankan build di server atau upload folder `dist/` hasil build:
   ```bash
   npm run build
   ```
2. Arahkan root situs pada konfigurasi Caddy ke folder `dist/`:
   ```caddy
   namadomainanda.com {
       root * /var/www/resiliarisk
       file_server
       try_files {path} {path}/ /index.html
       encode zstd gzip
   }
   ```
3. Reload Caddy:
   ```bash
   sudo systemctl reload caddy
   ```
