<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\InventoryProcurement;
use App\Models\InventoryProcurementItem;
use App\Models\InventoryRequest;
use App\Models\InventoryRequestItem;
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
        // 1. Seed real office categories, items, variants, warehouses, and inventory stock
        $this->call(InventoryItemSeeder::class);

        // 2. Ensure Employees exist for procurement & request workflows
        $employees = Employee::all();
        if ($employees->isEmpty()) {
            $employees = Employee::factory(5)->create();
        }

        // 3. Create realistic Procurements (Inbound workflow demo) using real office items
        $this->seedProcurements($employees);

        // 4. Create realistic Requests (Outbound workflow demo) using real office items
        $this->seedRequests($employees);
    }

    /**
     * Seed realistic procurements using existing real office items.
     *
     * @param  Collection<int, Employee>  $employees
     */
    protected function seedProcurements($employees): void
    {
        $procurementSpecs = [
            [
                'request_number' => 'PROC-2026-001',
                'title' => 'Pengadaan Rutin Kebutuhan ATK dan Kertas Kantor Triwulan I',
                'status' => 'approved',
                'approved_at' => now()->subDays(14),
                'items' => [
                    ['code' => 'ATK-HVS-A4-80', 'quantity' => 40],
                    ['code' => 'ATK-PEN-BLK-DZ', 'quantity' => 20],
                    ['code' => 'ATK-WB-BLK-DZ', 'quantity' => 15],
                    ['code' => 'ATK-MAP-A4-PACK', 'quantity' => 25],
                    ['code' => 'ATK-STP-HD10-SET', 'quantity' => 10],
                ],
            ],
            [
                'request_number' => 'PROC-2026-002',
                'title' => 'Pengadaan Tinta Printer dan Periferal IT Ruang Rapat Dekanat',
                'status' => 'approved',
                'approved_at' => now()->subDays(5),
                'items' => [
                    ['code' => 'PRN-EPS-003-BK', 'quantity' => 12],
                    ['code' => 'IT-CBL-HDMI-3M', 'quantity' => 5],
                    ['code' => 'IT-MOU-LOGI-B100', 'quantity' => 8],
                    ['code' => 'IT-PWR-STRIP-5L', 'quantity' => 6],
                ],
            ],
            [
                'request_number' => 'PROC-2026-003',
                'title' => 'Pengadaan Perlengkapan Kebersihan, Sanitasi dan Pantry Kantor',
                'status' => 'submitted',
                'approved_at' => null,
                'items' => [
                    ['code' => 'CLN-TSU-PAS-250S', 'quantity' => 30],
                    ['code' => 'CLN-SOAP-LB-500ML', 'quantity' => 15],
                    ['code' => 'CLN-TRH-BAG-60100', 'quantity' => 20],
                    ['code' => 'CLN-CUP-PAPER-8OZ', 'quantity' => 15],
                ],
            ],
            [
                'request_number' => 'PROC-2026-004',
                'title' => 'Pengadaan Suku Cadang Jaringan dan Pemeliharaan Lab Komputer',
                'status' => 'draft',
                'approved_at' => null,
                'items' => [
                    ['code' => 'NET-CBL-CAT6-305M', 'quantity' => 2],
                    ['code' => 'NET-RJ45-CAT6-BOX', 'quantity' => 5],
                    ['code' => 'MNT-BAT-AA-4PK', 'quantity' => 20],
                    ['code' => 'MNT-TIE-NYL-20CM', 'quantity' => 10],
                ],
            ],
        ];

        foreach ($procurementSpecs as $spec) {
            $procurement = InventoryProcurement::firstOrCreate(
                ['request_number' => $spec['request_number']],
                [
                    'title' => $spec['title'],
                    'status' => $spec['status'],
                    'created_by' => $employees->random()->id,
                    'approved_at' => $spec['approved_at'],
                ]
            );

            foreach ($spec['items'] as $itemData) {
                $item = Item::where('code', $itemData['code'])->first();
                if ($item) {
                    InventoryProcurementItem::firstOrCreate(
                        [
                            'inventory_procurement_id' => $procurement->id,
                            'item_id' => $item->id,
                        ],
                        [
                            'item_name' => $item->name,
                            'quantity' => $itemData['quantity'],
                        ]
                    );
                }
            }
        }
    }

    /**
     * Seed realistic requests using existing real office items.
     *
     * @param  Collection<int, Employee>  $employees
     */
    protected function seedRequests($employees): void
    {
        $requestSpecs = [
            [
                'request_number' => 'REQ-2026-001',
                'request_date' => now()->subDays(10)->toDateString(),
                'status' => 'fulfilled',
                'approved_at' => now()->subDays(9),
                'items' => [
                    ['code' => 'ATK-HVS-A4-80', 'quantity' => 15, 'spec' => 'Kebutuhan cetak berkas naskah soal ujian akhir semester'],
                    ['code' => 'ATK-PEN-BLK-DZ', 'quantity' => 5, 'spec' => 'Perlengkapan alat tulis staf pengawas ujian'],
                    ['code' => 'ATK-BCLP-155-BOX', 'quantity' => 6, 'spec' => 'Penjepit bendel berkas lembar jawaban ujian'],
                ],
            ],
            [
                'request_number' => 'REQ-2026-002',
                'request_date' => now()->subDays(4)->toDateString(),
                'status' => 'approved',
                'approved_at' => now()->subDays(3),
                'items' => [
                    ['code' => 'IT-CBL-HDMI-3M', 'quantity' => 2, 'spec' => 'Pengganti kabel HDMI proyektor ruang seminar 1 yang rusak'],
                    ['code' => 'IT-PWR-STRIP-5L', 'quantity' => 2, 'spec' => 'Colokan tambahan meja penguji sidang skripsi'],
                    ['code' => 'MNT-BAT-AAA-4PK', 'quantity' => 4, 'spec' => 'Baterai pointer laser presenter ruang sidang'],
                ],
            ],
            [
                'request_number' => 'REQ-2026-003',
                'request_date' => now()->subDays(1)->toDateString(),
                'status' => 'pending',
                'approved_at' => null,
                'items' => [
                    ['code' => 'PRN-EPS-003-BK', 'quantity' => 4, 'spec' => 'Tinta hitam printer bagian kepegawaian habis'],
                    ['code' => 'ATK-HVS-F4-75', 'quantity' => 5, 'spec' => 'Pencetakan surat keputusan yudisium dan ijazah'],
                ],
            ],
            [
                'request_number' => 'REQ-2026-004',
                'request_date' => now()->toDateString(),
                'status' => 'pending',
                'approved_at' => null,
                'items' => [
                    ['code' => 'CLN-TSU-PAS-250S', 'quantity' => 4, 'spec' => 'Meja ruang dekan dan ruang rapat pimpinan'],
                    ['code' => 'CLN-SOAP-LB-500ML', 'quantity' => 2, 'spec' => 'Wastafel toilet pimpinan dan dosen'],
                    ['code' => 'CLN-CUP-PAPER-8OZ', 'quantity' => 2, 'spec' => 'Konsumsi rapat senat fakultas'],
                ],
            ],
        ];

        foreach ($requestSpecs as $spec) {
            $approver = in_array($spec['status'], ['approved', 'fulfilled']) ? $employees->random()->id : null;

            $request = InventoryRequest::firstOrCreate(
                ['request_number' => $spec['request_number']],
                [
                    'employee_id' => $employees->random()->id,
                    'request_date' => $spec['request_date'],
                    'status' => $spec['status'],
                    'approved_by' => $approver,
                    'approved_at' => $spec['approved_at'],
                ]
            );

            foreach ($spec['items'] as $itemData) {
                $item = Item::where('code', $itemData['code'])->first();
                if ($item) {
                    InventoryRequestItem::firstOrCreate(
                        [
                            'inventory_request_id' => $request->id,
                            'item_id' => $item->id,
                        ],
                        [
                            'item_name' => $item->name,
                            'specification' => $itemData['spec'],
                            'quantity' => $itemData['quantity'],
                        ]
                    );
                }
            }
        }
    }
}
