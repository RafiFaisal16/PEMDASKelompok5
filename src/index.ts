// ============================================================================
// KASIR KANTIN - UAS PEMROGRAMAN DASAR (T1-B, Kelompok 5)
// Pengembangan dari proyek UTS "Kasir Kantin" (satu transaksi) menjadi
// aplikasi menu berulang (loop) dengan data menu disimpan di array.
//
// PROGRESS 2 mencakup:
//   - Struktur data (interface Menu dan Transaksi) + data awal (seed)
//   - Fungsi bertipe (parameter & return type)
//   - Fondasi materi UTS (operator, if, switch, nested, tipe data, const/let)
//   - Kerangka menu utama berulang sampai pengguna memilih keluar
//   - Fitur transaksi dari UTS tetap berjalan (kini memakai array dan keranjang
//     sehingga satu transaksi bisa berisi beberapa menu)
//   - Pembayaran berulang sampai berhasil (Tunai, QRIS, Debit dengan PIN) atau dibatalkan
//
// Blok Create, Read, Update, Delete, dan Search masih berupa kerangka dan
// akan diisi pada Progress 3 sampai 6.
// ============================================================================

import * as readline from "readline";

// ============================================================================
// BAGIAN A: PENGATURAN INPUT TERMINAL
// ============================================================================

// Membuat objek rl: input dari keyboard (stdin), output ke terminal (stdout)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ============================================================================
// BAGIAN B: STRUKTUR DATA (ENTITAS) DAN DATA AWAL
// ============================================================================

// Entitas Menu: satu objek mewakili satu menu yang dijual di kantin
interface Menu {
  id: string; // kode unik menu, contoh "M001"
  nama: string; // nama menu
  kategori: string; // kategori menu: "Makanan" atau "Minuman"
  harga: number; // harga per porsi (rupiah)
  stok: number; // jumlah stok yang tersedia
  tersedia: boolean; // status ketersediaan (true = dijual)
}

// Entitas ItemKeranjang: satu baris pesanan di dalam keranjang belanja
interface ItemKeranjang {
  menu: Menu; // menu yang dipesan (merujuk ke objek di daftarMenu)
  jumlah: number; // jumlah porsi yang dipesan
  subtotal: number; // harga x jumlah untuk baris ini
}

// Entitas Transaksi: menyimpan hasil satu kali transaksi untuk dicetak di struk
interface Transaksi {
  nomor: number; // nomor urut transaksi
  keranjang: ItemKeranjang[]; // seluruh menu yang dibeli pada transaksi ini
  total: number; // total belanja sebelum diskon
  diskon: number; // diskon dalam bentuk desimal (0.15 = 15%)
  totalBayar: number; // total yang harus dibayar setelah diskon
  metodeBayar: string; // nama metode pembayaran
  kembalian: number; // uang kembalian
  poin: number; // poin member yang didapat
  status: string; // status transaksi (selalu LUNAS karena struk hanya dicetak setelah bayar berhasil)
}

// Data awal (seed) menu: array of object, disimpan di memori
// (const karena variabel array tidak diganti, isinya boleh bertambah/berubah)
const daftarMenu: Menu[] = [
  { id: "M001", nama: "Nasi Goreng", kategori: "Makanan", harga: 15000, stok: 20, tersedia: true },
  { id: "M002", nama: "Mie Ayam", kategori: "Makanan", harga: 12000, stok: 20, tersedia: true },
  { id: "M003", nama: "Es Teh", kategori: "Minuman", harga: 5000, stok: 20, tersedia: true },
  { id: "M004", nama: "Air Mineral", kategori: "Minuman", harga: 3000, stok: 20, tersedia: true },
  { id: "M005", nama: "Ayam Geprek", kategori: "Makanan", harga: 18000, stok: 15, tersedia: true },
  { id: "M006", nama: "Soto Ayam", kategori: "Makanan", harga: 14000, stok: 0, tersedia: false },
];

// ATURAN TETAP (const karena nilainya tidak berubah)
const maksJumlah: number = 20; // batas maksimal jumlah pesanan
const batasDiskon: number = 50000; // total minimal untuk mendapat diskon
const poinTambahan: number = 10; // poin yang didapat member
const daftarPecahan: number[] = [100000, 50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50]; // pecahan uang untuk rincian kembalian

// VARIABEL SESI (let karena nilainya berubah selama program berjalan)
let jumlahTransaksi: number = 0; // jumlah transaksi yang sudah dibuat
let totalPendapatan: number = 0; // total uang yang diterima dari transaksi LUNAS
let totalPoin: number = 0; // total poin member yang terkumpul pada sesi ini

// ============================================================================
// SEMENTARA (langkah 1): kode uji agar blok ini bisa dijalankan sendiri.
// Bagian ini DIHAPUS pada langkah berikutnya.
// ============================================================================
console.log("Data awal dimuat: " + daftarMenu.length + " menu.");
rl.close();