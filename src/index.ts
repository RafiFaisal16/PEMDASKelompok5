import * as readline from "readline";
//digunakan untuk mengimpor module readline dari node.js, yang memungkinkan program membaca input dari pengguna

// Bikin "rl" buat baca ketikan (input) dan nampilin tulisan (output) di terminal
const rl = readline.createInterface({
  input: process.stdin, // input datang dari keyboard
  output: process.stdout, // output keluar ke layar terminal
});

// ============================================================================
// BAGIAN B: STRUKTUR DATA (BENTUK DATA) DAN DATA AWAL
// ============================================================================

// Menu: bentuk data untuk 1 menu di kantin, bisa makanan atau minuman.
// Jadi tiap menu pasti punya id, nama, kategori, harga, stok, dan status tersedia.
interface Menu {
  id: string; // kode menu biar tidak ketuker, contoh "M001"
  nama: string; // nama menunya, contoh "Nasi Goreng"
  kategori: string; // jenis menunya: "Makanan" atau "Minuman"
  harga: number; // harga 1 porsi (rupiah)
  stok: number; // sisa porsi yang masih ada
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
const batasDiskon: number = 50000; // belanja minimal segini baru dapat diskon
const poinTambahan: number = 10; // poin yang didapat member tiap transaksi
const daftarPecahan: number[] = [100000, 50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50]; // pecahan uang buat nampilin rincian kembalian

// DATA SELAMA PROGRAM JALAN (pakai let karena nilainya terus berubah)
let jumlahTransaksi: number = 0; // sudah berapa transaksi yang selesai
let totalPendapatan: number = 0; // total uang yang masuk dari transaksi yang lunas
let totalPoin: number = 0; // total poin member yang terkumpul

// ============================================================================
// BAGIAN C: FUNGSI BANTU (INPUT, TAMPILAN, PENCARIAN)
// ============================================================================

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
// BAGIAN E: KERANGKA FITUR CRUD DAN SEARCH (NANTI DIISI DI PROGRESS BERIKUTNYA)
// ============================================================================

// Fungsi buat pesan sementara untuk fitur yang belum dikerjakan (void)
function fiturBelumTersedia(namaFitur: string, progress: number): void {
  console.log("Fitur " + namaFitur + " belum tersedia, akan dikerjakan pada Progress " + progress + ".");
}

// [PROGRESS 3] fungsi tambahMenu() untuk fitur Create ditambahkan di sini
// [PROGRESS 4] fungsi tampilSemuaMenu() dan tampilDetailMenu() untuk fitur Read ditambahkan di sini
// [PROGRESS 5] fungsi ubahMenu() dan hapusMenu() untuk fitur Update dan Delete ditambahkan di sini
// [PROGRESS 6] fungsi cariMenu() untuk fitur Search ditambahkan di sini

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
// BAGIAN G: MENU UTAMA (MUTER TERUS SAMPAI PENGGUNA PILIH KELUAR)
// ============================================================================

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