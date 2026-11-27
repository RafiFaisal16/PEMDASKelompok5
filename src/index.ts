// ============================================================================
// BAGIAN F: PROSES TRANSAKSI (DARI UTS, SEKARANG ADA KERANJANG)
// ============================================================================

// Fungsi buat nyetak struk dari data transaksi (void)
function cetakStruk(t: Transaksi): void {
  // Ngitung hemat per porsi: total potongan dibagi jumlah semua porsi
  let hematPerPorsi: number = t.total - t.totalBayar; // total potongan dulu
  hematPerPorsi /= hitungTotalPorsi(t.keranjang); // lalu dibagi jumlah porsi (operator /=)
  console.log(""); // baris kosong
  console.log("========== STRUK #" + t.nomor + " =========="); // judul struk
  // Tulis isi keranjang satu per satu: nama, jumlah, harga satuan, subtotal
  for (const item of t.keranjang) {
    console.log(item.menu.nama + " x" + item.jumlah + " @" + formatRupiah(item.menu.harga) + " = " + formatRupiah(item.subtotal));
  }
  console.log(buatGaris(31, "-")); // garis pemisah isi pesanan dan rincian biaya
  console.log("Total        : " + formatRupiah(t.total)); // total sebelum diskon
  console.log("Diskon       : " + Math.round(t.diskon * 100) + "%"); // diskon dalam persen
  console.log("Hemat/porsi  : " + formatRupiah(Math.round(hematPerPorsi))); // hemat tiap porsi
  console.log("Total bayar  : " + formatRupiah(t.totalBayar)); // yang harus dibayar
  console.log("Metode bayar : " + t.metodeBayar); // dibayar pakai apa
  console.log("Kembalian    : " + formatRupiah(t.kembalian)); // uang kembalian
  console.log("Poin         : " + t.poin); // poin yang didapat
  console.log("Status       : " + t.status); // status transaksi
  console.log("==============================="); // garis penutup struk
}

// Fungsi buat bayar pakai Debit. PIN diketik pelanggan sendiri di mesin EDC,
// jadi program ini tidak tahu PIN-nya. Kasir cuma ngisi hasilnya: PIN benar atau salah.
// Hasilnya true kalau PIN benar, false kalau pelanggan memilih ganti metode bayar.
async function cekPinDebit(): Promise<boolean> {
  // Ulangi terus sampai PIN benar atau pelanggan memilih ganti metode
  while (true) {
    console.log("Pelanggan memasukkan PIN di mesin EDC.");
    const jawab: string = await tanya("PIN benar menurut mesin EDC (y/n) : ");
    // IF: PIN dianggap benar kalau kasir jawab y atau Y
    if (jawab === "y" || jawab === "Y") {
      return true; // PIN benar, bayar Debit berhasil
    }
    console.log("Pesan error: PIN salah.");
    const pilih: string = await tanya("1. Coba lagi  2. Ganti metode bayar : ");
    // IF: kalau pilih 2 berarti balik ke pilihan metode bayar
    if (pilih === "2") {
      return false; // bayar Debit tidak jadi
    }
  }
}

// Fungsi buat 1 kali transaksi dari awal sampai struk: isi keranjang, hitung total, bayar, cetak struk
async function prosesTransaksi(): Promise<void> {
  // TAHAP 1: tampilkan menu, pilih menu dan jumlah, masukkan ke keranjang
  const keranjang: ItemKeranjang[] = []; // keranjang kosong buat transaksi ini
  let lanjutPesan: boolean = true; // true berarti masih mau nambah pesanan

  // Ulangi terus selama pembeli masih mau nambah pesanan
  while (lanjutPesan) {
    tampilPilihanMenu(); // tampilkan daftar makanan dan minuman
    const idPilih: string = await tanya("ID menu (0 = batal)  : "); // pembeli ngetik id menu

    // IF 2: kalau ngetik 0 berarti transaksi dibatalkan (belum ada stok yang berubah)
    if (idPilih === "0") {
      console.log("Transaksi dibatalkan.");
      return; // keluar dari transaksi, balik ke menu utama
    }

    const jumlah: number = Number(await tanya("Jumlah pesanan       : ")); // ngetik jumlah, diubah jadi angka

    // IF 3: cek jumlah valid atau tidak (kondisinya lebih dari satu: &&, ||, !)
    // Tidak valid kalau di luar 1 sampai 20, atau bukan bilangan bulat
    if (!(jumlah >= 1 && jumlah <= maksJumlah) || jumlah % 1 !== 0) {
      console.log("Pesan error: jumlah harus bilangan bulat 1 sampai " + maksJumlah + ".");
      continue; // ulang dari awal, tampilkan menu lagi
    }

    // Cari menu yang id-nya sama dengan yang diketik pembeli
    const menu: Menu | undefined = cariMenuById(idPilih);

    // IF 4 (rantai if / else if): cek menunya ada dan masih tersedia
    if (menu === undefined) {
      // Id tidak ada di daftarMenu
      console.log("Pesan error: menu dengan ID \"" + idPilih + "\" tidak ditemukan.");
      continue; // ulang dari awal
    } else if (!menu.tersedia || menu.stok === 0) {
      // Menu tidak dijual atau stoknya habis
      console.log("Pesan error: menu " + menu.nama + " tidak tersedia.");
      continue; // ulang dari awal
    }

    // Cek apakah menu yang sama sudah ada di keranjang (pakai find)
    const itemAda: ItemKeranjang | undefined = keranjang.find((item: ItemKeranjang) => item.menu.id === menu.id);
    // Berapa porsi menu ini yang sudah ada di keranjang (0 kalau belum ada)
    const sudahDipesan: number = itemAda === undefined ? 0 : itemAda.jumlah;

    // IF 5: cek stok cukup atau tidak, hitung dari yang sudah di keranjang ditambah pesanan baru
    if (menu.stok < sudahDipesan + jumlah) {
      console.log("Pesan error: stok " + menu.nama + " tidak cukup (sisa " + menu.stok + ", di keranjang " + sudahDipesan + ").");
      continue; // ulang dari awal
    }

    // Masukkan pesanan ke keranjang
    if (itemAda !== undefined) {
      // Menu sudah ada di keranjang: jumlahnya ditambah, subtotal dihitung ulang
      itemAda.jumlah += jumlah;
      itemAda.subtotal = hitungSubtotal(menu.harga, itemAda.jumlah);
    } else {
      // Menu belum ada di keranjang: tambah baris baru pakai push
      keranjang.push({ menu: menu, jumlah: jumlah, subtotal: hitungSubtotal(menu.harga, jumlah) });
    }
    console.log("Ditambahkan ke keranjang: " + menu.nama + " x" + jumlah); // kabari pembeli
    tampilKeranjang(keranjang); // tampilkan isi keranjang sekarang

    // Tanya apakah mau nambah pesanan lagi
    const jawabTambah: string = await tanya("Tambah pesanan lagi (y/n) : ");
    lanjutPesan = jawabTambah === "y" || jawabTambah === "Y"; // y atau Y = lanjut, selain itu berhenti
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

// ============================================================================
// SEMENTARA (langkah 3): kode percobaan biar bagian ini bisa dijalankan sendiri.
// Bagian ini DIHAPUS di langkah berikutnya.
// ============================================================================
prosesTransaksi().then(() => { // coba jalankan 1 transaksi saja
  rl.close(); // tutup input setelah transaksi selesai
});