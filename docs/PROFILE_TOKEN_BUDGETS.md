# Kebijakan & Batasan Budget Token Profil (Profile Token Budgets)

Dokumen ini mendefinisikan kebijakan resmi batas token budget untuk setiap profil runtime Claude Code di SingularityForge. Kebijakan ini dirancang untuk menjaga optimalisasi context footprint tanpa mengorbankan fungsionalitas dan keamanan sistem.

## Daftar Profil & Target Budgets

| Profil | Tujuan & Deskripsi | Target Token Budget | Batas WARN | Batas FAIL |
| :--- | :--- | :---: | :---: | :---: |
| `minimal` | Evaluasi minimalis hemat token untuk operasi dasar | <= 500 | 501 - 650 | > 650 |
| `coding` | Pengembangan software, pengujian unit, debugging harian | <= 1200 | 1201 - 1500 | > 1500 |
| `security` | Audit keamanan repositori dan verifikasi pertahanan | <= 1200 | 1201 - 1500 | > 1500 |
| `repo-review` | Intake repositori besar dan peninjauan arsitektur sistem | <= 1400 | 1401 - 1800 | > 1800 |
| `release` | Otomasi release engineering dan checklist pelaporan | <= 900 | 901 - 1100 | > 1100 |
| `max` | Penyatuan komprehensif seluruh rules dan skills utama | <= 2500 | 2501 - 3000 | > 3000 |

*Catatan: Estimasi token dihitung secara empiris menggunakan rumus `words * 1.3`.*

---

## Aturan & Konfigurasi Modul Profil

Setiap profil menyaring aturan domain (`rules/`) dan kapabilitas sistem (`skills/`) secara terarah:

### 1. minimal
- **Rules**: `rules/token-discipline.md`
- **Skills**: `skills/token-router`

### 2. coding
- **Rules**: `rules/token-discipline.md`, `rules/engineering.md`, `rules/debugging.md`, `rules/testing.md`
- **Skills**: `skills/token-router`, `skills/verify-before-done`
- **Justifikasi Token Lebih Besar**: Kebutuhan rules coding lebih tinggi karena model membutuhkan basis instruksi terstruktur untuk teknik debugging, pengujian (TDD), serta panduan integrasi refactoring demi mencegah bug regresi.

### 3. security
- **Rules**: `rules/token-discipline.md`, `rules/security.md`
- **Skills**: `skills/token-router`, `skills/security-review`
- **Justifikasi Pertahanan Keamanan**: Profil `security` wajib mempertahankan seluruh security rules. Keamanan kode dan perlindungan rahasia tidak boleh dikurangi demi menghemat token. Aturan proteksi injeksi, penanganan kredensial, dan validasi input adalah prioritas mutlak yang harus selalu aktif.

### 4. repo-review
- **Rules**: `rules/token-discipline.md`, `rules/engineering.md`
- **Skills**: `skills/token-router`, `skills/repo-intake`, `skills/architecture-review`

### 5. release
- **Rules**: `rules/token-discipline.md`, `rules/release.md`
- **Skills**: `skills/token-router`, `skills/release-check`

### 6. max
- **Rules**: Seluruh rules (`token-discipline`, `engineering`, `debugging`, `testing`, `security`, `release`).
- **Skills**: Seluruh skills (`token-router`, `verify-before-done`, `security-review`, `repo-intake`, `architecture-review`, `release-check`, `fable-mode`).

---

## Kebijakan Anti-Duplikasi & Keamanan Informasi (No-Secrets)

1. **Anti-Duplikasi Berkas**:
   Kompilasi optimizer (`optimize-token-cache.mjs`) hanya menyatukan modul unik. Konten mentah yang sama tidak boleh dideklarasikan berulang kali di dalam compiled cache `CLAUDE.md`. Optimizer mendeteksi konten ganda secara otomatis untuk mereduksi overhead token.
   
2. **Keamanan Data & Pencegahan Kebocoran Secrets**:
   - Optimizer dan compiler dilarang keras memproses, menyalin, atau menyimpan file runtime user, log sesi interaktif, atau kredensial `.env` / tokens ke dalam compiled `.claude/CLAUDE.md` cache.
   - Folder `.claude/cache/` atau berkas cache temporary lokal lainnya tidak boleh dicommit ke Git repositori SingularityForge untuk menghindari kebocoran runtime output user ke publik.
