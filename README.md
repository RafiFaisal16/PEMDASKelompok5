# PEMDAS Kelompok 5 — Aplikasi Console TypeScript

Proyek Tim UAS **Pemrograman Dasar**
Program Studi Teknologi Informasi, Fakultas Vokasi, Universitas Brawijaya
Dosen Pengampu: Salnan Ratih Asriningtias, ST., MT.

**Kelas:** T1B | **Kelompok:** 5
**Tema aplikasi:**#  Sistem Kasir Kantin (pengembangan dari proyek UTS, ditambah CRUD dan Search)

---

## 1. Anggota Kelompok

| No | Nama Lengkap | NIM | Akun GitHub |
| -- | ------------ | --- | ----------- |
| 1 | Muhammad Rafi Faisal | 263140700111029 | @username1 |
| 2 | <Nama Anggota 2> | <NIM 2> | @username2 |
| 3 | <Nama Anggota 3> | <NIM 3> | @username3 |

---

## 2. Pembagian Tugas

Pembagian tugas ditentukan sendiri oleh anggota. Kode ditulis di satu file `src/index.ts`, jadi tiap anggota memegang **blok kode** sendiri agar tidak bentrok saat merge.

| Anggota | Bagian yang Dikerjakan | Blok di `src/index.ts` | Progress |
| ------- | ---------------------- | ---------------------- | -------- |
| Anggota 1 | Setup repository, struktur data (tipe dan seed), kerangka menu utama (loop), fitur Create dan validasi input | Blok 1 (tipe data dan seed), Blok 2 (menu utama), Blok 3 (Create) | 1, 2, 3 |
| Anggota 2 | Fitur Read (semua data dan detail by ID), fitur Update, flowchart, laporan Bagian A | Blok 4 (Read), Blok 5 (Update) | 2, 4, 5 |
| Anggota 3 | Fitur Delete (konfirmasi Y/N), fitur Search (kata kunci dan filter), integrasi materi, README final | Blok 6 (Delete), Blok 7 (Search) | 5, 6, 7 |

Catatan: tabel ini diperbarui di setiap progress. Tautan Pull Request utama tiap anggota ditambahkan di bagian 7.

---

## 3. Proposal dan Analisis Awal (Bagian A)

### 3.1 Deskripsi Masalah

**Latar belakang.** Kantin sering kewalahan melayani pembeli saat jam ramai jika pencatatan masih manual. Kasir harus menghitung total pesanan, mengecek stok, menghitung diskon, dan menghitung kembalian, sehingga rawan salah hitung dan antrean memanjang. Pada UTS dibuat program kasir kantin berbasis terminal. Pada UAS program dikembangkan agar kasir juga bisa **mengelola data menu** (tambah, lihat, ubah, hapus, dan cari) menggunakan array.

**Pengguna sistem.** Kasir / petugas kantin.

**Data input.** Data menu (nama, kategori, harga, stok, status tersedia), ID menu yang dicari atau diubah atau dihapus, kata kunci pencarian, filter tambahan (kategori atau rentang harga), pilihan menu, dan konfirmasi Y/N.

**Data output.** Daftar seluruh menu dalam format rapi, detail satu menu, pesan hasil operasi (berhasil atau gagal), pesan validasi, hasil pencarian beserta jumlahnya, dan pesan khusus jika data kosong atau ID tidak ditemukan.

### 3.2 Entitas Data dan Properti

Entitas utama: **Menu**

| Properti | Tipe | Keterangan |
| -------- | ---- | ---------- |
| id | string | Kode unik menu, contoh `M001` |
| nama | string | Nama menu |
| kategori | string | Makanan / Minuman |
| harga | number | Harga per porsi (Rp) |
| stok | number | Jumlah stok tersedia |
| tersedia | boolean | Status ketersediaan menu |

Data awal (seed) minimal 5 menu disimpan di dalam array.

### 3.3 Daftar Fitur

| Fitur | Ringkasan |
| ----- | --------- |
| Menu utama | Menu berulang sampai pengguna memilih keluar, input tidak valid ditangani |
| Create | Tambah menu baru, ID unik, validasi input |
| Read | Tampil semua data dan detail satu data berdasarkan ID, pesan jika data kosong |
| Update | Ubah data berdasarkan ID, pesan jika ID tidak ditemukan |
| Delete | Hapus data berdasarkan ID dengan konfirmasi Y/N |
| Search | Cari berdasarkan kata kunci (tidak sensitif huruf besar/kecil) dan minimal 1 filter lain |

### 3.4 Decomposition Awal

1. **Menu utama**: tampilkan pilihan, baca input, ulangi sampai keluar.
2. **Create**: input data menu, validasi, buat ID unik, simpan ke array.
3. **Read**: tampilkan semua menu dan detail satu menu berdasarkan ID.
4. **Update**: cari menu berdasarkan ID, ubah properti, validasi ulang.
5. **Delete**: cari menu berdasarkan ID, minta konfirmasi, hapus dari array.
6. **Search**: cari berdasarkan kata kunci dan filter, tampilkan hasil dan jumlahnya.

---

## 4. Laporan Progres

| Progress | Batas Waktu | Fokus | Status |
| -------- | ----------- | ----- | ------ |
| 1 | Senin, 23 Nov 2026 | Repository Public, pembagian tugas di README, proposal dan analisis awal (Bagian A) | Selesai |
| 2 | Jumat, 27 Nov 2026 | Flowchart, desain struktur data dan fungsi, fondasi materi UTS, kerangka menu | Belum |
| 3 | Senin, 30 Nov 2026 | Fitur Create dan validasi input dasar | Belum |
| 4 | Rabu, 2 Des 2026 | Fitur Read dan penanganan data kosong | Belum |
| 5 | Jumat, 4 Des 2026 | Fitur Update dan Delete | Belum |
| 6 | Senin, 7 Des 2026 | Fitur Search (kata kunci dan filter) | Belum |
| 7 | Jumat, 11 Des 2026 | Finalisasi program, laporan, README final | Belum |

### Progress 1 (23 Nov 2026)

- [x] Repository GitHub dibuat dengan visibilitas Public
- [x] Pembagian tugas anggota ditulis di README
- [x] Proposal dan analisis awal (Bagian A): deskripsi masalah, entitas data, daftar fitur, decomposition awal
- [ ] Draft laporan (sampul, 1.1, 1.2 awal, rencana 3.2) disimpan di folder `docs/`
- [ ] Setiap anggota sudah punya minimal 1 commit dengan akun GitHub sendiri

---

## 5. Cara Menjalankan

```bash
# 1. Clone repository
git clone https://github.com/<username-pemilik>/PEMDASKelompok5.git
cd PEMDASKelompok5

# 2. Pasang dependensi
npm install

# 3. Jalankan program
npx ts-node src/index.ts
```