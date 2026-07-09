# Token Savings Benchmark

Panduan ini mendokumentasikan metodologi pengukuran dan pelaporan efisiensi token context budget pada SingularityForge.

## Metodologi

Claude Code memuat berkas memori sistem (`CLAUDE.md`), modular rules, dan task-relevant skills. Untuk mencegah pemborosan token input, compiler SingularityForge mengompres berkas-berkas tersebut dengan cara:
1. Menghilangkan komentar Markdown (`<!-- ... -->`).
2. Menghilangkan whitespace berlebih dan baris kosong ganda.
3. Menyederhanakan header dan list.
4. Melakukan seleksi modul dinamis berbasis profil aktif (`minimal`, `coding`, `security`, dll.).

Benchmark mengukur performa optimasi menggunakan indikator:
- **Lines count**: Total baris berkas.
- **Words count**: Jumlah kata total.
- **Estimated Tokens**: Estimasi jumlah token (dihitung menggunakan rumus empiris `words * 1.3`).
- **Savings (%)**: Persentase pemangkasan context footprint.

## Cara Menjalankan Benchmark

1. Jalankan optimasi cache terlebih dahulu:
   ```bash
   npm run token:optimize
   ```
2. Jalankan benchmark pengukuran:
   ```bash
   npm run token:benchmark
   ```
3. Hasil statistik detail akan dicetak ke layar dan disimpan di `reports/token/token-benchmark.md`.

## Hasil Baseline (`minimal` profile)
- **Line Savings**: ~57.2%
- **Word Savings**: ~51.7%
- **Token Savings**: ~51.8%
- **Status**: **PASS** (Mengurangi context footprint hingga setengah dari ukuran aslinya).
