import * as readline from "readline";

// Membuat objek rl: input dari keyboard (stdin), output ke terminal (stdout)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// DATA MENU (const karena nilainya tetap)
const namaMenu1: string = "Nasi Goreng"; // nama menu nomor 1
const hargaMenu1: number = 15000; // harga menu nomor 1
const namaMenu2: string = "Mie Ayam"; // nama menu nomor 2
const hargaMenu2: number = 12000; // harga menu nomor 2
const namaMenu3: string = "Es Teh"; // nama menu nomor 3
const hargaMenu3: number = 5000; // harga menu nomor 3
const namaMenu4: string = "Air Mineral"; // nama menu nomor 4
const hargaMenu4: number = 3000; // harga menu nomor 4

// ATURAN TETAP (const)
const maksJumlah: number = 20; // batas maksimal jumlah pesanan
const batasDiskon: number = 50000; // total minimal untuk mendapat diskon
const poinTambahan: number = 10; // poin yang didapat member

// STOK MENU (let karena nilainya berubah)
let stokMenu1: number = 20; // stok Nasi Goreng
let stokMenu2: number = 20; // stok Mie Ayam
let stokMenu3: number = 20; // stok Es Teh
let stokMenu4: number = 20; // stok Air Mineral

// VARIABEL TRANSAKSI (let karena nilainya berubah)
let namaDipilih: string = ""; // nama menu yang dipilih pembeli
let hargaDipilih: number = 0; // harga menu yang dipilih pembeli
let jumlah: number = 0; // jumlah pesanan
let isMember: boolean = false; // status member (true = member)
let total: number = 0; // total belanja sebelum diskon
let diskon: number = 0; // besar diskon dalam bentuk desimal (0.15 = 15%)
let totalBayar: number = 0; // total yang harus dibayar setelah diskon
let poin: number = 0; // poin yang didapat
let metodeBayar: string = ""; // nama metode pembayaran
let uang: number = 0; // uang tunai yang dibayarkan
let kembalian: number = 0; // uang kembalian
let lunas: boolean = false; // status pembayaran (true = berhasil)
let status: string = ""; // status transaksi (LUNAS / TIDAK LUNAS)