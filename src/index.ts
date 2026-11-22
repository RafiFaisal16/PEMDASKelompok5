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

// TAHAP 1: Tampilkan menu dan input pesanan

function mulai(): void {
  // Menampilkan judul dan daftar menu beserta harga dan stok
  console.log("=== KASIR KANTIN ===");
  console.log("1. " + namaMenu1 + " - Rp" + hargaMenu1 + " (stok " + stokMenu1 + ")");
  console.log("2. " + namaMenu2 + " - Rp" + hargaMenu2 + " (stok " + stokMenu2 + ")");
  console.log("3. " + namaMenu3 + " - Rp" + hargaMenu3 + " (stok " + stokMenu3 + ")");
  console.log("4. " + namaMenu4 + " - Rp" + hargaMenu4 + " (stok " + stokMenu4 + ")");

  // Meminta input pilihan menu dari kasir
  rl.question("Pilih menu (1-4)  : ", (jawabMenu: string) => {
    // Mengubah jawaban menu (string) menjadi angka
    const pilihanMenu: number = Number(jawabMenu);

    // Meminta input jumlah pesanan
    rl.question("Jumlah pesanan    : ", (jawabJumlah: string) => {
      // Mengubah jawaban jumlah (string) menjadi angka
      jumlah = Number(jawabJumlah);

      // Meminta input status member
      rl.question("Member (y/n)      : ", (jawabMember: string) => {
        // Pembeli dianggap member jika menjawab y atau Y
        isMember = jawabMember === "y" || jawabMember === "Y";

        // Semua input selesai, lanjut memproses pesanan
        prosesPesanan(pilihanMenu);
      });
    });
  });
}

// TAHAP 2: Validasi, cek stok, diskon, total bayar, dan poin
function prosesPesanan(pilihanMenu: number): void {
  // IF 1: validasi jumlah (flowchart: Jumlah valid)
  // Jumlah tidak valid jika di luar 1 sampai 20 (memakai operator logika && dan !)
  if (!(jumlah >= 1 && jumlah <= maksJumlah)) {
    // Menampilkan pesan error lalu program selesai
    console.log("Pesan error: jumlah harus 1 sampai " + maksJumlah + ".");
    rl.close(); // menutup readline
    return; // keluar dari fungsi (program selesai)
  }

  // SWITCH 1: pilihan menu (flowchart: Pilihan menu?)
  switch (pilihanMenu) {
    case 1: // jika memilih menu nomor 1
      namaDipilih = namaMenu1; // simpan nama menu
      hargaDipilih = hargaMenu1; // simpan harga menu
      // NESTED IF 1: cek stok di dalam case (flowchart: Stok cukup?)
      if (stokMenu1 >= jumlah) {
        stokMenu1 -= jumlah; // kurangi stok sesuai jumlah (compound)
        total += hargaDipilih * jumlah; // tambahkan subtotal ke total (compound)
      } else {
        // Stok tidak cukup: tampilkan pesan error lalu selesai
        console.log("Pesan error: stok " + namaDipilih + " tidak cukup (sisa " + stokMenu1 + ").");
        rl.close(); // menutup readline
        return; // program selesai
      }
      break; // keluar dari switch

    case 2: // jika memilih menu nomor 2
      namaDipilih = namaMenu2; // simpan nama menu
      hargaDipilih = hargaMenu2; // simpan harga menu
      // NESTED IF 2: cek stok di dalam case
      if (stokMenu2 >= jumlah) {
        stokMenu2 -= jumlah; // kurangi stok
        total += hargaDipilih * jumlah; // tambahkan subtotal
      } else {
        // Stok tidak cukup
        console.log("Pesan error: stok " + namaDipilih + " tidak cukup (sisa " + stokMenu2 + ").");
        rl.close(); // menutup readline
        return; // program selesai
      }
      break; // keluar dari switch

    case 3: // jika memilih menu nomor 3
      namaDipilih = namaMenu3; // simpan nama menu
      hargaDipilih = hargaMenu3; // simpan harga menu
      // NESTED IF 3: cek stok di dalam case
      if (stokMenu3 >= jumlah) {
        stokMenu3 -= jumlah; // kurangi stok
        total += hargaDipilih * jumlah; // tambahkan subtotal
      } else {
        // Stok tidak cukup
        console.log("Pesan error: stok " + namaDipilih + " tidak cukup (sisa " + stokMenu3 + ").");
        rl.close(); // menutup readline
        return; // program selesai
      }
      break; // keluar dari switch

    case 4: // jika memilih menu nomor 4
      namaDipilih = namaMenu4; // simpan nama menu
      hargaDipilih = hargaMenu4; // simpan harga menu
      // NESTED IF 4: cek stok di dalam case
      if (stokMenu4 >= jumlah) {
        stokMenu4 -= jumlah; // kurangi stok
        total += hargaDipilih * jumlah; // tambahkan subtotal
      } else {
        // Stok tidak cukup
        console.log("Pesan error: stok " + namaDipilih + " tidak cukup (sisa " + stokMenu4 + ").");
        rl.close(); // menutup readline
        return; // program selesai
      }
      break; // keluar dari switch

    default: // jika nomor menu bukan 1 sampai 4
      console.log("Pesan error: menu tidak tersedia."); // tampilkan pesan error
      rl.close(); // menutup readline
      return; // program selesai
  }

  // IF 2: rantai diskon (flowchart: rantai diskon)
  if (isMember && total >= batasDiskon) {
    // Member dan total mencapai batas: diskon 15%
    diskon = 0.15;
  } else if (total >= batasDiskon) {
    // Bukan member tetapi total mencapai batas: diskon 10%
    diskon = 0.1;
  } else if (isMember) {
    // Member tetapi total belum mencapai batas: diskon 5%
    diskon = 0.05;
  } else {
    // Selain itu tidak ada diskon
    diskon = 0;
  }

  // Menghitung total bayar = total - (total x diskon)
  totalBayar = total - total * diskon;

  // IF 3: poin untuk member (flowchart: Member?)
  if (isMember) {
    poin += poinTambahan; // member mendapat tambahan poin (compound)
  }

  // Menampilkan ringkasan sebelum pembayaran
  console.log("");
  console.log("Total belanja      : Rp" + total);
  console.log("Diskon             : " + diskon * 100 + "%");
  console.log("Total bayar        : Rp" + totalBayar);

  // TAHAP 3: input metode bayar
  console.log("Metode bayar: 1. Tunai  2. QRIS  3. Debit");
  rl.question("Pilih metode bayar : ", (jawabMetode: string) => {
    // Mengubah jawaban menjadi angka lalu lanjut ke proses pembayaran
    prosesPembayaran(Number(jawabMetode));
  });
}

