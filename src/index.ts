import * as readline from "readline";
//digunakan untuk mengimpor module readline dari node.js, yang memungkinkan program membaca input dari pengguna

// Bikin "rl" buat baca ketikan (input) dan nampilin tulisan (output) di terminal
const rl = readline.createInterface({
  input: process.stdin, // input datang dari keyboard
  output: process.stdout, // output keluar ke layar terminal
});

// Menu: bentuk data untuk 1 menu di kantin, bisa makanan atau minuman
// Jadi tiap menu pasti punya id, nama, kategori, harga, stok, dan status tersedia
interface Menu {
  id: string; // kode menu biar tidak ketuker, contoh "M001"
  nama: string; // nama menunya, contoh "Nasi Goreng"
  kategori: string; // jenis menunya: "Makanan" atau "Minuman"
  harga: number; // harga 1 porsi (rupiah)
  stok: number; // sisa stok yang masih ada
  tersedia: boolean; // true kalau menu masih dijual, false kalau tidak dijual
}

// ItemKeranjang: 1 baris isi keranjang, misalnya "Es Teh 2 gelas".
// Isinya menu yang dipilih, berapa banyak, dan harganya (subtotal).
interface ItemKeranjang {
  menu: Menu; // menu yang dipesan (ambil dari daftarMenu)
  jumlah: number; // berapa porsi yang dipesan
  subtotal: number; // harga menu dikali jumlah
}

// Transaksi: catatan 1 kali belanja, nanti dipakai buat nulis struk
interface Transaksi {
  nomor: number; // nomor urut transaksi
  keranjang: ItemKeranjang[]; // semua menu yang dibeli di transaksi ini
  total: number; // total belanja sebelum diskon
  diskon: number; // diskon dalam bentuk desimal (0.15 artinya 15%)
  totalBayar: number; // total yang harus dibayar setelah diskon
  metodeBayar: string; // dibayar pakai apa (Tunai, QRIS, atau Debit)
  kembalian: number; // uang kembalian
  poin: number; // poin yang didapat kalau pembeli member
  status: string; // status transaksi, selalu LUNAS karena struk baru dicetak kalau sudah bayar
}

// Data awal menu. Ini array yang isinya banyak objek menu (makanan dan minuman).
// Pakai const karena arraynya tidak diganti, tapi isinya tetap boleh ditambah atau diubah.
const daftarMenu: Menu[] = [
  { id: "M001", nama: "Nasi Goreng", kategori: "Makanan", harga: 15000, stok: 20, tersedia: true }, // makanan pertama
  { id: "M002", nama: "Mie Ayam", kategori: "Makanan", harga: 12000, stok: 20, tersedia: true }, // makanan kedua
  { id: "M003", nama: "Es Teh", kategori: "Minuman", harga: 5000, stok: 20, tersedia: true }, // minuman pertama
  { id: "M004", nama: "Air Mineral", kategori: "Minuman", harga: 3000, stok: 20, tersedia: true }, // minuman kedua
  { id: "M005", nama: "Ayam Geprek", kategori: "Makanan", harga: 18000, stok: 15, tersedia: true }, // makanan ketiga
  { id: "M006", nama: "Soto Ayam", kategori: "Makanan", harga: 14000, stok: 0, tersedia: false }, // stok kosong, buat ngetes menu tidak tersedia
];

// ATURAN TOKO (pakai const karena nilainya tetap, tidak berubah-ubah)
const maksJumlah: number = 20; // paling banyak beli 20 porsi per menu
const batasDiskon: number = 50000; // belanja minimal 50rb baru dapat diskon
const poinTambahan: number = 10; // poin yang didapat member tiap transaksi
const daftarPecahan: number[] = [100000, 50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50]; // pecahan uang buat nampilin rincian kembalian

// DATA SELAMA PROGRAM JALAN (pakai let karena nilainya terus berubah)
let jumlahTransaksi: number = 0; // sudah berapa transaksi yang selesai
let totalPendapatan: number = 0; // total uang yang masuk dari transaksi yang lunas
let totalPoin: number = 0; // total poin member yang terkumpul
