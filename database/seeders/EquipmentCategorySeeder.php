<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\EquipmentCategory;
use App\Models\EquipmentModel;
use Illuminate\Database\Seeder;

class EquipmentCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->categories() as $categoryData) {
            $category = EquipmentCategory::updateOrCreate(
                ['code' => $categoryData['code']],
                [
                    'name' => $categoryData['name'],
                    'description' => $categoryData['description'],
                ],
            );

            foreach ($categoryData['models'] as $modelData) {
                $equipmentModel = EquipmentModel::updateOrCreate(
                    [
                        'equipment_category_id' => $category->id,
                        'brand' => $modelData['brand'],
                        'model_name' => $modelData['model_name'],
                    ],
                    [
                        'manufacturer' => $modelData['manufacturer'],
                        'specification' => $modelData['specification'],
                        'default_useful_life' => $modelData['useful_life'],
                    ],
                );

                foreach ($modelData['units'] as $index => $unit) {
                    $this->seedUnit($category, $equipmentModel, $modelData, $unit, $index + 1);
                }
            }
        }
    }

    /**
     * Seed a single physical equipment unit for the given model.
     *
     * @param  array{serial_prefix: string, cost: int, useful_life: int}  $modelData
     * @param  array{0: string, 1: string, 2: string, 3?: string}  $unit
     */
    protected function seedUnit(EquipmentCategory $category, EquipmentModel $equipmentModel, array $modelData, array $unit, int $sequence): void
    {
        [$acquisitionDate, $condition, $status] = $unit;
        $year = substr($acquisitionDate, 0, 4);
        $equipmentNumber = sprintf('FTI/%s/%s/%s-%02d', $category->code, $year, $modelData['serial_prefix'], $sequence);

        Equipment::updateOrCreate(
            ['equipment_number' => $equipmentNumber],
            [
                'equipment_model_id' => $equipmentModel->id,
                'serial_number' => sprintf('%s%s%04d', $modelData['serial_prefix'], $year, $sequence),
                'acquisition_date' => $acquisitionDate,
                'acquisition_cost' => $modelData['cost'],
                'residual_value' => round($modelData['cost'] * 0.1),
                'useful_life' => $modelData['useful_life'],
                'condition' => $condition,
                'status' => $status,
                'qr_code' => 'FTI-EQ-'.str_replace('/', '-', $equipmentNumber),
                'notes' => $unit[3] ?? null,
            ],
        );
    }

    /**
     * Real office and laboratory equipment used in the faculty.
     *
     * Units are listed as [acquisition date, condition, status, notes?].
     *
     * @return array<int, array{code: string, name: string, description: string, models: array<int, array{manufacturer: string, brand: string, model_name: string, specification: string, useful_life: int, cost: int, serial_prefix: string, units: array<int, array<int, string>>}>}>
     */
    protected function categories(): array
    {
        return [
            [
                'code' => 'COMP',
                'name' => 'Computing',
                'description' => 'Laptops, Desktops, Servers, etc.',
                'models' => [
                    [
                        'manufacturer' => 'Lenovo',
                        'brand' => 'ThinkPad',
                        'model_name' => 'ThinkPad T14 Gen 4',
                        'specification' => 'Intel Core i7-1355U, 16GB DDR5, 512GB NVMe SSD, 14" WUXGA IPS, Windows 11 Pro',
                        'useful_life' => 4,
                        'cost' => 22500000,
                        'serial_prefix' => 'PF4T',
                        'units' => [
                            ['2024-03-12', 'excellent', 'in_use', 'Dipakai Dekan.'],
                            ['2024-03-12', 'excellent', 'in_use', 'Dipakai Wakil Dekan I.'],
                            ['2024-03-12', 'good', 'available'],
                        ],
                    ],
                    [
                        'manufacturer' => 'Dell Technologies',
                        'brand' => 'Dell',
                        'model_name' => 'Latitude 5440',
                        'specification' => 'Intel Core i5-1345U, 16GB DDR4, 512GB NVMe SSD, 14" FHD, Windows 11 Pro',
                        'useful_life' => 4,
                        'cost' => 18750000,
                        'serial_prefix' => 'DL54',
                        'units' => [
                            ['2023-08-21', 'good', 'in_use'],
                            ['2023-08-21', 'good', 'available'],
                            ['2023-08-21', 'damaged', 'maintenance', 'Engsel layar patah, menunggu suku cadang.'],
                        ],
                    ],
                    [
                        'manufacturer' => 'HP Inc.',
                        'brand' => 'HP',
                        'model_name' => 'ProDesk 400 G9 SFF',
                        'specification' => 'Intel Core i5-12500, 8GB DDR4, 512GB NVMe SSD, Windows 11 Pro, Keyboard & Mouse',
                        'useful_life' => 4,
                        'cost' => 12400000,
                        'serial_prefix' => 'HPD4',
                        'units' => [
                            ['2023-02-14', 'good', 'in_use', 'Bagian Akademik.'],
                            ['2023-02-14', 'good', 'in_use', 'Bagian Keuangan.'],
                            ['2023-02-14', 'fair', 'in_use', 'Bagian Umum & Kepegawaian.'],
                        ],
                    ],
                    [
                        'manufacturer' => 'Lenovo',
                        'brand' => 'ThinkCentre',
                        'model_name' => 'ThinkCentre M70q Gen 4 Tiny',
                        'specification' => 'Intel Core i5-13400T, 16GB DDR4, 512GB NVMe SSD, Windows 11 Pro',
                        'useful_life' => 4,
                        'cost' => 11200000,
                        'serial_prefix' => 'LM70',
                        'units' => [
                            ['2024-07-05', 'excellent', 'in_use', 'Laboratorium Komputasi Dasar.'],
                            ['2024-07-05', 'excellent', 'in_use', 'Laboratorium Komputasi Dasar.'],
                        ],
                    ],
                    [
                        'manufacturer' => 'Dell Technologies',
                        'brand' => 'Dell',
                        'model_name' => 'PowerEdge R750xs',
                        'specification' => '2x Intel Xeon Silver 4314, 128GB DDR4 ECC, 4x 1.92TB SAS SSD, PERC H755, Dual PSU 800W, 2U Rack',
                        'useful_life' => 5,
                        'cost' => 185000000,
                        'serial_prefix' => 'PER7',
                        'units' => [
                            ['2023-11-30', 'excellent', 'in_use', 'Server virtualisasi di ruang server FTI.'],
                        ],
                    ],
                    [
                        'manufacturer' => 'Dell Technologies',
                        'brand' => 'Dell',
                        'model_name' => 'P2422H Monitor 23.8"',
                        'specification' => '23.8" FHD IPS, 60Hz, HDMI, DisplayPort, VGA, USB 3.2 Hub, Height Adjustable',
                        'useful_life' => 4,
                        'cost' => 3350000,
                        'serial_prefix' => 'DP24',
                        'units' => [
                            ['2023-02-14', 'good', 'in_use'],
                            ['2023-02-14', 'good', 'in_use'],
                            ['2023-02-14', 'broken', 'disposed', 'Panel layar bergaris, tidak ekonomis untuk diperbaiki.'],
                        ],
                    ],
                ],
            ],
            [
                'code' => 'NET',
                'name' => 'Networking',
                'description' => 'Routers, Switches, Access Points, etc.',
                'models' => [
                    [
                        'manufacturer' => 'Cisco Systems',
                        'brand' => 'Cisco',
                        'model_name' => 'Catalyst 9200L-24T-4G',
                        'specification' => '24x 1GbE ports, 4x 1G SFP uplinks, Network Essentials license, Layer 3 managed switch',
                        'useful_life' => 5,
                        'cost' => 45500000,
                        'serial_prefix' => 'JAE9',
                        'units' => [
                            ['2022-09-19', 'good', 'in_use', 'Core switch gedung FTI lantai 1.'],
                            ['2022-09-19', 'good', 'in_use', 'Distribution switch gedung FTI lantai 2.'],
                        ],
                    ],
                    [
                        'manufacturer' => 'MikroTik',
                        'brand' => 'MikroTik',
                        'model_name' => 'CCR2004-16G-2S+',
                        'specification' => '16x Gigabit Ethernet, 2x 10G SFP+, 4-core ARM 1.7GHz, 4GB RAM, RouterOS L6',
                        'useful_life' => 5,
                        'cost' => 9600000,
                        'serial_prefix' => 'HDK0',
                        'units' => [
                            ['2023-05-08', 'excellent', 'in_use', 'Router gateway internet fakultas.'],
                        ],
                    ],
                    [
                        'manufacturer' => 'Ubiquiti Inc.',
                        'brand' => 'UniFi',
                        'model_name' => 'U6 Pro Access Point',
                        'specification' => 'WiFi 6 dual-band, 4x4 MU-MIMO 5GHz, up to 5.3 Gbps aggregate, PoE 802.3at, ceiling mount',
                        'useful_life' => 4,
                        'cost' => 3250000,
                        'serial_prefix' => 'U6PR',
                        'units' => [
                            ['2024-01-22', 'excellent', 'in_use', 'Ruang kuliah lantai 2.'],
                            ['2024-01-22', 'excellent', 'in_use', 'Ruang dosen.'],
                            ['2024-01-22', 'good', 'in_use', 'Ruang baca perpustakaan.'],
                            ['2024-01-22', 'good', 'available', 'Unit cadangan.'],
                        ],
                    ],
                    [
                        'manufacturer' => 'Fortinet',
                        'brand' => 'FortiGate',
                        'model_name' => 'FortiGate 60F',
                        'specification' => '10x GE RJ45, 10 Gbps firewall throughput, 700 Mbps threat protection, 1 year UTP bundle',
                        'useful_life' => 5,
                        'cost' => 15800000,
                        'serial_prefix' => 'FGT6',
                        'units' => [
                            ['2023-05-08', 'good', 'in_use', 'Firewall perimeter jaringan fakultas.'],
                        ],
                    ],
                ],
            ],
            [
                'code' => 'AV',
                'name' => 'Audio Visual',
                'description' => 'Projectors, Displays, Speakers, etc.',
                'models' => [
                    [
                        'manufacturer' => 'Seiko Epson',
                        'brand' => 'Epson',
                        'model_name' => 'EB-X51 Projector',
                        'specification' => '3LCD, XGA 1024x768, 3800 lumens, 16000:1 contrast, HDMI, VGA, USB',
                        'useful_life' => 4,
                        'cost' => 7650000,
                        'serial_prefix' => 'X5EB',
                        'units' => [
                            ['2022-08-01', 'good', 'in_use', 'Ruang kuliah 1.1.'],
                            ['2022-08-01', 'good', 'in_use', 'Ruang kuliah 1.2.'],
                            ['2022-08-01', 'fair', 'maintenance', 'Lampu redup, perlu penggantian lampu.'],
                            ['2022-08-01', 'good', 'available', 'Untuk peminjaman kegiatan.'],
                        ],
                    ],
                    [
                        'manufacturer' => 'Samsung Electronics',
                        'brand' => 'Samsung',
                        'model_name' => 'Flip Pro WM65B',
                        'specification' => '65" 4K UHD interactive display, 20-point touch, wireless screen sharing, mobile stand',
                        'useful_life' => 5,
                        'cost' => 62000000,
                        'serial_prefix' => 'WM65',
                        'units' => [
                            ['2024-02-26', 'excellent', 'in_use', 'Ruang rapat dekanat.'],
                        ],
                    ],
                    [
                        'manufacturer' => 'Logitech',
                        'brand' => 'Logitech',
                        'model_name' => 'MeetUp ConferenceCam',
                        'specification' => '4K Ultra HD camera, 120° FoV, integrated 3-mic array & speaker, USB plug-and-play',
                        'useful_life' => 4,
                        'cost' => 14500000,
                        'serial_prefix' => 'LMUP',
                        'units' => [
                            ['2023-10-10', 'excellent', 'in_use', 'Ruang rapat dekanat.'],
                            ['2023-10-10', 'good', 'available', 'Untuk sidang dan ujian daring.'],
                        ],
                    ],
                    [
                        'manufacturer' => 'TOA Corporation',
                        'brand' => 'TOA',
                        'model_name' => 'ZA-2240 Mixer Amplifier',
                        'specification' => '240W mixer amplifier, 5 mic inputs, 2 aux inputs, 100V/70V line output',
                        'useful_life' => 5,
                        'cost' => 5600000,
                        'serial_prefix' => 'ZA22',
                        'units' => [
                            ['2021-06-15', 'fair', 'in_use', 'Sistem tata suara aula seminar.'],
                        ],
                    ],
                    [
                        'manufacturer' => 'Sony',
                        'brand' => 'Sony',
                        'model_name' => 'Alpha a6400 Kit 16-50mm',
                        'specification' => '24.2MP APS-C mirrorless, 4K video, real-time eye AF, 16-50mm OSS kit lens',
                        'useful_life' => 4,
                        'cost' => 13800000,
                        'serial_prefix' => 'A64S',
                        'units' => [
                            ['2023-04-03', 'good', 'available', 'Dokumentasi kegiatan fakultas.'],
                        ],
                    ],
                ],
            ],
            [
                'code' => 'OFF',
                'name' => 'Office Equipment',
                'description' => 'Printers, Scanners, Photocopiers, etc.',
                'models' => [
                    [
                        'manufacturer' => 'Seiko Epson',
                        'brand' => 'Epson',
                        'model_name' => 'EcoTank L3210',
                        'specification' => 'Ink tank printer/scanner/copier, A4, 33 ppm draft, 5760 dpi, USB',
                        'useful_life' => 4,
                        'cost' => 2350000,
                        'serial_prefix' => 'X8GJ',
                        'units' => [
                            ['2023-01-16', 'good', 'in_use', 'Bagian Akademik.'],
                            ['2023-01-16', 'good', 'in_use', 'Bagian Kemahasiswaan.'],
                            ['2023-01-16', 'damaged', 'maintenance', 'Head printer tersumbat.'],
                        ],
                    ],
                    [
                        'manufacturer' => 'HP Inc.',
                        'brand' => 'HP',
                        'model_name' => 'LaserJet Pro M404dn',
                        'specification' => 'Monochrome laser, A4, 38 ppm, auto duplex, Gigabit Ethernet, 80,000 page duty cycle',
                        'useful_life' => 4,
                        'cost' => 5450000,
                        'serial_prefix' => 'PHBB',
                        'units' => [
                            ['2022-11-07', 'good', 'in_use', 'Bagian Keuangan.'],
                            ['2022-11-07', 'good', 'in_use', 'Tata Usaha Dekanat.'],
                        ],
                    ],
                    [
                        'manufacturer' => 'Canon',
                        'brand' => 'Canon',
                        'model_name' => 'imageRUNNER 2625i',
                        'specification' => 'Monochrome A3 multifunction copier, 25 ppm, duplex scan & print, network, 2x 550-sheet cassette',
                        'useful_life' => 5,
                        'cost' => 41500000,
                        'serial_prefix' => '3VNB',
                        'units' => [
                            ['2022-03-28', 'good', 'in_use', 'Ruang fotokopi Tata Usaha.'],
                        ],
                    ],
                    [
                        'manufacturer' => 'Fujitsu',
                        'brand' => 'Fujitsu',
                        'model_name' => 'fi-8170 Document Scanner',
                        'specification' => 'Duplex ADF scanner, 70 ppm / 140 ipm, 80-sheet ADF, USB 3.2 & Gigabit LAN',
                        'useful_life' => 4,
                        'cost' => 17200000,
                        'serial_prefix' => 'A9DK',
                        'units' => [
                            ['2024-05-20', 'excellent', 'in_use', 'Digitalisasi arsip akademik.'],
                        ],
                    ],
                    [
                        'manufacturer' => 'Fellowes',
                        'brand' => 'Fellowes',
                        'model_name' => 'Powershred 79Ci',
                        'specification' => 'Cross-cut shredder, 16 sheets per pass, 23L bin, jam proof, P-4 security level',
                        'useful_life' => 4,
                        'cost' => 6400000,
                        'serial_prefix' => 'FW79',
                        'units' => [
                            ['2023-06-12', 'good', 'in_use', 'Bagian Kepegawaian.'],
                        ],
                    ],
                    [
                        'manufacturer' => 'Daikin Industries',
                        'brand' => 'Daikin',
                        'model_name' => 'FTKC35UVM4 1.5 PK Inverter',
                        'specification' => 'Split AC inverter 1.5 PK, 12,000 BTU/h, R32 refrigerant, Coanda airflow',
                        'useful_life' => 5,
                        'cost' => 6900000,
                        'serial_prefix' => 'DKC3',
                        'units' => [
                            ['2021-09-06', 'good', 'in_use', 'Ruang Dekan.'],
                            ['2021-09-06', 'fair', 'in_use', 'Ruang rapat dekanat.'],
                            ['2021-09-06', 'broken', 'disposed', 'Kompresor rusak.'],
                        ],
                    ],
                ],
            ],
            [
                'code' => 'LAB',
                'name' => 'Laboratory',
                'description' => 'Scientific and research equipment.',
                'models' => [
                    [
                        'manufacturer' => 'RIGOL Technologies',
                        'brand' => 'Rigol',
                        'model_name' => 'DS1054Z Digital Oscilloscope',
                        'specification' => '4 channels, 50 MHz bandwidth, 1 GSa/s, 24 Mpts memory, 7" WVGA display',
                        'useful_life' => 8,
                        'cost' => 6800000,
                        'serial_prefix' => 'DS1Z',
                        'units' => [
                            ['2022-02-21', 'good', 'available', 'Laboratorium Sistem Komputer.'],
                            ['2022-02-21', 'good', 'available', 'Laboratorium Sistem Komputer.'],
                        ],
                    ],
                    [
                        'manufacturer' => 'Fluke Corporation',
                        'brand' => 'Fluke',
                        'model_name' => '117 True-RMS Multimeter',
                        'specification' => 'True-RMS, 600V AC/DC, non-contact voltage detection, auto-ranging, LoZ',
                        'useful_life' => 8,
                        'cost' => 4650000,
                        'serial_prefix' => 'FL11',
                        'units' => [
                            ['2022-02-21', 'good', 'available'],
                            ['2022-02-21', 'fair', 'in_use'],
                        ],
                    ],
                    [
                        'manufacturer' => 'NVIDIA',
                        'brand' => 'NVIDIA Jetson',
                        'model_name' => 'Jetson Orin Nano Developer Kit 8GB',
                        'specification' => '40 TOPS AI performance, 6-core Arm Cortex-A78AE, 1024-core Ampere GPU, 8GB LPDDR5',
                        'useful_life' => 4,
                        'cost' => 8200000,
                        'serial_prefix' => 'JONX',
                        'units' => [
                            ['2024-09-02', 'excellent', 'in_use', 'Laboratorium Kecerdasan Buatan.'],
                            ['2024-09-02', 'excellent', 'available', 'Laboratorium Kecerdasan Buatan.'],
                        ],
                    ],
                ],
            ],
        ];
    }
}
