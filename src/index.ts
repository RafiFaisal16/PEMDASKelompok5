// BAGIAN C: FUNGSI BANTU (INPUT, TAMPILAN, PENCARIAN)

// Fungsi buat nanya sesuatu ke pengguna lalu mengembalikan jawabannya (berupa string).
// Spasi di depan dan belakang jawaban dibuang biar rapi
function tanya(pertanyaan: string): Promise<string> {
  return new Promise<string>((selesai) => {
    // Tampilkan pertanyaan, lalu tunggu pengguna ngetik dan tekan Enter
    rl.question(pertanyaan, (jawaban: string) => {
      selesai(jawaban.trim()); // kirim balik jawaban yang sudah dirapikan
    });
  });
}

// Fungsi buat nampilin pilihan menu utama (void)
function tampilMenuUtama(): void {
  console.log("");
  console.log(buatGaris(32, "=")); // garis atas
  console.log("        KASIR KANTIN"); // judul program
  console.log(buatGaris(32, "=")); // garis bawah judul
  console.log("1. Tambah menu (Create)");
  console.log("2. Lihat menu (Read)");
  console.log("3. Ubah menu (Update)");
  console.log("4. Hapus menu (Delete)");
  console.log("5. Cari menu (Search)");
  console.log("6. Transaksi pembelian");
  console.log("0. Keluar");
  console.log(buatGaris(32, "-")); // garis penutup
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

  // Ulangi menu selama berjalan masih true
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

  // TAHAP 2: hitung total, diskon, dan poin
  const jawabMember: string = await tanya("Member (y/n)         : "); // tanya pembeli member atau bukan
  // Dianggap member kalau jawabnya y atau Y
  const isMember: boolean = jawabMember === "y" || jawabMember === "Y";

  const total: number = hitungTotalKeranjang(keranjang); // total belanja semua isi keranjang
  const diskon: number = tentukanDiskon(isMember, total); // diskonnya 0%, 5%, 10%, atau 15%
  const totalBayar: number = hitungTotalBayar(total, diskon); // total setelah dipotong diskon

  // Poin dari transaksi ini (pakai let karena bisa bertambah)
  let poin: number = 0;
  // IF 6: poin cuma buat member
  if (isMember) {
    poin += poinTambahan; // member dapat tambahan poin (operator +=)
  }

  // Tampilkan ringkasan sebelum bayar
  console.log("");
  console.log("Total belanja      : " + formatRupiah(total));
  console.log("Diskon             : " + Math.round(diskon * 100) + "%");
  console.log("Total bayar        : " + formatRupiah(totalBayar));

  // TAHAP 3: pembayaran, diulang terus sampai lunas atau transaksi dibatalkan
  let metodeBayar: string = ""; // nama metode bayar yang akhirnya dipakai
  let kembalian: number = 0; // uang kembalian
  let lunas: boolean = false; // true kalau pembayaran sudah berhasil
  let dibatalkan: boolean = false; // true kalau pembeli memilih batal

  // Ulangi pilih metode bayar selama belum lunas dan belum dibatalkan
  while (!lunas && !dibatalkan) {
    console.log("");
    console.log("Metode bayar: 1. Tunai  2. QRIS  3. Debit  0. Batal transaksi");
    const pilihanBayar: number = Number(await tanya("Pilih metode bayar   : ")); // pilihan diubah jadi angka

    // SWITCH 1: pilih cara bayar (4 case + default, tiap case diakhiri break)
    switch (pilihanBayar) {
      case 1: // bayar Tunai
        metodeBayar = "Tunai";
        {
          const uang: number = Number(await tanya("Uang dibayar        : ")); // uang dari pembeli
          // NESTED (if di dalam if di dalam switch): switch (tingkat 1) -> if (tingkat 2) -> if (tingkat 3)
          if (uang >= totalBayar) {
            kembalian = uang - totalBayar; // uang cukup, hitung kembaliannya
            lunas = true; // pembayaran berhasil
            if (kembalian > 0) {
              // Ada kembalian: tampilkan rincian pecahannya
              tampilRincianKembalian(kembalian);
            }
          } else {
            // Uang kurang: pembeli diminta pilih metode bayar lagi
            console.log("Pesan: uang kurang, silakan pilih metode bayar lagi.");
          }
        }
        break; // selesai case 1, keluar dari switch

      case 2: // bayar QRIS
        metodeBayar = "QRIS";
        lunas = true; // QRIS langsung dianggap berhasil
        break; // selesai case 2, keluar dari switch

      case 3: // bayar Debit
        metodeBayar = "Debit";
        {
          // Tanya hasil PIN dari mesin EDC (diulang di dalam fungsi sampai benar atau ganti metode)
          const pinBenar: boolean = await cekPinDebit();
          // IF: Debit berhasil cuma kalau PIN benar
          if (pinBenar) {
            lunas = true; // pembayaran berhasil
          } else {
            console.log("Kembali ke pilihan metode bayar.");
          }
        }
        break; // selesai case 3, keluar dari switch

      case 0: // batal transaksi
        dibatalkan = true; // bikin perulangan pembayaran berhenti
        break; // selesai case 0, keluar dari switch

      default: // pilihan metode bayar tidak ada
        console.log("Pesan error: metode bayar tidak tersedia.");
        break; // keluar dari switch
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
    nomor: jumlahTransaksi, // nomor struk
    keranjang: keranjang, // isi belanjaan
    total: total, // total sebelum diskon
    diskon: diskon, // diskon yang didapat
    totalBayar: totalBayar, // total yang dibayar
    metodeBayar: metodeBayar, // cara bayar
    kembalian: kembalian, // uang kembalian
    poin: poin, // poin yang didapat
    status: "LUNAS", // struk cuma dicetak kalau sudah bayar, jadi pasti LUNAS
  };
  cetakStruk(transaksi); // cetak struknya
}
