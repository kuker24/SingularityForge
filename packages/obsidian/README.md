# Obsidian Memory Pack (Optional)

Obsidian Memory Pack menyediakan second brain berbasis Markdown untuk project memory yang durable, ringkas, dan dapat dipakai tanpa aplikasi Obsidian.

## Opt-in dan Aman

- Tidak diinstal oleh installer runtime Linux default.
- Tidak memasang aplikasi atau package eksternal.
- Tidak mengaktifkan MCP, webhook, atau integrasi jaringan.
- Setup default non-destructive: file yang sudah ada akan di-skip.

## Setup

```bash
npm run obsidian:setup -- --dry-run --target ~/SingularityForge-Vault
npm run obsidian:setup -- --target ~/SingularityForge-Vault
```

Gunakan `--force` hanya bila Anda ingin menimpa file template yang sudah ada.

## Prinsip Memory

Search before read, baca notes relevan saja, simpan rangkuman alih-alih log terminal penuh, dan jangan pernah menyimpan secret, token, API key, credential, atau isi `.env`.
