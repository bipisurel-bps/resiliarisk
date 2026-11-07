# Resilia — Enterprise Operational Risk & RCSA Studio
> **Standar:** ISO 31000:2018 | Basel II Operational Risk Taxonomy | IIA Three Lines Model  
> **UI Aesthetic:** Style UI (`style.ai.id`) & Antislop Standard — Modern Dark Cyber-Glass Layout

Resilia adalah aplikasi web SaaS Manajemen Risiko Operasional (Operational Risk Management) dan lembar kerja **RCSA (Risk & Control Self-Assessment)** interaktif berbasis standar internasional ISO 31000:2018. Aplikasi ini dirancang agar siapa pun (mulai dari pemula/mahasiswa hingga risk officer profesional) dapat melakukan pemetaan risiko, kalkulasi efektivitas kontrol, visualisasi matriks 5x5, dan pemantauan indikator KRI secara mandiri langsung di browser tanpa perlu instalasi aplikasi tambahan.

---

## Fitur Utama

### 1. Dynamic 5x5 Heatmap Matrix (ISO 31000)
- **Grid Koordinat:** Kemungkinan / *Likelihood* (1 s/d 5) vs Dampak / *Impact* (1 s/d 5).
- **Kategori Warna ISO:** Hijau (Rendah 1-4), Kuning (Sedang 5-9), Oranye (Tinggi 10-14), Merah (Ekstrem/Kritis 15-25).
- **3 Mode Tampilan Interaktif:**
  - *Risiko Residual (Saat Ini)*: Posisi risiko setelah mitigasi & kontrol dijalankan.
  - *Risiko Inheren (Awal)*: Posisi keparahan risiko jika belum ada kontrol.
  - *Mode Perpindahan (Control Shift)*: Memperlihatkan pergeseran titik risiko dari Inheren ke Residual.

### 2. RCSA Workspace (Risk & Control Register)
- Formulir pendaftaran risiko operasional berstandar GRC.
- **Anatomi Risiko Terstruktur:** Pembedahan jelas antara *Akar Penyebab (Root Cause)*, *Peristiwa (Risk Event)*, dan *Dampak (Impact)*.
- **Evaluasi Kontrol:** Tipe kontrol (*Preventif, Detektif, Korektif*) dan efektivitas (*Strong, Adequate, Weak, None*).
- **Strategi Mitigasi 4T:** *Treat* (Mitigasi), *Transfer* (Asuransi/Pihak ke-3), *Tolerate* (Terima), *Terminate* (Hentikan).
- Pencarian cerdas, filter per unit kerja, filter kategori risiko, dan filter tingkat keparahan.

### 3. KRI Monitor (Key Risk Indicators & Early Warning)
- Panel indikator peringatan dini risiko harian/bulanan.
- Indikator status *Green (Aman)*, *Amber (Waspada)*, dan *Red (Bahaya)*.
- Fitur update nilai indikator secara langsung dengan kalkulasi status otomatis.
- Terhubung langsung dengan kode risiko RCSA terkait.

### 4. ISO 31000 Academy (Pusat Belajar Interaktif)
- 8 Prinsip Utama ISO 31000:2018 beserta contoh kasus nyata.
- Penjelasan komprehensif *The IIA's Three Lines Model* (Lini 1, Lini 2, Lini 3).
- Panduan anatomi pembedahan *Cause - Event - Impact*.
- Kuis studi kasus interaktif dengan umpan balik penjelasan langsung.

### 5. Laporan Audit & Pusat Ekspor
- Tampilan cetak resmi **Print-to-PDF** yang rapi dan siap dibawa ke rapat komite risiko / direksi.
- Ekspor data lengkap ke format **CSV (Microsoft Excel & Google Sheets compatible)**.
- Fitur **Backup JSON** dan **Import JSON** untuk fleksibilitas pemindahan data antar perangkat.
- **Penyimpanan Lokal Privat:** Seluruh data tersimpan di LocalStorage browser pengguna (tanpa risiko kebocoran data rahasia ke server pihak ketiga).

---

## Teknologi & Dependensi

- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons:** Lucide React
- **Build Tool:** Vite 6
- **Standar Desain:** Style UI (Glass pill navbar, high-contrast dark surfaces, responsive mobile to desktop)

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
2. Salin snippet dari `Caddyfile.snippet` ke konfigurasi Caddy Anda:
   ```caddy
   namadomainanda.com {
       root * /home/ubuntu/resilia/dist
       file_server
       try_files {path} {path}/ /index.html
       encode zstd gzip
   }
   ```
3. Reload Caddy:
   ```bash
   sudo systemctl reload caddy
   ```