// TAHAP 3: Proses pembayaran sesuai metode bayar

function prosesPembayaran(pilihanBayar: number): void {
  // SWITCH 2: metode bayar (flowchart: Metode bayar?)
  switch (pilihanBayar) {
    case 1: // metode Tunai
      metodeBayar = "Tunai"; // simpan nama metode
      // Meminta input uang yang dibayarkan
      rl.question("Uang dibayar      : ", (jawabUang: string) => {
        uang = Number(jawabUang); // ubah jawaban menjadi angka
        // NESTED IF 5: cek uang di dalam case (flowchart: Uang cukup?)
        if (uang >= totalBayar) {
          kembalian = uang - totalBayar; // hitung kembalian
          lunas = true; // pembayaran berhasil
        } else {
          console.log("Pesan: uang kurang."); // uang tidak cukup
          lunas = false; // pembayaran gagal
        }
        // Semua jalur bertemu di tahap 4
        selesaiTransaksi();
      });
      break; // keluar dari switch

    case 2: // metode QRIS
      metodeBayar = "QRIS"; // simpan nama metode
      lunas = true; // QRIS dianggap langsung berhasil
      selesaiTransaksi(); // lanjut ke tahap 4
      break; // keluar dari switch

    case 3: // metode Debit
      metodeBayar = "Debit"; // simpan nama metode
      lunas = true; // Debit dianggap langsung berhasil
      selesaiTransaksi(); // lanjut ke tahap 4
      break; // keluar dari switch

    default: // jika metode bayar tidak tersedia
      metodeBayar = "-"; // tidak ada metode
      console.log("Pesan error: metode bayar tidak tersedia."); // tampilkan pesan error
      lunas = false; // pembayaran gagal
      selesaiTransaksi(); // lanjut ke tahap 4
      break; // keluar dari switch
  }
}

// TAHAP 4: Status transaksi dan cetak struk

function selesaiTransaksi(): void {
  // IF 4: status transaksi (flowchart: lunas = true?)
  if (lunas) {
    status = "LUNAS"; // pembayaran berhasil
  } else {
    status = "TIDAK LUNAS"; // pembayaran gagal
  }

  // Mencetak struk pembelian
  console.log("");
  console.log("========== STRUK ==========");
  console.log("Menu         : " + namaDipilih);
  console.log("Harga        : Rp" + hargaDipilih);
  console.log("Jumlah       : " + jumlah);
  console.log("Total        : Rp" + total);
  console.log("Diskon       : " + diskon * 100 + "%");
  console.log("Total bayar  : Rp" + totalBayar);
  console.log("Metode bayar : " + metodeBayar);
  console.log("Kembalian    : Rp" + kembalian);
  console.log("Poin         : " + poin);
  console.log("Status       : " + status);
  console.log("===========================");

  // Menutup readline sebagai akhir program (flowchart: Selesai)
  rl.close();
}

// Menjalankan program dari tahap 1
mulai();