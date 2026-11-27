<?php

namespace Database\Seeders;

use App\Models\Inventory;
use App\Models\InventoryProcurementItem;
use App\Models\InventoryRequestItem;
use App\Models\Item;
use App\Models\ItemCategory;
use App\Models\ItemVariant;
use App\Models\Organization;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;

class InventoryItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categoriesData = [
            [
                'code' => 'CAT-ATK',
                'name' => 'Office Stationery & Paper',
                'description' => 'Daily office stationery, copying and printing paper, archival folders, writing instruments, and desktop consumables.',
                'items' => [
                    [
                        'name' => 'Kertas HVS A4 80gsm PaperOne (500 Lembar)',
                        'code' => 'ATK-HVS-A4-80',
                        'unit' => 'rim',
                        'minimal_quantity' => 20,
                        'description' => 'Kertas HVS putih polos ukuran A4 (210 x 297 mm) 80 gram untuk dokumen resmi, surat dinas, dan laporan akademik.',
                        'variants' => ['70 gsm', '80 gsm'],
                    ],
                    [
                        'name' => 'Kertas HVS F4 / Folio 75gsm SiDU (500 Lembar)',
                        'code' => 'ATK-HVS-F4-75',
                        'unit' => 'rim',
                        'minimal_quantity' => 15,
                        'description' => 'Kertas HVS ukuran Folio/F4 (215 x 330 mm) 75 gram untuk formulir akademik, berkas ijazah, dan arsip kepegawaian.',
                        'variants' => ['70 gsm', '75 gsm', '80 gsm'],
                    ],
                    [
                        'name' => 'Pulpen Gel Hitam Joyko JK-100 0.5mm (1 Lusin)',
                        'code' => 'ATK-PEN-BLK-DZ',
                        'unit' => 'box',
                        'minimal_quantity' => 12,
                        'description' => 'Pulpen gel warna hitam mata pena jarum 0.5mm anti-macet untuk staf administrasi dan paraf dokumen.',
                        'variants' => ['Hitam', 'Biru', 'Merah'],
                    ],
                    [
                        'name' => 'Pulpen Gel Biru Joyko JK-100 0.5mm (1 Lusin)',
                        'code' => 'ATK-PEN-BLU-DZ',
                        'unit' => 'box',
                        'minimal_quantity' => 10,
                        'description' => 'Pulpen gel warna biru 0.5mm untuk penandatanganan dokumen resmi dan surat keputusan.',
                        'variants' => ['Biru', 'Hitam', 'Merah'],
                    ],
                    [
                        'name' => 'Pulpen Rollerball Pilot G2 0.7mm (1 Lusin)',
                        'code' => 'ATK-PEN-PILOT-G2',
                        'unit' => 'box',
                        'minimal_quantity' => 8,
                        'description' => 'Pulpen gel retractable premium dengan grip karet empuk untuk penandatanganan berkas pimpinan dekanat.',
                        'variants' => ['Hitam', 'Biru'],
                    ],
                    [
                        'name' => 'Pensil 2B Faber-Castell Castell 9000 (1 Lusin)',
                        'code' => 'ATK-PNC-FABER-2B',
                        'unit' => 'box',
                        'minimal_quantity' => 6,
                        'description' => 'Pensil grafit berkualitas tinggi berstandar ujian OMR/LJK untuk pengawas ujian dan sketsa kerja teknis.',
                        'variants' => ['2B', 'HB'],
                    ],
                    [
                        'name' => 'Penghapus Pensil Faber-Castell Dust-Free Hitam',
                        'code' => 'ATK-ERS-FABER-DF',
                        'unit' => 'pcs',
                        'minimal_quantity' => 15,
                        'description' => 'Penghapus karet bebas debu tidak merusak kertas untuk ujian dan gambar teknik.',
                    ],
                    [
                        'name' => 'Spidol Whiteboard Snowman Boardmarker Hitam (1 Lusin)',
                        'code' => 'ATK-WB-BLK-DZ',
                        'unit' => 'box',
                        'minimal_quantity' => 15,
                        'description' => 'Spidol papan tulis putih warna hitam mudah dihapus tanpa residu untuk ruang kuliah dan ruang rapat.',
                        'variants' => ['Hitam', 'Biru', 'Merah'],
                    ],
                    [
                        'name' => 'Spidol Whiteboard Snowman Boardmarker Biru (1 Lusin)',
                        'code' => 'ATK-WB-BLU-DZ',
                        'unit' => 'box',
                        'minimal_quantity' => 10,
                        'description' => 'Spidol papan tulis putih warna biru untuk ruang perkuliahan dan seminar.',
                        'variants' => ['Biru', 'Hitam', 'Merah'],
                    ],
                    [
                        'name' => 'Spidol Whiteboard Snowman Boardmarker Merah (1 Lusin)',
                        'code' => 'ATK-WB-RED-DZ',
                        'unit' => 'box',
                        'minimal_quantity' => 8,
                        'description' => 'Spidol whiteboard warna merah untuk catatan penegasan dan diagram materi perkuliahan.',
                        'variants' => ['Merah', 'Biru', 'Hitam'],
                    ],
                    [
                        'name' => 'Tinta Isi Ulang Spidol Whiteboard Snowman 20ml',
                        'code' => 'ATK-WB-INK-SNOW',
                        'unit' => 'bottle',
                        'minimal_quantity' => 12,
                        'description' => 'Tinta botol refill tetes untuk spidol whiteboard Snowman ramah lingkungan dan hemat.',
                        'variants' => ['Hitam', 'Biru', 'Merah'],
                    ],
                    [
                        'name' => 'Penghapus Papan Tulis Whiteboard Magnetik Joyko',
                        'code' => 'ATK-WB-ERS-MAG',
                        'unit' => 'pcs',
                        'minimal_quantity' => 12,
                        'description' => 'Penghapus whiteboard busa berdaya serap tinggi dengan magnet terintegrasi yang menempel di papan.',
                    ],
                    [
                        'name' => 'Spidol Permanen Snowman Marker (1 Lusin)',
                        'code' => 'ATK-MRK-SNOW-PERM',
                        'unit' => 'box',
                        'minimal_quantity' => 8,
                        'description' => 'Spidol marker permanen tahan air untuk penomoran kardus arsip dan pelabelan inventaris kantor.',
                        'variants' => ['Hitam', 'Biru', 'Merah'],
                    ],
                    [
                        'name' => 'Stabilo Boss Original Highlighter',
                        'code' => 'ATK-HLT-STABILO',
                        'unit' => 'pcs',
                        'minimal_quantity' => 20,
                        'description' => 'Penanda teks neon berteknologi Anti-Dry-Out hingga 4 jam untuk telaah borang akreditasi dan kurikulum.',
                        'variants' => ['Kuning', 'Hijau', 'Oranye', 'Pink'],
                    ],
                    [
                        'name' => 'Stapler Joyko HD-10 & Isi Staples No. 10',
                        'code' => 'ATK-STP-HD10-SET',
                        'unit' => 'set',
                        'minimal_quantity' => 15,
                        'description' => 'Set stapler kecil ukuran meja kerja HD-10 berkapasitas 20 lembar beserta 1 kotak isi staples no. 10.',
                    ],
                    [
                        'name' => 'Stapler Heavy Duty Kangaro HD-50 / HD-23S17',
                        'code' => 'ATK-STP-KANG-HD50',
                        'unit' => 'unit',
                        'minimal_quantity' => 4,
                        'description' => 'Stapler jilid kapasitas besar hingga 100 lembar untuk proposal hibah penelitian dan berkas skripsi.',
                    ],
                    [
                        'name' => 'Isi Staples Kangaro No. 24/6 (1 Kotak / 1000 Pcs)',
                        'code' => 'ATK-STP-REFILL-246',
                        'unit' => 'box',
                        'minimal_quantity' => 15,
                        'description' => 'Isi staples kawat baja ukuran 24/6 (No. 3) untuk stapler ukuran medium dan penjilidan tebal.',
                    ],
                    [
                        'name' => 'Pembuka Staples (Staple Remover) Joyko SR-45',
                        'code' => 'ATK-STP-REM-SR45',
                        'unit' => 'pcs',
                        'minimal_quantity' => 8,
                        'description' => 'Alat pencabut kawat staples aman tanpa merobek lembaran arsip penting dan dokumen berharga.',
                    ],
                    [
                        'name' => 'Perforator / Pembolong Kertas 2 Lubang Joyko 40XL',
                        'code' => 'ATK-PRF-JOYKO-40XL',
                        'unit' => 'unit',
                        'minimal_quantity' => 6,
                        'description' => 'Alat pembolong kertas 2 lubang kapasitas hingga 40 lembar dengan mistar panduan kertas untuk ordner.',
                    ],
                    [
                        'name' => 'Paper Clip / Klip Kertas Trigonal No. 3 Joyko (1 Kotak)',
                        'code' => 'ATK-PCLP-JOYKO-NO3',
                        'unit' => 'box',
                        'minimal_quantity' => 15,
                        'description' => 'Klip kawat baja galvanis anti-karat untuk merapikan berkas dinas tanpa melubangi dokumen.',
                        'variants' => ['No. 3 (Kecil)', 'No. 5 (Besar)'],
                    ],
                    [
                        'name' => 'Binder Clip No. 155 (32mm) Joyko (1 Kotak / 12 Pcs)',
                        'code' => 'ATK-BCLP-155-BOX',
                        'unit' => 'box',
                        'minimal_quantity' => 12,
                        'description' => 'Klip penjepit berkas kertas ukuran 32mm isi 12 buah per kotak berbahan baja fleksibel anti-selip.',
                        'variants' => ['No. 105 (15mm)', 'No. 107 (19mm)', 'No. 155 (32mm)', 'No. 260 (51mm)'],
                    ],
                    [
                        'name' => 'Gunting Kantor Stainless Steel Joyko SC-838 (6.5 Inch)',
                        'code' => 'ATK-SCIS-JOYKO-838',
                        'unit' => 'pcs',
                        'minimal_quantity' => 10,
                        'description' => 'Gunting kantor serbaguna dengan mata pisau baja tahan karat tajam dan pegangan ergonomis.',
                    ],
                    [
                        'name' => 'Cutter Joyko L-500 & Refill Pisau Cutter (1 Tube)',
                        'code' => 'ATK-CUT-JOYKO-L500',
                        'unit' => 'set',
                        'minimal_quantity' => 8,
                        'description' => 'Pisau cutter bodi kokoh pengunci putar (auto-lock) beserta tabung isi ulang pisau baja SK-5.',
                    ],
                    [
                        'name' => 'Penggaris Besi Stainless Steel 30cm',
                        'code' => 'ATK-RUL-STEEL-30CM',
                        'unit' => 'pcs',
                        'minimal_quantity' => 8,
                        'description' => 'Penggaris mistar ukur baja presisi tahan karat dengan skala ukur milimeter dan inci bolak-balik.',
                        'variants' => ['30 cm', '60 cm'],
                    ],
                    [
                        'name' => 'Lem Kertas Stick UHU Stic 21g / Glukol',
                        'code' => 'ATK-GLU-UHU-21G',
                        'unit' => 'pcs',
                        'minimal_quantity' => 15,
                        'description' => 'Lem stik padat bebas pelarut cepat kering untuk penempelan materai, kuitansi, dan amplop dinas.',
                    ],
                    [
                        'name' => 'Lakban Bening Nachi Tape 2 Inch (48mm x 72m)',
                        'code' => 'ATK-TPE-NACHI-CLR',
                        'unit' => 'roll',
                        'minimal_quantity' => 15,
                        'description' => 'Lakban OPP transparan daya rekat tinggi untuk pengemasan dokumen ekspedisi dan kotak arsip.',
                    ],
                    [
                        'name' => 'Lakban Coklat Nachi Tape 2 Inch (48mm x 72m)',
                        'code' => 'ATK-TPE-NACHI-BRN',
                        'unit' => 'roll',
                        'minimal_quantity' => 12,
                        'description' => 'Lakban coklat serbaguna standar pengemasan kardus arsip dan pengiriman paket logistik fakultas.',
                    ],
                    [
                        'name' => 'Lakban Kain Hitam Cloth Tape 1.5 Inch (36mm x 12m)',
                        'code' => 'ATK-TPE-CLOTH-BLK',
                        'unit' => 'roll',
                        'minimal_quantity' => 10,
                        'description' => 'Lakban kain jilid hitam fleksibel dan kuat untuk penjilidan laporan evaluasi, kurikulum, dan borang.',
                        'variants' => ['1.5 Inch (36mm)', '2 Inch (48mm)'],
                    ],
                    [
                        'name' => 'Double Tape Nachi 1 Inch (24mm x 12m)',
                        'code' => 'ATK-TPE-DBL-NACHI',
                        'unit' => 'roll',
                        'minimal_quantity' => 10,
                        'description' => 'Pita perekat dua sisi rekat kuat untuk penempelan memo pengumuman dan papan informasi lobi.',
                    ],
                    [
                        'name' => 'Selotip Bening Panfix 1/2 Inch (12mm x 33m)',
                        'code' => 'ATK-TPE-PANFIX-CLR',
                        'unit' => 'roll',
                        'minimal_quantity' => 20,
                        'description' => 'Selotip transparan kecil berbahan selulosa alami untuk operasional meja kerja harian staf.',
                    ],
                    [
                        'name' => 'Post-It / Sticky Notes Joyko Pastel 3x3 Inch (76x76mm)',
                        'code' => 'ATK-STK-JOYKO-3X3',
                        'unit' => 'pad',
                        'minimal_quantity' => 20,
                        'description' => 'Kertas catatan tempel memo berperekat untuk penanda disposisi surat masuk dekanat dan catatan rapat.',
                        'variants' => ['Kuning', 'Hijau', 'Biru', 'Pink'],
                    ],
                    [
                        'name' => 'Sticky Notes Index / Page Marker Warna-Warni Joyko',
                        'code' => 'ATK-STK-INDEX-SIGN',
                        'unit' => 'pack',
                        'minimal_quantity' => 15,
                        'description' => 'Pembatas halaman plastik film transparan 5 warna neon untuk penanda pasal regulasi akademik.',
                    ],
                    [
                        'name' => 'Correction Tape Joyko CT-522 (Pita Koreksi 12m)',
                        'code' => 'ATK-CRX-JOYKO-CT522',
                        'unit' => 'pcs',
                        'minimal_quantity' => 15,
                        'description' => 'Tip-ex pita kering instan 5mm x 12m yang rapi dan dapat langsung ditimpa tulisan pulpen.',
                    ],
                    [
                        'name' => 'Map Plastik L-Folder Transparan A4 (Isi 12 Pcs)',
                        'code' => 'ATK-MAP-A4-PACK',
                        'unit' => 'pack',
                        'minimal_quantity' => 15,
                        'description' => 'Map dokumen plastik bening L-shaped untuk pengarsipan berkas mahasiswa dan proposal akademik.',
                        'variants' => ['Bening Transparan', 'Biru Bening', 'Hijau Bening'],
                    ],
                    [
                        'name' => 'Map Snelhefter Kertas Folio Diamond (Isi 50 Pcs)',
                        'code' => 'ATK-MAP-SNEL-FOLIO',
                        'unit' => 'pack',
                        'minimal_quantity' => 6,
                        'description' => 'Map kertas snelhefter dengan acco penjepit seng untuk berkas kenaikan jabatan dosen dan kepegawaian.',
                        'variants' => ['Biru', 'Merah', 'Kuning', 'Hijau'],
                    ],
                    [
                        'name' => 'Ordner Bantex F4 7cm Lever Arch File',
                        'code' => 'ATK-ORD-BANTEX-F4',
                        'unit' => 'pcs',
                        'minimal_quantity' => 20,
                        'description' => 'Odner pengarsipan karton tebal berlapis plastik dengan tuas pengunci baja dan kantong label punggung.',
                        'variants' => ['Hitam', 'Biru Tua', 'Abu-abu'],
                    ],
                    [
                        'name' => 'Stopmap Folio Kertas Buffalo Tebal (Isi 50 Pcs)',
                        'code' => 'ATK-MAP-BUFFALO-F4',
                        'unit' => 'pack',
                        'minimal_quantity' => 5,
                        'description' => 'Map kertas buffalo tebal bermotif klasik untuk dokumen ijazah, transkrip nilai, dan berkas yudisium.',
                        'variants' => ['Biru', 'Hijau', 'Merah', 'Kuning'],
                    ],
                    [
                        'name' => 'Amplop Putih Berperekat Paperline No. 90 (Isi 100 Lembar)',
                        'code' => 'ATK-ENV-WHITE-NO90',
                        'unit' => 'box',
                        'minimal_quantity' => 10,
                        'description' => 'Amplop surat dinas warna putih bersih dengan lem perekat instan untuk korespondensi resmi dan undangan.',
                        'variants' => ['No. 90 (110x230mm)', 'No. 104 (120x280mm)'],
                    ],
                    [
                        'name' => 'Amplop Coklat Tali Samson Ukuran F4 (Isi 100 Lembar)',
                        'code' => 'ATK-ENV-SAMSON-F4',
                        'unit' => 'pack',
                        'minimal_quantity' => 5,
                        'description' => 'Amplop berkas tebal bahan kraft samson berpita tali putar untuk pengiriman dokumen rahasia dan akreditasi.',
                    ],
                    [
                        'name' => 'Buku Agenda Surat Masuk-Keluar Folio (100 Lembar)',
                        'code' => 'ATK-BOK-AGENDA-F4',
                        'unit' => 'book',
                        'minimal_quantity' => 5,
                        'description' => 'Buku register persuratan tabel standar hardcover untuk pencatatan nomor surat dinas keluar dan masuk.',
                    ],
                    [
                        'name' => 'Bak Stempel / Stamp Pad No. 1 Joyko & Tinta Stempel',
                        'code' => 'ATK-STM-JOYKO-PAD1',
                        'unit' => 'set',
                        'minimal_quantity' => 6,
                        'description' => 'Bantalan stempel cap ukuran no. 1 beserta botol tinta stempel isi ulang untuk legalisir dokumen resmi dekanat.',
                        'variants' => ['Ungu / Violet', 'Biru', 'Hitam'],
                    ],
                ],
            ],
            [
                'code' => 'CAT-INK',
                'name' => 'Printer Inks & Toner',
                'description' => 'Original ink bottle refills and monochrome/color laser toner cartridges for faculty office printers and copiers.',
                'items' => [
                    [
                        'name' => 'Tinta Botol Epson 003 Black Original (65ml)',
                        'code' => 'PRN-EPS-003-BK',
                        'unit' => 'bottle',
                        'minimal_quantity' => 16,
                        'description' => 'Tinta hitam original Epson seri L1110, L3110, L3150, L3210, L5290 untuk pencetakan dokumen dinas harian.',
                    ],
                    [
                        'name' => 'Tinta Botol Epson 003 Cyan Original (65ml)',
                        'code' => 'PRN-EPS-003-C',
                        'unit' => 'bottle',
                        'minimal_quantity' => 8,
                        'description' => 'Tinta biru cyan original Epson EcoTank untuk diagram, grafik, dan piagam kegiatan fakultas.',
                    ],
                    [
                        'name' => 'Tinta Botol Epson 003 Magenta Original (65ml)',
                        'code' => 'PRN-EPS-003-M',
                        'unit' => 'bottle',
                        'minimal_quantity' => 8,
                        'description' => 'Tinta merah magenta original Epson EcoTank untuk pencetakan dokumen berwarna.',
                    ],
                    [
                        'name' => 'Tinta Botol Epson 003 Yellow Original (65ml)',
                        'code' => 'PRN-EPS-003-Y',
                        'unit' => 'bottle',
                        'minimal_quantity' => 8,
                        'description' => 'Tinta kuning yellow original Epson EcoTank untuk printer multifungsi ruang sekretariat dekanat.',
                    ],
                    [
                        'name' => 'Tinta Botol Epson 664 Black Original (70ml)',
                        'code' => 'PRN-EPS-664-BK',
                        'unit' => 'bottle',
                        'minimal_quantity' => 10,
                        'description' => 'Tinta printer original Epson seri L120, L220, L360, L385 untuk pencetakan dokumen operasional jurusan.',
                    ],
                    [
                        'name' => 'Tinta Botol Canon GI-790 Black Original (135ml)',
                        'code' => 'PRN-CAN-GI790-BK',
                        'unit' => 'bottle',
                        'minimal_quantity' => 8,
                        'description' => 'Tinta original Canon MegaTank seri G1010, G2010, G3010 untuk pencetakan sertifikat dan kartu ujian.',
                    ],
                    [
                        'name' => 'Toner Cartridge HP LaserJet 85A (CE285A) Compatible',
                        'code' => 'PRN-TNR-HP-85A',
                        'unit' => 'unit',
                        'minimal_quantity' => 6,
                        'description' => 'Cartridge toner hitam monokrom untuk printer laser HP P1102 / M1212nf di bagian keuangan dan persuratan.',
                    ],
                    [
                        'name' => 'Toner Cartridge HP LaserJet 107A (W1107A)',
                        'code' => 'PRN-TNR-HP-107A',
                        'unit' => 'unit',
                        'minimal_quantity' => 4,
                        'description' => 'Toner cartridge hitam original kapasitas 1.000 halaman untuk printer HP Laser 107a dan MFP 135a.',
                    ],
                    [
                        'name' => 'Toner Cartridge Canon 325 / 725 Black',
                        'code' => 'PRN-TNR-CANON-325',
                        'unit' => 'unit',
                        'minimal_quantity' => 4,
                        'description' => 'Cartridge toner monokrom untuk printer laser Canon LBP6000 / LBP6030 di ruang administrasi akademik.',
                    ],
                    [
                        'name' => 'Toner Cartridge Brother TN-2356 Black',
                        'code' => 'PRN-TNR-BRO-TN2356',
                        'unit' => 'unit',
                        'minimal_quantity' => 4,
                        'description' => 'Toner laser hitam berkapasitas tinggi hingga 2.600 halaman untuk printer Brother HL-L2360DN.',
                    ],
                ],
            ],
            [
                'code' => 'CAT-PERIPH',
                'name' => 'Computer Peripherals & Presentation',
                'description' => 'Desktop PC peripherals, wireless presenter pointers, USB-C adapters, HDMI display cables, and data storage.',
                'items' => [
                    [
                        'name' => 'Mouse USB Optical Logitech B100',
                        'code' => 'IT-MOU-LOGI-B100',
                        'unit' => 'unit',
                        'minimal_quantity' => 12,
                        'description' => 'Mouse USB optik kabel standar 800 DPI untuk workstation komputer staf administrasi dan laboratorium praktikum.',
                        'variants' => ['Hitam', 'Putih'],
                    ],
                    [
                        'name' => 'Mouse Wireless Silent Logitech M220 / M170',
                        'code' => 'IT-MOU-LOGI-M220',
                        'unit' => 'unit',
                        'minimal_quantity' => 8,
                        'description' => 'Mouse tanpa kabel dengan teknologi peredam suara klik senyap untuk ruang rapat pimpinan dan seminar.',
                        'variants' => ['Hitam', 'Abu-abu'],
                    ],
                    [
                        'name' => 'Keyboard USB Standar Logitech K120',
                        'code' => 'IT-KEY-LOGI-K120',
                        'unit' => 'unit',
                        'minimal_quantity' => 10,
                        'description' => 'Keyboard USB berdaya tahan tinggi tahan tumpahan cairan dengan layout full-size untuk ruang kerja staf.',
                    ],
                    [
                        'name' => 'Combo Keyboard & Mouse Wireless Logitech MK220',
                        'code' => 'IT-KMB-LOGI-MK220',
                        'unit' => 'set',
                        'minimal_quantity' => 5,
                        'description' => 'Set keyboard dan mouse wireless 2.4GHz ringkas untuk ruang rapat pimpinan dan podium pengajar.',
                    ],
                    [
                        'name' => 'Kabel HDMI to HDMI 2.0 4K Ultra HD (3 Meter)',
                        'code' => 'IT-CBL-HDMI-3M',
                        'unit' => 'unit',
                        'minimal_quantity' => 10,
                        'description' => 'Kabel display HDMI gold plated 3 meter untuk proyektor ruang kelas perkuliahan dan ruang rapat dekanat.',
                        'variants' => ['1.5 Meter', '3 Meter', '5 Meter'],
                    ],
                    [
                        'name' => 'Kabel HDMI to HDMI 2.0 4K Ultra HD (5 Meter)',
                        'code' => 'IT-CBL-HDMI-5M',
                        'unit' => 'unit',
                        'minimal_quantity' => 6,
                        'description' => 'Kabel display HDMI 5 meter untuk ruang seminar utama, aula, dan auditorium fakultas.',
                        'variants' => ['5 Meter', '10 Meter'],
                    ],
                    [
                        'name' => 'Adapter Konverter USB-C Multiport to HDMI + VGA + USB 3.0',
                        'code' => 'IT-ADP-USBC-HV',
                        'unit' => 'unit',
                        'minimal_quantity' => 8,
                        'description' => 'Dongle USB Type-C multifungsi aluminium untuk presentasi laptop modern dosen ke proyektor VGA/HDMI.',
                    ],
                    [
                        'name' => 'Flashdisk Kingston DataTraveler 64GB USB 3.2',
                        'code' => 'IT-FD-64GB-USB3',
                        'unit' => 'unit',
                        'minimal_quantity' => 10,
                        'description' => 'Media penyimpanan USB 64GB untuk transfer data kurikulum, backup dokumen akreditasi, dan installer software.',
                        'variants' => ['32 GB', '64 GB', '128 GB'],
                    ],
                    [
                        'name' => 'Wireless Presenter Laser Pointer Logitech R400',
                        'code' => 'IT-PRS-LOGI-R400',
                        'unit' => 'unit',
                        'minimal_quantity' => 6,
                        'description' => 'Pointer laser merah nirkabel jangkauan 15 meter dengan navigasi slide intuitif untuk sidang skripsi dan seminar.',
                    ],
                    [
                        'name' => 'Kabel Audio AUX 3.5mm Male to Male (2 Meter)',
                        'code' => 'IT-CBL-AUX-2M',
                        'unit' => 'unit',
                        'minimal_quantity' => 6,
                        'description' => 'Kabel jack audio stereo 3.5mm untuk sambungan speaker active di kelas multimedia dan ruang rapat.',
                    ],
                    [
                        'name' => 'Kabel Power Stop Kontak 5 Lubang Uticon 3 Meter',
                        'code' => 'IT-PWR-STRIP-5L',
                        'unit' => 'unit',
                        'minimal_quantity' => 10,
                        'description' => 'Stop kontak kabel arde kuningan 5 soket dengan saklar switch independen untuk ruang rapat dan laboratorium.',
                        'variants' => ['3 Lubang (3 Meter)', '4 Lubang (3 Meter)', '5 Lubang (5 Meter)'],
                    ],
                    [
                        'name' => 'Web Camera Full HD 1080p Logitech C920 Pro / C270',
                        'code' => 'IT-CAM-LOGI-C920',
                        'unit' => 'unit',
                        'minimal_quantity' => 4,
                        'description' => 'Kamera webcam USB Full HD mikrofon stereo ganda untuk rapat daring (hybrid meeting) senat dan sidang online.',
                    ],
                    [
                        'name' => 'Headset USB Stereo Logitech H390 with Noise-Cancelling Mic',
                        'code' => 'IT-HDS-LOGI-H390',
                        'unit' => 'unit',
                        'minimal_quantity' => 5,
                        'description' => 'Headset USB nyaman dengan mikrofon peredam bising untuk operator ujian online CBT dan webinar.',
                    ],
                ],
            ],
            [
                'code' => 'CAT-CLN',
                'name' => 'Office Cleaning & Pantry Supplies',
                'description' => 'Office hygiene consumables, facial tissues, hand wash, surface disinfectants, waste disposal bags, and pantry supplies.',
                'items' => [
                    [
                        'name' => 'Tisu Wajah Paseo Smart Facial Tissue 250 Lembar (2 Ply)',
                        'code' => 'CLN-TSU-PAS-250S',
                        'unit' => 'pack',
                        'minimal_quantity' => 25,
                        'description' => 'Tisu wajah higienis berbahan 100% serat alami untuk meja pimpinan dekanat, meja staf, dan ruang rapat.',
                    ],
                    [
                        'name' => 'Tisu Gulung Toilet Paper Roll Paseo / See-U (Pack Isi 10)',
                        'code' => 'CLN-TSU-PAS-ROLL',
                        'unit' => 'pack',
                        'minimal_quantity' => 15,
                        'description' => 'Tisu toilet rol lembut dan mudah larut air untuk sanitasi toilet gedung dekanat dan dosen.',
                    ],
                    [
                        'name' => 'Tisu Hand Towel Multifold See-U (Pack Isi 150 Sheet)',
                        'code' => 'CLN-TSU-TOWEL-MFT',
                        'unit' => 'pack',
                        'minimal_quantity' => 20,
                        'description' => 'Tisu pengering tangan lipat daya serap tinggi untuk dispenser wastafel toilet kantor.',
                    ],
                    [
                        'name' => 'Sabun Cuci Tangan Lifebuoy Hand Wash Botol Pump 500ml',
                        'code' => 'CLN-SOAP-LB-500ML',
                        'unit' => 'bottle',
                        'minimal_quantity' => 15,
                        'description' => 'Sabun cuci tangan cair antibakteri kemasan botol pompa untuk wastafel kantor dan toilet staf.',
                        'variants' => ['Total 10 (Merah)', 'Lemon Fresh (Kuning)'],
                    ],
                    [
                        'name' => 'Sabun Cuci Tangan Lifebuoy Hand Wash Pouch Refill 400ml',
                        'code' => 'CLN-SOAP-LB-REFILL',
                        'unit' => 'pouch',
                        'minimal_quantity' => 20,
                        'description' => 'Sabun cuci tangan kemasan isi ulang ekonomis untuk pengisian botol dispenser wastafel.',
                    ],
                    [
                        'name' => 'Sabun Cuci Piring Sunlight Jeruk Nipis 750ml',
                        'code' => 'CLN-DSH-SUN-750ML',
                        'unit' => 'pouch',
                        'minimal_quantity' => 12,
                        'description' => 'Cairan pembersih peralatan makan dan cangkir pantry kantor dengan ekstrak jeruk nipis pembersih lemak.',
                    ],
                    [
                        'name' => 'Spons Cuci Piring Scotch-Brite Sabut Hijau (Pack Isi 3 Pcs)',
                        'code' => 'CLN-SPG-SCOTCH-3P',
                        'unit' => 'pack',
                        'minimal_quantity' => 10,
                        'description' => 'Spons pencuci piring dua sisi dengan sabut hijau anti-bakteri untuk kebersihan wastafel pantry.',
                    ],
                    [
                        'name' => 'Karbol Wangi Pembersih Lantai Wipol Cemara Pouch 750ml',
                        'code' => 'CLN-FLR-WIP-750ML',
                        'unit' => 'pouch',
                        'minimal_quantity' => 15,
                        'description' => 'Cairan pembersih lantai disinfektan beraroma pinus cemara untuk kebersihan lorong gedung dan ruangan kerja.',
                    ],
                    [
                        'name' => 'Pembersih Kaca Cling Glass Cleaner Spray 425ml + Refill',
                        'code' => 'CLN-GLS-CLING-425',
                        'unit' => 'bottle',
                        'minimal_quantity' => 8,
                        'description' => 'Cairan pembersih kaca anti-bakteri kilap tanpa bercak untuk membersihkan jendela kaca dan partisi kantor.',
                    ],
                    [
                        'name' => 'Pengharum Ruangan Spray Stella All in One 400ml',
                        'code' => 'CLN-AIR-STEL-400M',
                        'unit' => 'can',
                        'minimal_quantity' => 12,
                        'description' => 'Semprotan penyegar udara aroma segar untuk ruang rapat pimpinan, ruang dekan, dan ruang tunggu tamu.',
                        'variants' => ['Lemon Segar', 'Jeruk Manis', 'Lavender', 'Apel'],
                    ],
                    [
                        'name' => 'Hand Sanitizer Gel 500ml Botol Pump Antis',
                        'code' => 'CLN-SAN-ANTIS-500',
                        'unit' => 'bottle',
                        'minimal_quantity' => 12,
                        'description' => 'Gel antiseptik pembersih tangan alkohol 70% dengan moisturizer untuk meja resepsionis dan lobi gedung.',
                    ],
                    [
                        'name' => 'Kantong Sampah Plastik Hitam Trash Bag Ukuran 60x100cm (Isi 10)',
                        'code' => 'CLN-TRH-BAG-60100',
                        'unit' => 'pack',
                        'minimal_quantity' => 20,
                        'description' => 'Plastik sampah hitam tebal anti-bocor untuk tempat sampah lorong gedung dan ruang kerja bersama.',
                        'variants' => ['60x100 cm (Besar)', '40x50 cm (Kecil)'],
                    ],
                    [
                        'name' => 'Gelas Kertas Minuman Panas Paper Cup 8oz (Pack Isi 50 Pcs)',
                        'code' => 'CLN-CUP-PAPER-8OZ',
                        'unit' => 'pack',
                        'minimal_quantity' => 12,
                        'description' => 'Cangkir kertas sekali pakai tahan panas untuk jamuan kopi dan teh saat rapat pimpinan dan workshop.',
                    ],
                    [
                        'name' => 'Teh Celup SariWangi Asli Kotak (Isi 50 Kantong)',
                        'code' => 'CLN-TEA-SARI-50S',
                        'unit' => 'box',
                        'minimal_quantity' => 12,
                        'description' => 'Teh celup hitam melati berkualitas untuk persediaan minuman pantry dekanat dan ruang rapat tamu.',
                    ],
                    [
                        'name' => 'Kopi Bubuk Kapal Api Special Mix (1 Renceng / 10 Sachet)',
                        'code' => 'CLN-COF-KAPAL-10S',
                        'unit' => 'pack',
                        'minimal_quantity' => 15,
                        'description' => 'Kopi bubuk sachet instan dengan gula murni untuk konsumsi rapat berkala dosen dan staf.',
                    ],
                    [
                        'name' => 'Gula Pasir Gulaku Putih Premium 1kg',
                        'code' => 'CLN-SUG-GULA-1KG',
                        'unit' => 'pack',
                        'minimal_quantity' => 8,
                        'description' => 'Gula tebu kristal putih murni kemasan higienis untuk konsumsi pantry dan penyambutan tamu fakultas.',
                    ],
                ],
            ],
            [
                'code' => 'CAT-NET',
                'name' => 'Networking & Cabling Supplies',
                'description' => 'Ethernet bulk cabling, factory patch cords, crimping modular plugs, and network diagnostic tools.',
                'items' => [
                    [
                        'name' => 'Kabel UTP Cat6 Belden Original 1 Roll (305 Meter)',
                        'code' => 'NET-CBL-CAT6-305M',
                        'unit' => 'roll',
                        'minimal_quantity' => 2,
                        'description' => 'Kabel jaringan UTP Cat6 1000Mbps gigabit untuk instalasi jaringan LAN gedung fakultas dan lab.',
                    ],
                    [
                        'name' => 'Patch Cord UTP Cat6 Factory Crimped (1.5 Meter)',
                        'code' => 'NET-PTC-CAT6-15M',
                        'unit' => 'pcs',
                        'minimal_quantity' => 25,
                        'description' => 'Kabel patch cord Cat6 cetakan pabrik 1.5 meter untuk switch ke PC desktop staf.',
                        'variants' => ['1.5 Meter', '3 Meter', '5 Meter'],
                    ],
                    [
                        'name' => 'Patch Cord UTP Cat6 Factory Crimped (3 Meter)',
                        'code' => 'NET-PTC-CAT6-3M',
                        'unit' => 'pcs',
                        'minimal_quantity' => 15,
                        'description' => 'Kabel patch cord Cat6 cetakan pabrik 3 meter untuk koneksi server dan access point WiFi.',
                        'variants' => ['3 Meter', '5 Meter'],
                    ],
                    [
                        'name' => 'Konektor RJ-45 Cat6 CommScope / AMP (Kotak Isi 50)',
                        'code' => 'NET-RJ45-CAT6-BOX',
                        'unit' => 'box',
                        'minimal_quantity' => 6,
                        'description' => 'Konektor RJ45 Cat6 berlapis emas 50 mikron untuk terminasi kabel jaringan LAN fakultas.',
                    ],
                    [
                        'name' => 'Tang Crimping RJ45 / RJ11 Multifungsi Heavy Duty',
                        'code' => 'NET-TOOL-CRIMP-HD',
                        'unit' => 'unit',
                        'minimal_quantity' => 4,
                        'description' => 'Alat crimping kabel jaringan dan pemotong kabel berpresisi tinggi bertulang baja kuat.',
                    ],
                    [
                        'name' => 'Network Cable Tester RJ45 & RJ11 with Master/Remote',
                        'code' => 'NET-TESTER-LAN',
                        'unit' => 'unit',
                        'minimal_quantity' => 4,
                        'description' => 'Tester kontinuitas dan urutan kabel LAN UTP/STP dengan indikator LED untuk verifikasi koneksi.',
                    ],
                    [
                        'name' => 'Barrel Coupler RJ45 Female to Female Adapter',
                        'code' => 'NET-CPLR-RJ45-FF',
                        'unit' => 'pcs',
                        'minimal_quantity' => 15,
                        'description' => 'Penyambung kabel LAN RJ45 gigabit female-to-female modular untuk perpanjangan rute kabel.',
                    ],
                ],
            ],
            [
                'code' => 'CAT-MNT',
                'name' => 'Office Tools & Hardware Maintenance',
                'description' => 'Screen cleaner sprays, microfiber cloths, thermal paste, alkaline batteries, and precision screwdriver repair kits.',
                'items' => [
                    [
                        'name' => 'Cairan Pembersih Layar Screen Cleaner Spray 250ml + Microfiber',
                        'code' => 'MNT-CLN-SCR-250',
                        'unit' => 'bottle',
                        'minimal_quantity' => 10,
                        'description' => 'Formula pembersih layar anti-gores dan anti-statis untuk monitor lab, laptop staf, dan proyektor.',
                    ],
                    [
                        'name' => 'Kain Lap Microfiber Antistatik Halus 30x30cm',
                        'code' => 'MNT-CLOTH-MCF-30',
                        'unit' => 'pack',
                        'minimal_quantity' => 15,
                        'description' => 'Kain mikrofiber lembut penyerap debu tanpa meninggalkan serat pada hardware dan meja kerja.',
                    ],
                    [
                        'name' => 'Thermal Paste Prosesor Arctic MX-4 (Spuit 4 Gram)',
                        'code' => 'MNT-TP-ARCTIC-4G',
                        'unit' => 'unit',
                        'minimal_quantity' => 6,
                        'description' => 'Pasta pendingin konduktivitas termal tinggi untuk pemeliharaan prosesor PC lab dan server.',
                    ],
                    [
                        'name' => 'Baterai AA Alkaline ABC Millenium 1.5V (Isi 4 Butir)',
                        'code' => 'MNT-BAT-AA-4PK',
                        'unit' => 'pack',
                        'minimal_quantity' => 20,
                        'description' => 'Baterai ukuran AA tahan bocor untuk mouse nirkabel, jam dinding kantor, dan remote AC.',
                    ],
                    [
                        'name' => 'Baterai AAA Alkaline ABC Millenium 1.5V (Isi 4 Butir)',
                        'code' => 'MNT-BAT-AAA-4PK',
                        'unit' => 'pack',
                        'minimal_quantity' => 20,
                        'description' => 'Baterai ukuran AAA untuk presenter remote nirkabel, remote proyektor, dan periferal lab.',
                    ],
                    [
                        'name' => 'Baterai Kotak 9V Alkaline ABC',
                        'code' => 'MNT-BAT-9V-ABC',
                        'unit' => 'pcs',
                        'minimal_quantity' => 10,
                        'description' => 'Baterai blok 9 volt untuk mikrofon wireless ruang rapat senat dan alat multitester teknisi.',
                    ],
                    [
                        'name' => 'Kabel Ties / Cable Ties Nylon 20cm Hitam (Isi 100 Pcs)',
                        'code' => 'MNT-TIE-NYL-20CM',
                        'unit' => 'pack',
                        'minimal_quantity' => 12,
                        'description' => 'Pengikat kabel nilon tahan panas untuk manajemen kerapian kabel meja staf dan rak server.',
                        'variants' => ['15 cm Hitam', '20 cm Hitam', '30 cm Hitam'],
                    ],
                    [
                        'name' => 'Obeng Set Presisi 32-in-1 Magnetic Screwdriver',
                        'code' => 'MNT-TOOL-SCREW-32',
                        'unit' => 'set',
                        'minimal_quantity' => 4,
                        'description' => 'Perangkat obeng presisi magnetik untuk pembongkaran dan perbaikan CPU, laptop, dan proyektor.',
                    ],
                    [
                        'name' => 'Contact Cleaner Spray 200ml (Pembersih Sirkuit Elektronik)',
                        'code' => 'MNT-CLN-CONT-200',
                        'unit' => 'can',
                        'minimal_quantity' => 4,
                        'description' => 'Cairan pembersih kontak elektronik cepat kering tanpa residu untuk slot RAM dan konektor switch.',
                    ],
                ],
            ],
            [
                'code' => 'CAT-IOT',
                'name' => 'Laboratory & Electronics Components',
                'description' => 'Microcontrollers, development kits, sensors, jumper cables, and breadboards for student Embedded Systems laboratories.',
                'items' => [
                    [
                        'name' => 'Mikrokontroler ESP32 NodeMCU WiFi + Bluetooth 30-Pin',
                        'code' => 'IOT-MCU-ESP32-30P',
                        'unit' => 'unit',
                        'minimal_quantity' => 15,
                        'description' => 'Development board IoT dual-core ESP32 dengan modul WiFi dan Bluetooth terintegrasi.',
                    ],
                    [
                        'name' => 'Mikrokontroler Arduino Uno R3 DIP ATmega328P Compatible',
                        'code' => 'IOT-MCU-ARD-UNO3',
                        'unit' => 'unit',
                        'minimal_quantity' => 10,
                        'description' => 'Board mikrokontroler standar praktikum sistem tertanam dan robotika dasar.',
                    ],
                    [
                        'name' => 'Breadboard Solderless 830 Titik MB-102',
                        'code' => 'IOT-BBD-830-MB102',
                        'unit' => 'unit',
                        'minimal_quantity' => 15,
                        'description' => 'Papan prototipe sirkuit elektronika 830 lubang untuk eksperimen laboratorium.',
                    ],
                    [
                        'name' => 'Kabel Jumper Male-to-Female 20cm (Pita Isi 40 Jalur)',
                        'code' => 'IOT-JMP-MF-20CM',
                        'unit' => 'pack',
                        'minimal_quantity' => 10,
                        'description' => 'Kabel pita fleksibel koneksi breadboard ke mikrokontroler (Male to Female).',
                    ],
                    [
                        'name' => 'Kabel Jumper Male-to-Male 20cm (Pita Isi 40 Jalur)',
                        'code' => 'IOT-JMP-MM-20CM',
                        'unit' => 'pack',
                        'minimal_quantity' => 10,
                        'description' => 'Kabel pita koneksi antar pin breadboard (Male to Male).',
                    ],
                    [
                        'name' => 'Sensor Suhu dan Kelembaban Digital DHT11',
                        'code' => 'IOT-SNS-DHT11',
                        'unit' => 'unit',
                        'minimal_quantity' => 12,
                        'description' => 'Modul sensor suhu dan kelembaban udara dengan output sinyal digital kalibrasi.',
                    ],
                    [
                        'name' => 'Sensor Jarak Ultrasonik HC-SR04 (2cm - 400cm)',
                        'code' => 'IOT-SNS-HCSR04',
                        'unit' => 'unit',
                        'minimal_quantity' => 12,
                        'description' => 'Sensor pengukur jarak gelombang ultrasonik untuk proyek robotika dan sensorik.',
                    ],
                ],
            ],
        ];

        // 1. Ensure Organization exists
        $org = Organization::first();
        if (! $org) {
            $org = Organization::create([
                'name' => 'Faculty of Information Technology',
                'code' => 'FTI',
                'is_active' => true,
            ]);
        }

        // 2. Ensure Warehouses exist
        $warehouses = collect([
            Warehouse::firstOrCreate(
                ['code' => 'WH-MAIN'],
                [
                    'organization_id' => $org->id,
                    'name' => 'Main IT Storage Room',
                    'description' => 'Gudang pusat penyimpanan logistik IT dan perlengkapan gedung FTI',
                    'is_active' => true,
                ]
            ),
            Warehouse::firstOrCreate(
                ['code' => 'WH-ADMIN'],
                [
                    'organization_id' => $org->id,
                    'name' => 'Administrative & Stationery Depot',
                    'description' => 'Depo penyimpanan persediaan ATK, kertas, dan berkas administrasi dekanat',
                    'is_active' => true,
                ]
            ),
            Warehouse::firstOrCreate(
                ['code' => 'WH-LAB'],
                [
                    'organization_id' => $org->id,
                    'name' => 'Lab Hardware & Electronics Depot',
                    'description' => 'Ruang penyimpanan suku cadang laboratorium komputer, jaringan, dan IoT',
                    'is_active' => true,
                ]
            ),
        ]);

        // 3. Clean up legacy faker-generated categories and items if any exist
        $validCategoryCodes = collect($categoriesData)->pluck('code')->all();
        $fakeCategories = ItemCategory::whereNotIn('code', $validCategoryCodes)->get();
        if ($fakeCategories->isNotEmpty()) {
            $fakeCategoryIds = $fakeCategories->pluck('id');
            $fakeItems = Item::whereIn('item_category_id', $fakeCategoryIds)->get();
            if ($fakeItems->isNotEmpty()) {
                $fakeItemIds = $fakeItems->pluck('id');
                ItemVariant::whereIn('item_id', $fakeItemIds)->delete();
                Inventory::whereIn('item_id', $fakeItemIds)->delete();
                InventoryProcurementItem::whereIn('item_id', $fakeItemIds)->delete();
                InventoryRequestItem::whereIn('item_id', $fakeItemIds)->delete();
                Item::whereIn('id', $fakeItemIds)->delete();
            }
            ItemCategory::whereIn('id', $fakeCategoryIds)->delete();
        }

        // 4. Seed categories, items, variants, and warehouse stocks
        foreach ($categoriesData as $catData) {
            $category = ItemCategory::firstOrCreate(
                ['code' => $catData['code']],
                [
                    'name' => $catData['name'],
                    'description' => $catData['description'],
                ]
            );

            foreach ($catData['items'] as $itemData) {
                $item = Item::updateOrCreate(
                    ['code' => $itemData['code']],
                    [
                        'item_category_id' => $category->id,
                        'name' => $itemData['name'],
                        'unit' => $itemData['unit'],
                        'minimal_quantity' => $itemData['minimal_quantity'],
                        'description' => $itemData['description'],
                    ]
                );

                if (! empty($itemData['variants'])) {
                    foreach ($itemData['variants'] as $variantName) {
                        $item->variants()->firstOrCreate(['name' => $variantName]);
                    }
                }

                // Populate initial inventory stock across warehouses
                foreach ($warehouses as $warehouse) {
                    $multiplier = match ($warehouse->code) {
                        'WH-ADMIN' => in_array($category->code, ['CAT-ATK', 'CAT-CLN', 'CAT-INK']) ? 3 : 1,
                        'WH-LAB' => in_array($category->code, ['CAT-IOT', 'CAT-NET', 'CAT-MNT']) ? 3 : 1,
                        default => 2,
                    };

                    $initialQuantity = (int) max(5, round($item->minimal_quantity * $multiplier));

                    Inventory::updateOrCreate(
                        [
                            'item_id' => $item->id,
                            'warehouse_id' => $warehouse->id,
                        ],
                        [
                            'quantity' => $initialQuantity,
                        ]
                    );
                }
            }
        }
    }
}
