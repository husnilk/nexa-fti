<?php

namespace Database\Seeders;

use App\Models\Inventory;
use App\Models\Item;
use App\Models\ItemCategory;
use App\Models\Organization;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

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
                'description' => 'Daily office supplies, paper reams, writing instruments, and filing consumables.',
                'warehouse' => 'WH-ATK',
                'items' => [
                    [
                        'name' => 'Kertas HVS A4 80gsm PaperOne (500 Lembar)',
                        'code' => 'ATK-HVS-A4-80',
                        'unit' => 'rim',
                        'minimal_quantity' => 20,
                        'description' => 'Kertas HVS ukuran A4 80 gram premium putih untuk dokumen resmi dan surat menyurat.',
                    ],
                    [
                        'name' => 'Kertas HVS F4 / Folio 75gsm SiDU (500 Lembar)',
                        'code' => 'ATK-HVS-F4-75',
                        'unit' => 'rim',
                        'minimal_quantity' => 15,
                        'description' => 'Kertas HVS ukuran F4/Folio 75 gram untuk keperluan formulir dan berkas akademik.',
                    ],
                    [
                        'name' => 'Pulpen Gel Hitam Joyko JK-100 0.5mm (1 Lusin)',
                        'code' => 'ATK-PEN-BLK-DZ',
                        'unit' => 'box',
                        'minimal_quantity' => 10,
                        'description' => 'Pulpen gel warna hitam 0.5mm anti-macet untuk staf administrasi dan dosen.',
                    ],
                    [
                        'name' => 'Pulpen Gel Biru Joyko JK-100 0.5mm (1 Lusin)',
                        'code' => 'ATK-PEN-BLU-DZ',
                        'unit' => 'box',
                        'minimal_quantity' => 8,
                        'description' => 'Pulpen gel warna biru 0.5mm untuk keperluan tanda tangan dokumen resmi.',
                    ],
                    [
                        'name' => 'Spidol Whiteboard Snowman Boardmarker Hitam (1 Lusin)',
                        'code' => 'ATK-WB-BLK-DZ',
                        'unit' => 'box',
                        'minimal_quantity' => 12,
                        'description' => 'Spidol papan tulis putih warna hitam mudah dihapus untuk ruang kelas dan laboratorium.',
                    ],
                    [
                        'name' => 'Spidol Whiteboard Snowman Boardmarker Biru (1 Lusin)',
                        'code' => 'ATK-WB-BLU-DZ',
                        'unit' => 'box',
                        'minimal_quantity' => 8,
                        'description' => 'Spidol papan tulis putih warna biru untuk ruang perkuliahan.',
                    ],
                    [
                        'name' => 'Penghapus Papan Tulis Whiteboard Magnetik Joyko',
                        'code' => 'ATK-WB-ERS-MAG',
                        'unit' => 'pcs',
                        'minimal_quantity' => 10,
                        'description' => 'Penghapus whiteboard dengan magnet terintegrasi, dapat menempel pada papan tulis.',
                    ],
                    [
                        'name' => 'Stapler Joyko HD-10 & Isi Staples No. 10',
                        'code' => 'ATK-STP-HD10-SET',
                        'unit' => 'set',
                        'minimal_quantity' => 10,
                        'description' => 'Set stapler kecil ukuran HD-10 beserta 1 kotak isi staples no. 10.',
                    ],
                    [
                        'name' => 'Binder Clip No. 155 (32mm) Joyko (1 Kotak / 12 Pcs)',
                        'code' => 'ATK-BCLP-155-BOX',
                        'unit' => 'box',
                        'minimal_quantity' => 8,
                        'description' => 'Klip penjepit berkas kertas ukuran 32mm isi 12 buah per kotak.',
                    ],
                    [
                        'name' => 'Map Plastik L-Folder Transparan A4 (Isi 12 Pcs)',
                        'code' => 'ATK-MAP-A4-PACK',
                        'unit' => 'pack',
                        'minimal_quantity' => 15,
                        'description' => 'Map dokumen plastik bening L-shaped untuk pengarsipan berkas mahasiswa dan ujian.',
                    ],
                    [
                        'name' => 'Pensil 2B Faber-Castell (1 Kotak / 12 Pcs)',
                        'code' => 'ATK-PCL-2B-BOX',
                        'unit' => 'box',
                        'minimal_quantity' => 5,
                        'description' => 'Pensil grafit 2B untuk lembar jawaban komputer ujian dan seleksi mahasiswa.',
                    ],
                    [
                        'name' => 'Stabilo Boss Original Kuning',
                        'code' => 'ATK-HLT-STB-YLW',
                        'unit' => 'pcs',
                        'minimal_quantity' => 12,
                        'description' => 'Highlighter untuk menandai dokumen, draf SK, dan berkas akreditasi.',
                    ],
                    [
                        'name' => 'Correction Tape Kenko CT-522',
                        'code' => 'ATK-CRT-KENKO',
                        'unit' => 'pcs',
                        'minimal_quantity' => 12,
                        'description' => 'Pita koreksi 5mm x 6m untuk perbaikan tulisan pada formulir dan surat.',
                    ],
                    [
                        'name' => 'Isi Staples Max No. 10-1M (1 Kotak Kecil / 20 Pak)',
                        'code' => 'ATK-STP-REFILL-10',
                        'unit' => 'box',
                        'minimal_quantity' => 10,
                        'description' => 'Isi ulang staples ukuran no. 10 untuk stapler HD-10.',
                    ],
                    [
                        'name' => 'Paper Clip Joyko No. 3 (1 Kotak / 100 Pcs)',
                        'code' => 'ATK-CLP-NO3-BOX',
                        'unit' => 'box',
                        'minimal_quantity' => 10,
                        'description' => 'Penjepit kertas kawat untuk menyatukan lembaran dokumen tipis.',
                    ],
                    [
                        'name' => 'Sticky Notes Post-it 3M 654 (76 x 76 mm)',
                        'code' => 'ATK-STN-POSTIT-76',
                        'unit' => 'pad',
                        'minimal_quantity' => 15,
                        'description' => 'Kertas catatan tempel kuning untuk memo dan penanda halaman.',
                    ],
                    [
                        'name' => 'Lakban Bening Daimaru 48mm x 90 Yard',
                        'code' => 'ATK-TAPE-CLR-48',
                        'unit' => 'roll',
                        'minimal_quantity' => 10,
                        'description' => 'Selotip lebar bening untuk pengemasan kardus arsip dan pengiriman dokumen.',
                    ],
                    [
                        'name' => 'Lakban Kertas / Masking Tape Nachi 24mm',
                        'code' => 'ATK-TAPE-MSK-24',
                        'unit' => 'roll',
                        'minimal_quantity' => 10,
                        'description' => 'Lakban kertas untuk menempel pengumuman dan label ruangan ujian.',
                    ],
                    [
                        'name' => 'Lem Stick UHU Glue Stick 21 gram',
                        'code' => 'ATK-GLU-UHU-21',
                        'unit' => 'pcs',
                        'minimal_quantity' => 10,
                        'description' => 'Lem batang untuk kertas, amplop, dan label berkas.',
                    ],
                    [
                        'name' => 'Gunting Kertas Joyko SC-848 (8.5 Inch)',
                        'code' => 'ATK-SCS-JOYKO-848',
                        'unit' => 'pcs',
                        'minimal_quantity' => 5,
                        'description' => 'Gunting kertas stainless untuk keperluan administrasi.',
                    ],
                    [
                        'name' => 'Cutter Kenko L-500 + Isi Mata Cutter',
                        'code' => 'ATK-CUT-L500-SET',
                        'unit' => 'set',
                        'minimal_quantity' => 5,
                        'description' => 'Pisau cutter besar beserta isi ulang mata pisau.',
                    ],
                    [
                        'name' => 'Tinta Stempel Artline Biru 50cc',
                        'code' => 'ATK-INK-STAMP-BLU',
                        'unit' => 'bottle',
                        'minimal_quantity' => 4,
                        'description' => 'Tinta isi ulang bantalan stempel dinas fakultas dan jurusan.',
                    ],
                    [
                        'name' => 'Baterai Kalkulator / Jam Dinding Panasonic CR2032',
                        'code' => 'ATK-BAT-CR2032',
                        'unit' => 'pcs',
                        'minimal_quantity' => 6,
                        'description' => 'Baterai koin 3V untuk kalkulator, timbangan digital, dan remote AC.',
                    ],
                ],
            ],
            [
                'code' => 'CAT-FILE',
                'name' => 'Envelopes, Forms & Filing',
                'description' => 'Envelopes, binders, folders, and printed forms for correspondence and archives.',
                'warehouse' => 'WH-ATK',
                'items' => [
                    [
                        'name' => 'Amplop Putih Polos Paperline No. 110 (1 Kotak / 100 Pcs)',
                        'code' => 'FIL-ENV-110-BOX',
                        'unit' => 'box',
                        'minimal_quantity' => 5,
                        'description' => 'Amplop surat dinas ukuran 110 x 230 mm untuk korespondensi keluar.',
                    ],
                    [
                        'name' => 'Amplop Cokelat Kabinet Folio Jaya (1 Pak / 100 Pcs)',
                        'code' => 'FIL-ENV-CKL-F4',
                        'unit' => 'pack',
                        'minimal_quantity' => 5,
                        'description' => 'Amplop cokelat ukuran folio untuk berkas soal ujian, ijazah, dan dokumen penting.',
                    ],
                    [
                        'name' => 'Ordner Bantex 1450 Folio 7cm Biru',
                        'code' => 'FIL-ORD-BTX-F4',
                        'unit' => 'pcs',
                        'minimal_quantity' => 12,
                        'description' => 'Box file / ordner untuk arsip surat masuk, surat keluar, dan SK.',
                    ],
                    [
                        'name' => 'Map Snelhecter Plastik Bantex Folio',
                        'code' => 'FIL-SNH-BTX-F4',
                        'unit' => 'pcs',
                        'minimal_quantity' => 20,
                        'description' => 'Map penjepit berkas untuk usulan kenaikan pangkat dan berkas dosen.',
                    ],
                    [
                        'name' => 'Stopmap Kertas Folio Diamond (1 Pak / 50 Pcs)',
                        'code' => 'FIL-STM-F4-PACK',
                        'unit' => 'pack',
                        'minimal_quantity' => 4,
                        'description' => 'Map kertas warna untuk pengelompokan berkas administrasi akademik.',
                    ],
                    [
                        'name' => 'Box Arsip Kardus Bantex 4011 Folio',
                        'code' => 'FIL-BOX-ARSIP-F4',
                        'unit' => 'pcs',
                        'minimal_quantity' => 10,
                        'description' => 'Kotak arsip karton untuk penyimpanan inaktif dokumen tahunan.',
                    ],
                    [
                        'name' => 'Buku Agenda Surat / Ekspedisi Folio 100 Lembar',
                        'code' => 'FIL-BOOK-EKSP',
                        'unit' => 'pcs',
                        'minimal_quantity' => 4,
                        'description' => 'Buku register surat masuk/keluar dan buku ekspedisi pengantaran dokumen.',
                    ],
                    [
                        'name' => 'Kertas Sertifikat Linen A4 220gsm (1 Pak / 50 Lembar)',
                        'code' => 'FIL-PPR-LINEN-A4',
                        'unit' => 'pack',
                        'minimal_quantity' => 4,
                        'description' => 'Kertas bertekstur untuk sertifikat seminar, piagam, dan penghargaan.',
                    ],
                ],
            ],
            [
                'code' => 'CAT-PERIPH',
                'name' => 'Computer Peripherals & Cables',
                'description' => 'Desktop peripherals, presentation adapters, audio/video cables, and storage devices.',
                'warehouse' => 'WH-IT',
                'items' => [
                    [
                        'name' => 'Mouse USB Optical Logitech B100',
                        'code' => 'IT-MOU-LOGI-B100',
                        'unit' => 'unit',
                        'minimal_quantity' => 10,
                        'description' => 'Mouse USB kabel standar 800 DPI untuk PC laboratorium dan staf.',
                    ],
                    [
                        'name' => 'Keyboard USB Standar Logitech K120',
                        'code' => 'IT-KEY-LOGI-K120',
                        'unit' => 'unit',
                        'minimal_quantity' => 8,
                        'description' => 'Keyboard USB tahan tumpahan air dengan layout full-size untuk laboratorium komputer.',
                    ],
                    [
                        'name' => 'Kabel HDMI to HDMI 2.0 4K Ultra HD (3 Meter)',
                        'code' => 'IT-CBL-HDMI-3M',
                        'unit' => 'unit',
                        'minimal_quantity' => 10,
                        'description' => 'Kabel display HDMI gold plated 3 meter untuk proyektor ruang kelas dan rapat.',
                    ],
                    [
                        'name' => 'Kabel HDMI to HDMI 2.0 4K Ultra HD (5 Meter)',
                        'code' => 'IT-CBL-HDMI-5M',
                        'unit' => 'unit',
                        'minimal_quantity' => 6,
                        'description' => 'Kabel display HDMI 5 meter untuk ruang seminar dan auditorium.',
                    ],
                    [
                        'name' => 'Adapter Konverter USB-C Multiport to HDMI + VGA + USB 3.0',
                        'code' => 'IT-ADP-USBC-HV',
                        'unit' => 'unit',
                        'minimal_quantity' => 6,
                        'description' => 'Dongle USB Type-C multifungsi untuk presentasi laptop dosen ke proyektor.',
                    ],
                    [
                        'name' => 'Flashdisk Kingston DataTraveler 64GB USB 3.2',
                        'code' => 'IT-FD-64GB-USB3',
                        'unit' => 'unit',
                        'minimal_quantity' => 10,
                        'description' => 'Media penyimpanan USB 64GB untuk transfer data kurikulum dan instalasi software.',
                    ],
                    [
                        'name' => 'Kabel Audio AUX 3.5mm Male to Male (2 Meter)',
                        'code' => 'IT-CBL-AUX-2M',
                        'unit' => 'unit',
                        'minimal_quantity' => 5,
                        'description' => 'Kabel jack audio stereo 3.5mm untuk sambungan speaker active di kelas multimedia.',
                    ],
                    [
                        'name' => 'Kabel Power Stop Kontak 5 Lubang Uticon 3 Meter',
                        'code' => 'IT-PWR-STRIP-5L',
                        'unit' => 'unit',
                        'minimal_quantity' => 8,
                        'description' => 'Stop kontak kabel arde 5 soket dengan saklar switch independen untuk lab praktikum.',
                    ],
                ],
            ],
            [
                'code' => 'CAT-NET',
                'name' => 'Networking & Cabling Supplies',
                'description' => 'Ethernet patch cords, bulk cabling, crimping connectors, and network diagnostic tools.',
                'warehouse' => 'WH-IT',
                'items' => [
                    [
                        'name' => 'Kabel UTP Cat6 Belden Original 1 Roll (305 Meter)',
                        'code' => 'NET-CBL-CAT6-305M',
                        'unit' => 'roll',
                        'minimal_quantity' => 2,
                        'description' => 'Kabel jaringan UTP Cat6 1000Mbps gigabit untuk instalasi jaringan LAN gedung fakultas.',
                    ],
                    [
                        'name' => 'Patch Cord UTP Cat6 Factory Crimped (1.5 Meter)',
                        'code' => 'NET-PTC-CAT6-15M',
                        'unit' => 'pcs',
                        'minimal_quantity' => 25,
                        'description' => 'Kabel patch cord Cat6 cetakan pabrik 1.5 meter untuk switch ke PC desktop.',
                    ],
                    [
                        'name' => 'Patch Cord UTP Cat6 Factory Crimped (3 Meter)',
                        'code' => 'NET-PTC-CAT6-3M',
                        'unit' => 'pcs',
                        'minimal_quantity' => 15,
                        'description' => 'Kabel patch cord Cat6 cetakan pabrik 3 meter untuk koneksi server dan access point.',
                    ],
                    [
                        'name' => 'Konektor RJ-45 Cat6 CommScope / AMP (Kotak Isi 50)',
                        'code' => 'NET-RJ45-CAT6-BOX',
                        'unit' => 'box',
                        'minimal_quantity' => 6,
                        'description' => 'Konektor RJ45 Cat6 berlapis emas untuk terminasi kabel jaringan LAN.',
                    ],
                    [
                        'name' => 'Tang Crimping RJ45 / RJ11 Multifungsi Heavy Duty',
                        'code' => 'NET-TOOL-CRIMP-HD',
                        'unit' => 'unit',
                        'minimal_quantity' => 4,
                        'description' => 'Alat crimping kabel jaringan dan pemotong kabel berpresisi tinggi.',
                    ],
                    [
                        'name' => 'Network Cable Tester RJ45 & RJ11 with Master/Remote',
                        'code' => 'NET-TESTER-LAN',
                        'unit' => 'unit',
                        'minimal_quantity' => 4,
                        'description' => 'Tester kontinuitas dan urutan kabel LAN UTP/STP dengan indikator LED.',
                    ],
                    [
                        'name' => 'Barrel Coupler RJ45 Female to Female Adapter',
                        'code' => 'NET-CPLR-RJ45-FF',
                        'unit' => 'pcs',
                        'minimal_quantity' => 15,
                        'description' => 'Penyambung kabel LAN RJ45 gigabit female-to-female modular.',
                    ],
                ],
            ],
            [
                'code' => 'CAT-INK',
                'name' => 'Printer Inks & Toner',
                'description' => 'Original ink refills and toner cartridges for faculty office printers and multi-function copiers.',
                'warehouse' => 'WH-ATK',
                'items' => [
                    [
                        'name' => 'Tinta Botol Epson 003 Black Original (65ml)',
                        'code' => 'PRN-EPS-003-BK',
                        'unit' => 'bottle',
                        'minimal_quantity' => 12,
                        'description' => 'Tinta hitam original Epson seri L3110 / L3150 / L3210 / L5290.',
                    ],
                    [
                        'name' => 'Tinta Botol Epson 003 Cyan Original (65ml)',
                        'code' => 'PRN-EPS-003-C',
                        'unit' => 'bottle',
                        'minimal_quantity' => 6,
                        'description' => 'Tinta biru cyan original Epson seri EcoTank.',
                    ],
                    [
                        'name' => 'Tinta Botol Epson 003 Magenta Original (65ml)',
                        'code' => 'PRN-EPS-003-M',
                        'unit' => 'bottle',
                        'minimal_quantity' => 6,
                        'description' => 'Tinta merah magenta original Epson seri EcoTank.',
                    ],
                    [
                        'name' => 'Tinta Botol Epson 003 Yellow Original (65ml)',
                        'code' => 'PRN-EPS-003-Y',
                        'unit' => 'bottle',
                        'minimal_quantity' => 6,
                        'description' => 'Tinta kuning yellow original Epson seri EcoTank.',
                    ],
                    [
                        'name' => 'Toner Cartridge HP LaserJet 85A (CE285A) Compatible',
                        'code' => 'PRN-TNR-HP-85A',
                        'unit' => 'unit',
                        'minimal_quantity' => 5,
                        'description' => 'Cartridge toner hitam monokrom untuk printer laser HP P1102 / M1212nf.',
                    ],
                    [
                        'name' => 'Toner Cartridge Canon 325 / 725 Black',
                        'code' => 'PRN-TNR-CANON-325',
                        'unit' => 'unit',
                        'minimal_quantity' => 4,
                        'description' => 'Cartridge toner untuk printer Canon LBP6000 / LBP6030.',
                    ],
                ],
            ],
            [
                'code' => 'CAT-IOT',
                'name' => 'Laboratory & IoT Electronics',
                'description' => 'Microcontrollers, sensors, jumper wires, and breadboards for student IoT & Embedded Systems labs.',
                'warehouse' => 'WH-LAB',
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
                        'description' => 'Board mikrokontroler standar praktikum sistem tertanam dan robotika.',
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
            [
                'code' => 'CAT-MNT',
                'name' => 'Cleaning & Hardware Maintenance',
                'description' => 'Antistatic wipes, screen cleaner solutions, thermal pastes, and alkaline batteries.',
                'warehouse' => 'WH-IT',
                'items' => [
                    [
                        'name' => 'Cairan Pembersih Layar Screen Cleaner Spray 250ml + Microfiber',
                        'code' => 'MNT-CLN-SCR-250',
                        'unit' => 'bottle',
                        'minimal_quantity' => 10,
                        'description' => 'Formula pembersih layar anti-gores dan anti-statis untuk monitor lab dan proyektor.',
                    ],
                    [
                        'name' => 'Kain Lap Microfiber Antistatik Halus 30x30cm',
                        'code' => 'MNT-CLOTH-MCF-30',
                        'unit' => 'pcs',
                        'minimal_quantity' => 20,
                        'description' => 'Kain mikrofiber lembut penyerap debu tanpa meninggalkan serat pada hardware.',
                    ],
                    [
                        'name' => 'Thermal Paste Prosesor Arctic MX-4 (Spuit 4 Gram)',
                        'code' => 'MNT-TP-ARCTIC-4G',
                        'unit' => 'unit',
                        'minimal_quantity' => 6,
                        'description' => 'Pasta pendingin konduktivitas termal tinggi untuk CPU lab dan workstation dosen.',
                    ],
                    [
                        'name' => 'Baterai AA Alkaline ABC Millenium 1.5V (Isi 4 Butir)',
                        'code' => 'MNT-BAT-AA-4PK',
                        'unit' => 'pack',
                        'minimal_quantity' => 15,
                        'description' => 'Baterai ukuran AA untuk remote proyektor, pointer laser, dan mouse wireless.',
                    ],
                    [
                        'name' => 'Baterai AAA Alkaline ABC Millenium 1.5V (Isi 4 Butir)',
                        'code' => 'MNT-BAT-AAA-4PK',
                        'unit' => 'pack',
                        'minimal_quantity' => 15,
                        'description' => 'Baterai ukuran AAA untuk presenter remote nirkabel dan perangkat lab.',
                    ],
                    [
                        'name' => 'Kabel Ties / Cable Ties Nylon 20cm Hitam (Isi 100 Pcs)',
                        'code' => 'MNT-TIE-NYL-20CM',
                        'unit' => 'pack',
                        'minimal_quantity' => 10,
                        'description' => 'Pengikat kabel nilon tahan panas untuk manajemen kerapian kabel meja lab dan server.',
                    ],
                ],
            ],
            [
                'code' => 'CAT-PANTRY',
                'name' => 'Pantry & Meeting Refreshments',
                'description' => 'Drinking water, coffee, tea, and pantry consumables for offices and faculty meetings.',
                'warehouse' => 'WH-RT',
                'items' => [
                    [
                        'name' => 'Air Mineral Aqua Galon 19 Liter (Isi Ulang)',
                        'code' => 'PTR-AQUA-GALON',
                        'unit' => 'galon',
                        'minimal_quantity' => 10,
                        'description' => 'Air minum galon untuk dispenser ruang dosen, tata usaha, dan ruang rapat.',
                    ],
                    [
                        'name' => 'Air Mineral Aqua Botol 600ml (1 Dus / 24 Botol)',
                        'code' => 'PTR-AQUA-600-DUS',
                        'unit' => 'dus',
                        'minimal_quantity' => 10,
                        'description' => 'Air minum kemasan botol untuk konsumsi rapat, seminar, dan sidang.',
                    ],
                    [
                        'name' => 'Air Mineral Aqua Gelas 220ml (1 Dus / 48 Gelas)',
                        'code' => 'PTR-AQUA-220-DUS',
                        'unit' => 'dus',
                        'minimal_quantity' => 10,
                        'description' => 'Air minum gelas untuk tamu dan kegiatan ujian.',
                    ],
                    [
                        'name' => 'Kopi Bubuk Kapal Api Special 380 gram',
                        'code' => 'PTR-KOPI-KAPAL-380',
                        'unit' => 'pack',
                        'minimal_quantity' => 6,
                        'description' => 'Kopi bubuk untuk pantry ruang pimpinan dan ruang rapat.',
                    ],
                    [
                        'name' => 'Kopi Sachet Good Day / Kopiko (1 Renceng / 10 Sachet)',
                        'code' => 'PTR-KOPI-SACHET',
                        'unit' => 'renceng',
                        'minimal_quantity' => 10,
                        'description' => 'Kopi instan sachet untuk suguhan tamu dan lembur.',
                    ],
                    [
                        'name' => 'Teh Celup Sariwangi (1 Kotak / 25 Kantong)',
                        'code' => 'PTR-TEH-SARIWANGI',
                        'unit' => 'box',
                        'minimal_quantity' => 10,
                        'description' => 'Teh celup untuk pantry dan konsumsi rapat.',
                    ],
                    [
                        'name' => 'Gula Pasir Gulaku 1 Kg',
                        'code' => 'PTR-GULA-1KG',
                        'unit' => 'pack',
                        'minimal_quantity' => 8,
                        'description' => 'Gula pasir kemasan untuk pantry.',
                    ],
                    [
                        'name' => 'Gelas Plastik Sekali Pakai 8 oz (1 Pak / 50 Pcs)',
                        'code' => 'PTR-CUP-8OZ',
                        'unit' => 'pack',
                        'minimal_quantity' => 6,
                        'description' => 'Gelas plastik untuk dispenser air minum di ruang tunggu dan rapat.',
                    ],
                    [
                        'name' => 'Tisu Wajah Paseo 250 Sheets 2 Ply',
                        'code' => 'PTR-TISSUE-PASEO',
                        'unit' => 'pack',
                        'minimal_quantity' => 24,
                        'description' => 'Tisu kotak untuk meja rapat, ruang pimpinan, dan pelayanan.',
                    ],
                ],
            ],
            [
                'code' => 'CAT-CLEAN',
                'name' => 'Cleaning & Household Supplies',
                'description' => 'Cleaning agents, sanitation supplies, and household consumables for offices, toilets, and classrooms.',
                'warehouse' => 'WH-RT',
                'items' => [
                    [
                        'name' => 'Sabun Cuci Tangan Lifebuoy Refill 450ml',
                        'code' => 'CLN-SOAP-HAND-450',
                        'unit' => 'pouch',
                        'minimal_quantity' => 20,
                        'description' => 'Isi ulang sabun cair untuk wastafel toilet dan pantry.',
                    ],
                    [
                        'name' => 'Sabun Cuci Piring Sunlight Jeruk Nipis 755ml',
                        'code' => 'CLN-SOAP-DISH-755',
                        'unit' => 'pouch',
                        'minimal_quantity' => 6,
                        'description' => 'Sabun pencuci gelas dan piring pantry.',
                    ],
                    [
                        'name' => 'Pembersih Lantai SOS / Super Pell 1.6 Liter',
                        'code' => 'CLN-FLOOR-16L',
                        'unit' => 'pouch',
                        'minimal_quantity' => 10,
                        'description' => 'Cairan pel lantai untuk koridor, kelas, dan ruang kantor.',
                    ],
                    [
                        'name' => 'Pembersih Kaca Cling 425ml (Spray)',
                        'code' => 'CLN-GLASS-CLING',
                        'unit' => 'bottle',
                        'minimal_quantity' => 6,
                        'description' => 'Cairan pembersih kaca jendela, pintu kaca, dan meja kaca.',
                    ],
                    [
                        'name' => 'Pembersih Porselen Harpic 450ml',
                        'code' => 'CLN-TOILET-HARPIC',
                        'unit' => 'bottle',
                        'minimal_quantity' => 8,
                        'description' => 'Pembersih kloset dan lantai kamar mandi.',
                    ],
                    [
                        'name' => 'Pengharum Ruangan Stella Matic Refill 225ml',
                        'code' => 'CLN-FRESH-STELLA',
                        'unit' => 'can',
                        'minimal_quantity' => 8,
                        'description' => 'Isi ulang pengharum ruangan otomatis untuk ruang pimpinan dan toilet.',
                    ],
                    [
                        'name' => 'Tisu Toilet Nice Gulung (1 Pak / 10 Roll)',
                        'code' => 'CLN-TISSUE-ROLL',
                        'unit' => 'pack',
                        'minimal_quantity' => 10,
                        'description' => 'Tisu gulung untuk toilet dosen, staf, dan mahasiswa.',
                    ],
                    [
                        'name' => 'Kantong Sampah Hitam 60 x 100 cm (1 Pak / 10 Lembar)',
                        'code' => 'CLN-BAG-TRASH-L',
                        'unit' => 'pack',
                        'minimal_quantity' => 20,
                        'description' => 'Kantong plastik sampah ukuran besar untuk tempat sampah koridor dan kelas.',
                    ],
                    [
                        'name' => 'Lap Pel Microfiber + Tongkat Pel Putar (Spin Mop Refill)',
                        'code' => 'CLN-MOP-REFILL',
                        'unit' => 'pcs',
                        'minimal_quantity' => 4,
                        'description' => 'Kepala pel pengganti untuk alat pel putar petugas kebersihan.',
                    ],
                ],
            ],
        ];

        $warehouses = $this->ensureWarehouses();

        foreach ($categoriesData as $catData) {
            $category = ItemCategory::updateOrCreate(
                ['code' => $catData['code']],
                [
                    'name' => $catData['name'],
                    'description' => $catData['description'],
                ]
            );

            $warehouse = $warehouses->get($catData['warehouse']) ?? $warehouses->first();

            foreach ($catData['items'] as $index => $itemData) {
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

                // Keep a few items below their minimum so low-stock alerts have data.
                $quantity = match (true) {
                    $index % 7 === 3 => intdiv($item->minimal_quantity, 2),
                    $index % 2 === 0 => $item->minimal_quantity * 3,
                    default => $item->minimal_quantity * 2,
                };

                Inventory::updateOrCreate(
                    [
                        'item_id' => $item->id,
                        'warehouse_id' => $warehouse->id,
                    ],
                    [
                        'quantity' => $quantity,
                    ]
                );
            }
        }
    }

    /**
     * Create the faculty storage rooms, keyed by warehouse code.
     *
     * @return Collection<string, Warehouse>
     */
    private function ensureWarehouses(): Collection
    {
        $organization = Organization::first() ?? Organization::factory()->create();

        $warehouses = [
            [
                'code' => 'WH-ATK',
                'name' => 'Gudang ATK & Arsip',
                'description' => 'Gudang alat tulis kantor, kertas, tinta printer, dan perlengkapan arsip di Gedung Dekanat lantai 1.',
            ],
            [
                'code' => 'WH-IT',
                'name' => 'Gudang Perangkat TI',
                'description' => 'Penyimpanan periferal komputer, bahan jaringan, dan suku cadang perawatan di ruang server.',
            ],
            [
                'code' => 'WH-LAB',
                'name' => 'Gudang Laboratorium',
                'description' => 'Penyimpanan bahan praktikum elektronika dan IoT di gedung laboratorium.',
            ],
            [
                'code' => 'WH-RT',
                'name' => 'Gudang Rumah Tangga',
                'description' => 'Penyimpanan konsumsi pantry dan bahan kebersihan yang dikelola bagian umum.',
            ],
        ];

        return collect($warehouses)->mapWithKeys(fn (array $data) => [
            $data['code'] => Warehouse::updateOrCreate(
                ['code' => $data['code']],
                [
                    'organization_id' => $organization->id,
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'is_active' => true,
                ]
            ),
        ]);
    }
}
