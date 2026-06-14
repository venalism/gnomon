# Gnomon

Gnomon adalah ekstensi Chrome/Chromium untuk memperkirakan penggunaan token prompt AI dan membantu pengguna menulis prompt yang lebih jelas, hemat, dan terkontrol sebelum dikirim ke chatbot.

Proyek ini menggunakan pendekatan local-first: analisis prompt, penilaian, deteksi masalah, dan optimasi berbasis aturan berjalan di browser tanpa backend pada MVP.

## Status Proyek

Gnomon saat ini berada pada versi `0.1.0` dan berfokus pada MVP untuk ChatGPT web.

Ruang lingkup MVP:

- Mendukung `chatgpt.com` dan `chat.openai.com`.
- Menganalisis prompt secara lokal di browser.
- Menampilkan estimasi token input, rentang prediksi output, estimasi total token, confidence, dan skor prompt.
- Mendeteksi masalah umum pada prompt dan memberi saran perbaikan.
- Membuat prompt hasil optimasi berbasis aturan.
- Menyediakan aksi salin dan terapkan prompt hasil optimasi.
- Menyimpan pengaturan secara lokal melalui Chrome storage.

Di luar ruang lingkup MVP:

- Tidak ada backend.
- Tidak ada login atau akun pengguna.
- Tidak ada cloud sync.
- Tidak ada riwayat prompt secara default.
- Tidak ada rewrite berbasis AI.
- Tidak mengklaim akurasi token yang sama persis dengan billing model AI.

## Fitur Utama

- Estimasi token input secara real-time saat pengguna mengetik prompt.
- Prediksi rentang token output dan total token.
- Skor kualitas prompt dengan label seperti poor, needs improvement, good, dan excellent.
- Breakdown skor untuk kejelasan, spesifisitas, efisiensi token, kontrol output, kualitas konteks, dan redundansi.
- Deteksi isu prompt seperti output format yang belum jelas, batas panjang yang tidak ada, prompt ambigu, terlalu banyak tugas, risiko output panjang, frasa redundan, dan konteks yang kurang.
- Saran perbaikan prompt yang dapat ditampilkan dalam bahasa Inggris atau Indonesia.
- Optimasi prompt berbasis aturan dengan mode `safe`, `balanced`, dan `aggressive`.
- Perbandingan prompt asli dan prompt hasil optimasi, termasuk estimasi token yang dihemat.
- Tombol untuk menyalin atau menerapkan prompt hasil optimasi ke input ChatGPT.
- Popup dan options page untuk mengatur budget token, bahasa, mode optimasi, local-only mode, dan tampilan widget.

## Tech Stack

- TypeScript
- React
- Vite
- TailwindCSS
- Chrome Extension Manifest V3
- pnpm workspaces
- Turborepo
- Vitest
- Playwright
- ESLint
- Prettier

## Struktur Repository

```text
.
+-- apps/
|   `-- extension/          # Ekstensi Manifest V3, content script, popup, options, widget
+-- packages/
|   +-- core/               # Analisis prompt, scoring, issue detection, prediksi, optimasi
|   +-- shared/             # Konstanta, default settings, i18n, helper storage
|   +-- tokenizer/          # Estimasi token berbasis profil model
|   `-- ui/                 # Komponen UI React yang digunakan ulang
+-- scripts/
|   `-- zip-extension.ts    # Script packaging ekstensi
+-- docs/                   # Dokumen arsitektur, privasi, PRD, demo, roadmap
+-- package.json
+-- pnpm-workspace.yaml
`-- turbo.json
```

## Arsitektur Singkat

Gnomon dipisahkan menjadi core engine yang tidak bergantung pada browser dan runtime ekstensi browser.

Alur runtime:

1. Content script berjalan di `chatgpt.com` atau `chat.openai.com`.
2. Prompt observer mencari input prompt ChatGPT memakai selector yang fleksibel.
3. Perubahan input di-debounce agar analisis tidak berjalan terlalu sering.
4. Teks prompt dianalisis secara lokal melalui `@gnomon/core`.
5. React merender floating widget di halaman.
6. Optimasi prompt dibuat berbasis aturan.
7. Prompt hanya diganti ketika pengguna menekan tombol Apply.

Paket utama:

- `@gnomon/tokenizer`: estimasi token approximate dengan profil model seperti GPT-like, Claude-like, Gemini-like, dan custom.
- `@gnomon/core`: ekstraksi fitur prompt, klasifikasi tipe prompt, scoring, issue detection, prediksi output, saran, dan optimasi.
- `@gnomon/shared`: supported site config, default settings, teks UI, dan helper Chrome storage.
- `@gnomon/ui`: komponen UI dasar seperti button, card, badge, dan progress.
- `@gnomon/extension`: ekstensi browser, content script, overlay widget, popup, options page, dan service worker.

## Prasyarat

- Node.js `^20.19.0` atau `>=22.12.0`.
- Corepack.
- pnpm `9.15.4`.
- Browser Chromium seperti Chrome, Edge, Brave, atau Chromium.

## Setup Lokal

