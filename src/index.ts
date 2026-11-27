// BAGIAN C: FUNGSI BANTU (INPUT, TAMPILAN, PENCARIAN)

// Fungsi buat nanya sesuatu ke pengguna lalu mengembalikan jawabannya (berupa string).
// Spasi di depan dan belakang jawaban dibuang biar rapi.
function tanya(pertanyaan: string): Promise<string> {
  return new Promise<string>((selesai) => {
    // Tampilkan pertanyaan, lalu tunggu pengguna ngetik dan tekan Enter
    rl.question(pertanyaan, (jawaban: string) => {
      selesai(jawaban.trim()); // kirim balik jawaban yang sudah dirapikan
    });
  });
}

// Fungsi buat bikin garis pemisah, misalnya "=====" sepanjang sekian karakter.
// Dibuat pakai perulangan for.
function buatGaris(panjang: number, simbol: string): string {
  let garis: string = ""; // awalnya garisnya kosong
  // Ulangi sebanyak "panjang", tiap putaran tambah satu simbol
  for (let i = 0; i < panjang; i++) {
    garis += simbol; // tambah simbol ke belakang garis (operator +=)
  }
  return garis; // kasih balik garis yang sudah jadi
}

// Fungsi buat ngubah angka jadi tulisan rupiah, contoh 15000 jadi "Rp15.000"
function formatRupiah(angka: number): string {
  return "Rp" + angka.toLocaleString("id-ID"); // titik pemisah ribuan ikut format Indonesia
}

// Arrow function buat ngitung subtotal = harga dikali jumlah
const hitungSubtotal = (harga: number, jumlah: number): number => harga * jumlah;

// Fungsi buat nyari 1 menu di daftarMenu berdasarkan id-nya.
// Hasilnya bisa Menu (ketemu) atau undefined (tidak ketemu).
// Huruf besar atau kecil tidak masalah, jadi "m001" tetap ketemu.
function cariMenuById(id: string): Menu | undefined {
  return daftarMenu.find((menu: Menu) => menu.id === id.trim().toUpperCase());
}

// Fungsi buat nampilin daftar menu (makanan dan minuman) yang bisa dipesan.
// Tidak butuh parameter dan tidak mengembalikan apa-apa (void).
function tampilPilihanMenu(): void {
  console.log(""); // baris kosong biar tampilannya tidak dempet
  console.log(buatGaris(60, "=")); // garis atas
  console.log("DAFTAR MENU KANTIN"); // judul
  console.log(buatGaris(60, "=")); // garis bawah judul
  // Ambil menu satu per satu dari daftarMenu pakai for...of
  for (const menu of daftarMenu) {
    // Kalau tersedia tulis "Tersedia", kalau tidak tulis "Habis"
    const keterangan: string = menu.tersedia ? "Tersedia" : "Habis";
    // Tampilkan 1 baris data menu: id, nama, kategori, harga, stok, dan keterangan
    console.log(
      menu.id + " | " + menu.nama.padEnd(12) + " | " + menu.kategori.padEnd(8) +
      " | " + formatRupiah(menu.harga).padEnd(9) + " | stok " + menu.stok + " | " + keterangan
    );
  }
  console.log(buatGaris(60, "-")); // garis penutup daftar
}

// Fungsi buat ngejumlahin semua subtotal di keranjang, hasilnya total belanja
function hitungTotalKeranjang(keranjang: ItemKeranjang[]): number {
  let total: number = 0; // mulai dari 0
  // Ambil isi keranjang satu per satu
  for (const item of keranjang) {
    total += item.subtotal; // tambahkan subtotal tiap baris ke total
  }
  return total; // kasih balik totalnya
}

// Fungsi buat ngitung ada berapa porsi semuanya di keranjang
function hitungTotalPorsi(keranjang: ItemKeranjang[]): number {
  let porsi: number = 0; // mulai dari 0
  // Pakai forEach: jalan ke tiap baris keranjang
  keranjang.forEach((item: ItemKeranjang) => {
    porsi += item.jumlah; // tambahkan jumlah porsi tiap baris
  });
  return porsi; // kasih balik jumlah porsinya
}

// Fungsi buat nampilin isi keranjang dan total sementaranya (void)
function tampilKeranjang(keranjang: ItemKeranjang[]): void {
  console.log("--- Isi keranjang ---");
  // Tampilkan tiap menu di keranjang beserta jumlah dan subtotalnya
  for (const item of keranjang) {
    console.log(item.menu.nama + " x" + item.jumlah + " = " + formatRupiah(item.subtotal));
  }
  // Tampilkan total sementara dari semua isi keranjang
  console.log("Total sementara: " + formatRupiah(hitungTotalKeranjang(keranjang)));
}

// ============================================================================
// BAGIAN D: FUNGSI PERHITUNGAN TRANSAKSI (DARI UTS)
// ============================================================================

// Fungsi buat nentuin diskon dari status member dan total belanja.
// Hasilnya angka desimal, contoh 0.15 artinya 15%.
function tentukanDiskon(isMember: boolean, total: number): number {
  // IF 1 (satu rantai if / else if / else dihitung 1): cari diskon yang cocok
  if (isMember && total >= batasDiskon) {
    // Member DAN belanjanya sudah mencapai batas (2 kondisi sekaligus pakai &&): diskon 15%
    return 0.15;
  } else if (total >= batasDiskon) {
    // Bukan member, tapi belanjanya sudah mencapai batas: diskon 10%
    return 0.1;
  } else if (isMember) {
    // Member, tapi belanjanya belum mencapai batas: diskon 5%
    return 0.05;
  } else {
    // Bukan member dan belanjanya belum mencapai batas: tidak ada diskon
    return 0;
  }
}

// Fungsi buat ngitung total yang harus dibayar setelah dipotong diskon
function hitungTotalBayar(total: number, diskon: number): number {
  let potongan: number = total; // awalnya sama dengan total dulu
  potongan *= diskon; // dikali diskon, jadinya nominal potongannya (operator *=)
  return Math.round(total - potongan); // total dikurang potongan, dibulatkan biar tidak ada koma aneh
}

// Fungsi buat nampilin rincian pecahan uang kembalian (void).
// Contoh kembalian 35000 jadi 1 x 20000, 1 x 10000, 1 x 5000.
function tampilRincianKembalian(kembalian: number): void {
  let sisa: number = kembalian; // sisa uang yang belum dipecah, awalnya semua kembalian
  console.log("Rincian kembalian " + formatRupiah(kembalian) + ":");
  // Cek pecahan dari yang paling besar sampai paling kecil
  for (const pecahan of daftarPecahan) {
    // Pecahan ini dipakai kalau sisa uangnya masih cukup
    if (sisa >= pecahan) {
      const banyak: number = Math.floor(sisa / pecahan); // dibagi buat tahu dapat berapa lembar/keping
      sisa = sisa % pecahan; // modulus (%) buat ambil sisa uang setelah dipecah
      console.log("  " + banyak + " x " + formatRupiah(pecahan)); // tampilkan berapa lembar
    }
  }
}

// ============================================================================
// SEMENTARA (langkah 2): kode percobaan biar bagian ini bisa dijalankan sendiri.
// Bagian ini DIHAPUS di langkah berikutnya.
// ============================================================================
tampilPilihanMenu(); // coba tampilkan daftar menu
console.log("Uji diskon member, total 60000: " + Math.round(tentukanDiskon(true, 60000) * 100) + "%"); // coba hitung diskon
rl.close(); // tutup input karena cuma percobaan
