# PEMDAS Kelompok 5

Proyek UAS Pemrograman Dasar

Kelas T1B, Kelompok 5
Tema: Sistem Kasir Kantin (pengembangan dari proyek UTS)

---

## Anggota dan Pembagian Tugas

Progress 1 — Senin, 23 November 2026

| Nama | NIM | GitHub | Bagian yang dikerjakan |
| ---- | --- | ------ | ---------------------- |
| Muhammad Rafi Faisal | 263140700111029 | @RafiFaisal16 | Membuat repository, setting file project, sistem dasar dari UTS, README, dan folder docs/ |
| Hafidz Muhammad Ilham | 263140700111006 | @MORTEKS | Laporan Bagian A (proposal dan analisis awal): 1.1 Deskripsi Masalah, serta 1.2 Decomposition |
| Naila Putri Sahiro | 263140700111049 | @Nxthy707 | Penyusunan dan pemeriksaan format laporan: Halaman Sampul, 1.1 Entitas Data dan Properti, 1.2 Decomposition upddate, serta 3.2 rencana pembagian tugas |

Progress 2 — Jumat, 27 November 2026

| Nama | NIM | GitHub | Bagian yang dikerjakan |
| ---- | --- | ------ | ---------------------- |
| Muhammad Rafi Faisal | 263140700111029 | @RafiFaisal16 | Membuat repository, setting file project, sistem dasar dari UTS, README, membuat feature struktur data, feature fungsi bantu,  2.1 flowchart alur menu utama, 2.2 menerangkan flowchart, 3.1 pemetaan pemenuhan ketentuan project, 3.3 screenshoot hasil |
| Hafidz Muhammad Ilham | 263140700111006 | @MORTEKS | Laporan Bagian A (proposal dan analisis awal): 1.1 Deskripsi Masalah, serta 1.2 Decomposition, membuat feature proses transaksi |
| Naila Putri Sahiro | 263140700111049 | @Nxthy707 | Penyusunan dan pemeriksaan format laporan: Halaman Sampul, 1.1 Entitas Data dan Properti, 1.2 Decomposition upddate, serta 3.2 rencana pembagian tugas, membuat feature menu utama, 1.3 pattern recognitiion, 1.4 abstraction, 1.5 algoritma thinking. |
---

## Tentang Aplikasi

Aplikasi ini adalah program kasir kantin berbasis terminal. Di UTS, program hanya memproses satu transaksi. Di UAS, program dikembangkan supaya kasir bisa mengelola data menu: menambah, melihat, mengubah, menghapus, dan mencari menggunakan array.

**Masalah yang diselesaikan:** kantin sering kewalahan saat ramai kalau pencatatan masih manual. Kasir harus menghitung total, mengecek stok, menghitung diskon, dan menghitung kembalian, sehingga mudah salah dan antrean jadi panjang.

**Pengguna:** kasir atau petugas kantin.

**Data menu** punya properti berikut:
- id (string): kode unik, contoh M001
- nama (string): nama menu
- kategori (string): Makanan atau Minuman
- harga (number): harga per porsi
- stok (number): jumlah stok
- tersedia (boolean): menu tersedia atau tidak

---

## Fitur yang Direncanakan

1. **Menu utama**: menampilkan pilihan dan berulang sampai pengguna memilih keluar.
2. **Create**: menambah menu baru dengan ID unik dan validasi input.
3. **Read**: menampilkan semua menu dan detail satu menu berdasarkan ID.
4. **Update**: mengubah data menu berdasarkan ID.
5. **Delete**: menghapus menu berdasarkan ID, dengan konfirmasi Y/N.
6. **Search**: mencari menu dengan kata kunci dan filter tambahan.

---

## Progres

- Progress 1 (23 Nov): repository, pembagian tugas, proposal awal. **Sedang dikerjakan**
- Progress 2 (27 Nov): flowchart, struktur data dan fungsi, kerangka menu. Belum
- Progress 3 (30 Nov): fitur Create. Belum
- Progress 4 (2 Des): fitur Read. Belum
- Progress 5 (4 Des): fitur Update dan Delete. Belum
- Progress 6 (7 Des): fitur Search. Belum
- Progress 7 (11 Des): finalisasi program, laporan, dan README. Belum

Yang sudah selesai di Progress 1:
- Repository dibuat (Public)
- Pembagian tugas ditulis di README
- Proposal dan analisis awal
- Draft laporan di folder `docs/`
- Semua anggota sudah punya minimal 1 commit

Link DOCS Laporan Bagian A: https://docs.google.com/document/d/1WYCie03mGy7b_w3w_ZReOX-VwWsQMANI9QzZLjE09eo/edit?usp=sharing

---

## Cara Menjalankan

```bash
git clone https://github.com/RafiFaisal16/PEMDASKelompok5.git
cd PEMDASKelompok5
npm install
npx ts-node src/index.ts
```
