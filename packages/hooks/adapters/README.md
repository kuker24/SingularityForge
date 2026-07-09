# Hook Adapters Directory

Direktori ini berisi modular adapters untuk integrasi dengan tool eksternal secara terisolasi dan aman.

## Aturan Keamanan & Penggunaan
1. Semua adapter defaultnya non-aktif (`enabled: false` di `settings.json`).
2. Setiap adapter tidak boleh melakukan call jaringan eksternal secara otomatis atau membocorkan rahasia runtime.
3. Adapter harus berjalan secara fail-safe dan selalu diakhiri dengan status `exit 0` jika dinonaktifkan.