Aktifkan pnpm sesuai versi yang digunakan proyek:

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
```

Install dependency:

```bash
pnpm install
```

Build seluruh workspace:

```bash
pnpm build
```

## Menjalankan Ekstensi di Browser

Setelah build selesai, folder ekstensi ada di:

```text
apps/extension/dist
```

Cara load sebagai unpacked extension di Chrome:

1. Buka `chrome://extensions`.
2. Aktifkan Developer mode.
3. Klik Load unpacked.
4. Pilih folder `apps/extension/dist`.
5. Buka `https://chatgpt.com` atau `https://chat.openai.com`.
6. Ketik prompt di ChatGPT dan pastikan widget Gnomon muncul.

Untuk Edge, gunakan `edge://extensions` dengan langkah yang sama.

## Workflow Development

Jalankan mode development:

```bash
pnpm dev
```

Perintah ini menjalankan pipeline `turbo dev`. Untuk app ekstensi, mode dev melakukan build dengan watch mode. Setelah perubahan file, reload ekstensi dari halaman extensions browser dan refresh tab ChatGPT agar content script terbaru aktif.

Perintah umum:

| Perintah         | Fungsi                                            |
| ---------------- | ------------------------------------------------- |
| `pnpm dev`       | Menjalankan development/watch pipeline.           |
| `pnpm build`     | Build semua package dan app melalui Turborepo.    |
| `pnpm test`      | Menjalankan test workspace melalui Turborepo.     |
| `pnpm test:e2e`  | Menjalankan Playwright smoke test untuk ekstensi. |
| `pnpm typecheck` | Menjalankan TypeScript typecheck.                 |
| `pnpm lint`      | Menjalankan ESLint dengan `--max-warnings=0`.     |
| `pnpm format`    | Format seluruh repo dengan Prettier.              |
| `pnpm zip`       | Membuat file zip dari build ekstensi.             |

## Testing

Unit test:

```bash
pnpm test
```

Typecheck:

```bash
pnpm typecheck
```

Lint:

```bash
pnpm lint
```

Smoke test ekstensi:

```bash
pnpm build
pnpm test:e2e
```

Smoke test memakai Playwright dan mengharapkan build ekstensi tersedia di `apps/extension/dist`.

## Packaging

Buat build produksi:

```bash
pnpm build
```

Kemudian buat archive:

```bash
pnpm zip
```

Script packaging membaca `apps/extension/dist` dan membuat file:

```text
gnomon-extension-YYYY-MM-DD.zip
```

## Pengaturan Default

| Pengaturan         | Default    | Keterangan                        |
| ------------------ | ---------- | --------------------------------- |
| `enabled`          | `true`     | Ekstensi aktif.                   |
| `showInlineWidget` | `true`     | Widget inline ditampilkan.        |
| `showSidebar`      | `true`     | Sidebar/panel detail ditampilkan. |
| `localOnlyMode`    | `true`     | Analisis tetap lokal.             |
| `tokenBudget`      | `1000`     | Budget token awal.                |
| `optimizationMode` | `balanced` | Mode optimasi awal.               |
| `language`         | `en`       | Bahasa UI awal.                   |
| `modelProfile`     | `gpt_like` | Profil tokenizer awal.            |
| `enabledSites`     | `chatgpt`  | Situs yang aktif secara default.  |

## Privasi dan Permission

Gnomon MVP tidak mengirim prompt ke API eksternal.

- Prompt dianalisis di browser.
- Prompt tidak disimpan secara default.
- Pengaturan disimpan melalui Chrome storage APIs.
- Host permission dibatasi ke domain ChatGPT.
- Permission ekstensi saat ini: `storage` dan `activeTab`.
- Tidak ada analytics, auth, cloud sync, AI rewrite, atau prompt history pada MVP.

Jika AI-powered rewrite ditambahkan di versi mendatang, fitur tersebut harus bersifat opt-in dan menjelaskan teks apa yang keluar dari browser.

## Troubleshooting

Widget tidak muncul:

- Pastikan ekstensi sudah di-load dari `apps/extension/dist`.
- Pastikan membuka `chatgpt.com` atau `chat.openai.com`.
- Refresh tab ChatGPT setelah reload ekstensi.
- Pastikan extension status aktif dari popup/options.
- Pastikan inline widget tidak dimatikan di pengaturan.

Build gagal karena versi Node:

- Pastikan Node.js memenuhi requirement Vite: `^20.19.0` atau `>=22.12.0`.
- Pastikan pnpm yang aktif adalah `9.15.4`.

Smoke test gagal:

- Jalankan `pnpm build` sebelum `pnpm test:e2e`.
- Pastikan dependency sudah ter-install dengan `pnpm install`.

## Dokumentasi Tambahan

- [Architecture](docs/ARCHITECTURE.md)
- [Privacy](docs/PRIVACY.md)
- [PRD](docs/PRD.md)
- [Demo Script](docs/DEMO_SCRIPT.md)
- [Roadmap](docs/ROADMAP.md)

## License

Lihat [LICENSE](LICENSE).
