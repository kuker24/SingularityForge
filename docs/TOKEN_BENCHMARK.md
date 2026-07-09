# Token Savings Benchmark

Panduan ini mendokumentasikan metodologi pengukuran, safety checks, dan pelaporan efisiensi token context budget pada SingularityForge.

## Metodologi

Claude Code memuat berkas memori sistem (`CLAUDE.md`), modular rules, dan task-relevant skills. Untuk mencegah pemborosan token input, compiler SingularityForge mengompres berkas-berkas tersebut dengan cara:
1. Menghilangkan komentar Markdown (`<!-- ... -->`).
2. Menghilangkan whitespace berlebih dan baris kosong ganda.
3. Melakukan seleksi modul dinamis berbasis profil aktif (`minimal`, `coding`, `security`, dll.).

Benchmark mengukur performa optimasi menggunakan indikator:
- **Baseline Max Tokens**: Estimasi total token jika semua fitur/rules dimuat sekaligus (profil `max`).
- **Optimized Profile Tokens**: Estimasi total token setelah profil spesifik dipilih dan dikompresi.
- **Context Savings (%)**: Persentase pemangkasan context footprint dibandingkan profil baseline maksimum.

## Cara Menjalankan Benchmark

1. Jalankan optimasi cache secara dinamis berbasis profil:
   ```bash
   node scripts/optimize-token-cache.mjs --profile coding
   ```
2. Jalankan benchmark pengukuran profil:
   ```bash
   node scripts/token-benchmark.mjs --profile all
   ```
3. Hasil statistik detail multi-profile akan disimpan di `reports/token/profile-token-benchmark.md`.

## Safety Validation Checks
Benchmark ini menerapkan validasi keamanan sebelum memberikan status lulus (`PASS`):
- **Security Profile**: Wajib memuat `rules/security.md`. Jika hilang, benchmark otomatis FAIL.
- **Coding Profile**: Wajib memuat `rules/engineering.md`, `rules/debugging.md`, dan `rules/testing.md`.
- **Release Profile**: Wajib memuat `rules/release.md`.
