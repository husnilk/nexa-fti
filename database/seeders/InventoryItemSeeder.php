<?php

namespace Database\Seeders;

use App\Models\Inventory;
use App\Models\Item;
use App\Models\ItemCategory;
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
                'description' => 'Daily office supplies, paper reams, writing instruments, and filing consumables.',
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
                ],
            ],
            [
                'code' => 'CAT-PERIPH',
                'name' => 'Computer Peripherals & Cables',
                'description' => 'Desktop peripherals, presentation adapters, audio/video cables, and storage devices.',
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
        ];

        // Ensure at least one warehouse exists
        $warehouses = Warehouse::all();
        if ($warehouses->isEmpty()) {
            $warehouses = collect([
                Warehouse::firstOrCreate(
                    ['code' => 'WH-MAIN'],
                    ['name' => 'Main Storage Room', 'location' => 'Building A Ground Floor', 'status' => 'active']
                ),
                Warehouse::firstOrCreate(
                    ['code' => 'WH-LAB'],
                    ['name' => 'Lab Hardware Depot', 'location' => 'Building B 2nd Floor', 'status' => 'active']
                ),
            ]);
        }

        foreach ($categoriesData as $catData) {
            $category = ItemCategory::firstOrCreate(
                ['code' => $catData['code']],
                [
                    'name' => $catData['name'],
                    'description' => $catData['description'],
                ]
            );

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

                // Populate initial inventory stock across warehouses
                foreach ($warehouses as $whIndex => $warehouse) {
                    $initialQuantity = match ($whIndex) {
                        0 => ($index % 2 === 0) ? $item->minimal_quantity * 3 : $item->minimal_quantity * 2,
                        default => ($index % 3 === 0) ? $item->minimal_quantity : (int) round($item->minimal_quantity * 1.5),
                    };

                    Inventory::updateOrCreate(
                        [
                            'item_id' => $item->id,
                            'warehouse_id' => $warehouse->id,
                        ],
                        [
                            'quantity' => max(5, $initialQuantity),
                        ]
                    );
                }
            }
        }
    }
}
