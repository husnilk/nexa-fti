<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\InventoryProcurement;
use App\Models\InventoryRequest;
use App\Models\Item;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Warehouses, categories, items, and initial stock.
        $this->call(InventoryItemSeeder::class);

        $items = Item::all()->keyBy('code');

        $employees = Employee::query()->take(5)->get();
        if ($employees->count() < 2) {
            $employees = $employees->merge(Employee::factory(2)->create());
        }

        $this->seedProcurements($items, $employees);
        $this->seedRequests($items, $employees);
    }

    /**
     * Inbound workflow demo: purchase requests for office supplies.
     *
     * @param  Collection<string, Item>  $items
     * @param  Collection<int, Employee>  $employees
     */
    private function seedProcurements(Collection $items, Collection $employees): void
    {
        $procurements = [
            [
                'request_number' => 'PROC-2026-0001',
                'title' => 'Pengadaan ATK Semester Ganjil 2026/2027',
                'status' => 'approved',
                'days_ago' => 45,
                'items' => [
                    'ATK-HVS-A4-80' => 100,
                    'ATK-HVS-F4-75' => 50,
                    'ATK-PEN-BLK-DZ' => 20,
                    'ATK-WB-BLK-DZ' => 30,
                    'ATK-WB-BLU-DZ' => 15,
                    'ATK-MAP-A4-PACK' => 25,
                    'ATK-STP-REFILL-10' => 20,
                ],
            ],
            [
                'request_number' => 'PROC-2026-0002',
                'title' => 'Pengadaan Tinta & Toner Printer Triwulan IV',
                'status' => 'submitted',
                'days_ago' => 10,
                'items' => [
                    'PRN-EPS-003-BK' => 24,
                    'PRN-EPS-003-C' => 12,
                    'PRN-EPS-003-M' => 12,
                    'PRN-EPS-003-Y' => 12,
                    'PRN-TNR-HP-85A' => 8,
                ],
            ],
            [
                'request_number' => 'PROC-2026-0003',
                'title' => 'Pengadaan Konsumsi Rapat & Pantry Oktober 2026',
                'status' => 'approved',
                'days_ago' => 7,
                'items' => [
                    'PTR-AQUA-GALON' => 40,
                    'PTR-AQUA-600-DUS' => 20,
                    'PTR-KOPI-KAPAL-380' => 10,
                    'PTR-TEH-SARIWANGI' => 15,
                    'PTR-GULA-1KG' => 12,
                    'PTR-TISSUE-PASEO' => 36,
                ],
            ],
            [
                'request_number' => 'PROC-2026-0004',
                'title' => 'Pengadaan Bahan Kebersihan Gedung Kuliah',
                'status' => 'draft',
                'days_ago' => 2,
                'items' => [
                    'CLN-SOAP-HAND-450' => 30,
                    'CLN-FLOOR-16L' => 20,
                    'CLN-TISSUE-ROLL' => 25,
                    'CLN-BAG-TRASH-L' => 40,
                ],
            ],
            [
                'request_number' => 'PROC-2026-0005',
                'title' => 'Pengadaan Bahan Praktikum Sistem Tertanam',
                'status' => 'submitted',
                'days_ago' => 14,
                'items' => [
                    'IOT-MCU-ESP32-30P' => 30,
                    'IOT-BBD-830-MB102' => 30,
                    'IOT-JMP-MF-20CM' => 20,
                    'IOT-SNS-DHT11' => 25,
                    'IOT-SNS-HCSR04' => 25,
                ],
            ],
            [
                'request_number' => 'PROC-2026-0006',
                'title' => 'Pengadaan Bahan Instalasi Jaringan Lab Komputer 2',
                'status' => 'rejected',
                'days_ago' => 30,
                'items' => [
                    'NET-CBL-CAT6-305M' => 3,
                    'NET-RJ45-CAT6-BOX' => 4,
                    'NET-PTC-CAT6-15M' => 40,
                ],
            ],
            [
                'request_number' => 'PROC-2026-0007',
                'title' => 'Pengadaan Perlengkapan Seminar Nasional & Wisuda',
                'status' => 'draft',
                'days_ago' => 1,
                'items' => [
                    'FIL-PPR-LINEN-A4' => 10,
                    'FIL-ENV-CKL-F4' => 5,
                    // Not yet in the catalog: recorded by name only.
                    'Map Ijazah Bludru Logo Universitas' => 300,
                ],
            ],
        ];

        foreach ($procurements as $index => $data) {
            $createdAt = now()->subDays($data['days_ago']);
            $creator = $employees[$index % $employees->count()];

            $procurement = InventoryProcurement::updateOrCreate(
                ['request_number' => $data['request_number']],
                [
                    'title' => $data['title'],
                    'status' => $data['status'],
                    'created_by' => $creator->id,
                    'created_by_id' => $creator->id,
                    'approved_at' => $data['status'] === 'approved' ? $createdAt->copy()->addDays(2) : null,
                ]
            );

            $procurement->inventoryProcurementItems()->delete();

            foreach ($data['items'] as $key => $quantity) {
                $item = $items->get($key);

                $procurement->inventoryProcurementItems()->create([
                    'item_id' => $item?->id,
                    'item_name' => $item?->name ?? $key,
                    'quantity' => $quantity,
                ]);
            }
        }
    }

    /**
     * Outbound workflow demo: staff and lecturers requesting supplies.
     *
     * @param  Collection<string, Item>  $items
     * @param  Collection<int, Employee>  $employees
     */
    private function seedRequests(Collection $items, Collection $employees): void
    {
        $requests = [
            [
                'request_number' => 'REQ-2026-0001',
                'status' => 'fulfilled',
                'days_ago' => 30,
                'items' => [
                    'ATK-HVS-A4-80' => [10, 'Untuk cetak berkas akreditasi program studi.'],
                    'FIL-ORD-BTX-F4' => [6, 'Ordner biru untuk arsip borang akreditasi.'],
                ],
            ],
            [
                'request_number' => 'REQ-2026-0002',
                'status' => 'approved',
                'days_ago' => 6,
                'items' => [
                    'ATK-WB-BLK-DZ' => [2, 'Ruang kuliah H 1.1 dan H 1.2.'],
                    'ATK-WB-ERS-MAG' => [2, 'Pengganti penghapus yang hilang di kelas.'],
                    'IT-CBL-HDMI-3M' => [1, 'Kabel proyektor ruang H 1.2 rusak.'],
                ],
            ],
            [
                'request_number' => 'REQ-2026-0003',
                'status' => 'pending',
                'days_ago' => 2,
                'items' => [
                    'PTR-AQUA-600-DUS' => [3, 'Konsumsi rapat senat fakultas.'],
                    'PTR-TISSUE-PASEO' => [4, 'Ruang rapat dekanat.'],
                ],
            ],
            [
                'request_number' => 'REQ-2026-0004',
                'status' => 'pending',
                'days_ago' => 1,
                'items' => [
                    'IT-MOU-LOGI-B100' => [5, 'Mengganti mouse rusak di Lab Komputer 1.'],
                    'IT-KEY-LOGI-K120' => [3, 'Mengganti keyboard rusak di Lab Komputer 1.'],
                ],
            ],
            [
                'request_number' => 'REQ-2026-0005',
                'status' => 'rejected',
                'days_ago' => 12,
                'items' => [
                    'IT-FD-64GB-USB3' => [10, 'Untuk dibagikan ke peserta pelatihan.'],
                ],
            ],
            [
                'request_number' => 'REQ-2026-0006',
                'status' => 'fulfilled',
                'days_ago' => 20,
                'items' => [
                    'ATK-PCL-2B-BOX' => [4, 'Ujian tengah semester mata kuliah umum.'],
                    'FIL-ENV-CKL-F4' => [1, 'Amplop soal dan lembar jawaban UTS.'],
                    'ATK-TAPE-MSK-24' => [3, 'Label nomor kursi ruang ujian.'],
                ],
            ],
        ];

        $approver = $employees->first();

        foreach ($requests as $index => $data) {
            $requestDate = now()->subDays($data['days_ago']);
            $requester = $employees[($index + 1) % $employees->count()];
            $isDecided = in_array($data['status'], ['approved', 'rejected', 'fulfilled']);

            $request = InventoryRequest::updateOrCreate(
                ['request_number' => $data['request_number']],
                [
                    'employee_id' => $requester->id,
                    'request_date' => $requestDate->toDateString(),
                    'status' => $data['status'],
                    'approved_by' => $isDecided ? $approver->id : null,
                    'approved_by_id' => $isDecided ? $approver->id : null,
                    'approved_at' => $isDecided ? $requestDate->copy()->addDay() : null,
                ]
            );

            $request->inventoryRequestItems()->delete();

            foreach ($data['items'] as $code => [$quantity, $specification]) {
                $item = $items->get($code);

                $request->inventoryRequestItems()->create([
                    'item_id' => $item?->id,
                    'item_name' => $item?->name ?? $code,
                    'specification' => $specification,
                    'quantity' => $quantity,
                ]);
            }
        }
    }
}
