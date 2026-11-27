// BAGIAN F: PROSES TRANSAKSI
// BAGIAN G: MENU UTAMA (MUTER TERUS SAMPAI PENGGUNA PILIH KELUAR)

// Fungsi buat nampilin pilihan menu utama (void)
function tampilMenuUtama(): void {
  console.log("");
  console.log(buatGaris(32, "=")); // garis atas.
  console.log("        KASIR KANTIN"); // judul program.
  console.log(buatGaris(32, "=")); // garis bawah judul.
  console.log("1. Tambah menu (Create)");
  console.log("2. Lihat menu (Read)");
  console.log("3. Ubah menu (Update)");
  console.log("4. Hapus menu (Delete)");
  console.log("5. Cari menu (Search)");
  console.log("6. Transaksi pembelian");
  console.log("0. Keluar");
  console.log(buatGaris(32, "-")); // garis penutup
}

// Fungsi buat bayar pakai debit. PIN diketik pelanggan sendiri di mesin EDC,
// jadi program ini tidak tahu PIN-nya. Kasir cuma ngisi hasilnya: PIN benar atau salah.
// Hasilnya true kalau PIN benar, false kalau pelanggan memilih ganti metode bayar.
async function cekPinDebit(): Promise<boolean> {
  // Ulangi terus sampai PIN benar atau pelanggan memilih ganti metode
  while (true) {
    console.log("Pelanggan memasukkan PIN di mesin EDC.");
    const jawab: string = await tanya("PIN benar menurut mesin EDC (y/n) : ");
    // IF: PIN dianggap benar kalau kasir jawab y atau Y.
    if (jawab === "y" || jawab === "Y") {
      return true; // PIN benar, bayar Debit berhasil.
    }
    console.log("Pesan error: PIN salah.");
    const pilih: string = await tanya("1. Coba lagi  2. Ganti metode bayar : ");
    // IF: kalau pilih 2 berarti balik ke pilihan metode bayar.
    if (pilih === "2") {
      return false; // bayar Debit tidak jadi.
    }
  }
}

// Fungsi buat 1 kali transaksi dari awal sampai struk: isi keranjang, hitung total, bayar, cetak struk
async function prosesTransaksi(): Promise<void> {
  // TAHAP 1: tampilkan menu, pilih menu dan jumlah, masukkan ke keranjang
  const keranjang: ItemKeranjang[] = []; // keranjang kosong buat transaksi ini
  let lanjutPesan: boolean = true; // true berarti masih mau nambah pesanan

  // Ulangi terus selama pembeli masih mau nambah pesanan.
  while (lanjutPesan) {
    tampilPilihanMenu(); // tampilkan daftar makanan dan minuman
    const idPilih: string = await tanya("ID menu (0 = batal)  : "); // pembeli ngetik id menu

    // IF 2: kalau ngetik 0 berarti transaksi dibatalkan (belum ada stok yang berubah)
    if (idPilih === "0") {
      console.log("Transaksi dibatalkan.");
      return; // keluar dari transaksi, balik ke menu utama
    }
// Fungsi buat nampilin ringkasan saat pengguna keluar dari program (void)
function tampilRingkasanAkhir(): void {
  console.log("");
  console.log("Jumlah transaksi : " + jumlahTransaksi); // berapa transaksi yang selesai
  console.log("Total pendapatan : " + formatRupiah(totalPendapatan)); // total uang masuk
  console.log("Total poin member: " + totalPoin); // total poin member
  console.log("Sisa stok akhir  :");
  // Tampilkan sisa stok tiap menu pakai forEach
  daftarMenu.forEach((menu: Menu) => {
    console.log("  " + menu.id + " " + menu.nama + ": " + menu.stok);
  });
  console.log("Terima kasih, program selesai.");
}

// Fungsi utama: nampilin menu utama terus-terusan sampai pengguna pilih 0 (keluar)
async function jalankanAplikasi(): Promise<void> {
  let berjalan: boolean = true; // true = program masih jalan, false = mau keluar

  // Ulangi menu selama berjalan masih true.
  while (berjalan) {
    tampilMenuUtama(); // tampilkan pilihan menu
    const jawab: string = await tanya("Pilih menu (0-6) : "); // pengguna ngetik pilihan

    // IF 8: pilihan kosong ditolak, soalnya Number("") hasilnya 0 dan bisa dikira pilih keluar
    if (jawab === "") {
      console.log("Pesan error: pilihan tidak boleh kosong.");
      continue; // ulang dari awal, tampilkan menu lagi
    }

    // Ubah jawaban (tulisan) jadi angka. Kalau yang diketik huruf hasilnya NaN dan masuk default
    const pilihan: number = Number(jawab);

    // SWITCH 2: pilih menu utama (6 case + 1 keluar + default)
    switch (pilihan) {
      case 1: // Create (tambah menu)
        fiturBelumTersedia("Tambah Menu (Create)", 3);
        break;
      case 2: // Read (lihat menu)
        fiturBelumTersedia("Lihat Menu (Read)", 4);
        break;
      case 3: // Update (ubah menu)
        fiturBelumTersedia("Ubah Menu (Update)", 5);
        break;
      case 4: // Delete (hapus menu)
        fiturBelumTersedia("Hapus Menu (Delete)", 5);
        break;
      case 5: // Search (cari menu)
        fiturBelumTersedia("Cari Menu (Search)", 6);
        break;
      case 6: // transaksi pembelian (kode dari UTS)
        await prosesTransaksi();
        break;
      case 0: // keluar dari program
        berjalan = false; // bikin perulangan while berhenti
        break;
      default: // angka di luar 0 sampai 6, atau bukan angka
        console.log("Pesan error: pilihan menu tidak valid, masukkan angka 0 sampai 6.");
        break;
    }
  }

  // IF: kalau dibatalkan, stok, pendapatan, dan poin tidak berubah
  if (dibatalkan) {
    console.log("Transaksi dibatalkan.");
    return; // balik ke menu utama
  }

  // TAHAP 4: pembayaran berhasil, update data lalu cetak struk
  // Kurangi stok tiap menu yang ada di keranjang
  for (const item of keranjang) {
    item.menu.stok -= item.jumlah; // stok berkurang sebanyak yang dibeli (operator -=)
  }
  totalPendapatan += totalBayar; // tambahkan ke total pendapatan
  totalPoin += poin; // tambahkan ke total poin

  // Naikkan nomor transaksi lalu siapkan data buat struk
  jumlahTransaksi = jumlahTransaksi + 1; // operator + (penjumlahan), nomor transaksi naik 1
  const transaksi: Transaksi = {
    nomor: jumlahTransaksi, // nomor struk.
    keranjang: keranjang, // isi belanjaan.
    total: total, // total sebelum diskon.
    diskon: diskon, // diskon yang didapat.
    totalBayar: totalBayar, // total yang dibayar
    metodeBayar: metodeBayar, // cara bayar
    kembalian: kembalian, // uang kembalian
    poin: poin, // poin yang didapat
    status: "LUNAS", // struk cuma dicetak kalau sudah bayar/lunas, jadi pasti LUNAS
  };
  cetakStruk(transaksi); // cetak struknya.
}
  // Perulangan sudah berhenti: tampilkan ringkasan lalu tutup readline
  tampilRingkasanAkhir();
  rl.close();
}

// Jalankan programnya. Kalau ada error yang tidak terduga, tampilkan pesannya lalu tutup readline
jalankanAplikasi().catch((kesalahan: unknown) => {
  console.log("Terjadi kesalahan: " + String(kesalahan));
  rl.close();
});
