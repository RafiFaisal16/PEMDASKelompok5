// BAGIAN G: MENU UTAMA (MUTER TERUS SAMPAI PENGGUNA PILIH KELUAR)

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

  // Perulangan sudah berhenti: tampilkan ringkasan lalu tutup readline
  tampilRingkasanAkhir();
  rl.close();
}

// Jalankan programnya. Kalau ada error yang tidak terduga, tampilkan pesannya lalu tutup readline
jalankanAplikasi().catch((kesalahan: unknown) => {
  console.log("Terjadi kesalahan: " + String(kesalahan));
  rl.close();
});
