# PEMDAS Kelompok 5

Proyek UAS Pemrograman Dasar

Kelas T1B, Kelompok 5
Tema: Sistem Kasir Kantin (pengembangan dari proyek UTS)

---

## Anggota dan Pembagian Tugas

| Nama | NIM | GitHub | Bagian yang dikerjakan |
| ---- | --- | ------ | ---------------------- |
| Muhammad Rafi Faisal | 263140700111029 | @RafiFaisal16 | Membuat repository dan setting file project, README |
| (Hafidz Muhammad Ilham ) | (263140700111006) | (@MORTEKS) | Laporan Bagian A (proposal dan analisis awal ) |
| (Naila Putri S) | (isi NIM) | (@Nxthy707) | Menyusul |

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
- [x] Repository dibuat (Public)
- [x] Pembagian tugas ditulis di README
- [x] Proposal dan analisis awal
- [ ] Draft laporan di folder `docs/`
- [ ] Semua anggota sudah punya minimal 1 commit

---

## Cara Menjalankan

```bash
git clone https://github.com/RafiFaisal16/PEMDASKelompok5.git
cd PEMDASKelompok5
npm install
npx ts-node src/index.ts
```
