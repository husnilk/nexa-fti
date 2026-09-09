<?php

namespace Database\Seeders;

use App\Models\PositionNomenclature;
use App\Models\PositionNomenclatureClassification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PositionNomenclatureClassificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classifications = [
            'Pengelola Administrasi Akademik' => [
                [
                    'name' => 'Administrasi Perkuliahan',
                    'description' => 'Mengelola administrasi jadwal, presensi, nilai, dan dokumen perkuliahan.',
                ],
                [
                    'name' => 'Administrasi Kemahasiswaan',
                    'description' => 'Mengelola layanan administrasi dan dokumen mahasiswa.',
                ],
            ],
            'Analis Kepegawaian' => [
                [
                    'name' => 'Data Kepegawaian',
                    'description' => 'Mengelola data, dokumen, dan arsip kepegawaian.',
                ],
                [
                    'name' => 'Pengembangan Pegawai',
                    'description' => 'Menganalisis kebutuhan pengembangan kompetensi pegawai.',
                ],
            ],
            'Pranata Teknologi Informasi' => [
                [
                    'name' => 'Pengelolaan Sistem Informasi',
                    'description' => 'Mengelola sistem informasi dan aplikasi pendukung layanan institusi.',
                ],
                [
                    'name' => 'Infrastruktur Teknologi Informasi',
                    'description' => 'Mengelola jaringan, server, perangkat, dan dukungan teknis.',
                ],
            ],
            'Pengelola Keuangan' => [
                [
                    'name' => 'Administrasi Anggaran',
                    'description' => 'Mengelola dokumen anggaran dan realisasi keuangan.',
                ],
                [
                    'name' => 'Pelaporan Keuangan',
                    'description' => 'Menyusun laporan keuangan dan dokumen pertanggungjawaban.',
                ],
            ],
        ];

        foreach ($classifications as $nomenclatureName => $items) {
            $positionNomenclature = PositionNomenclature::query()
                ->where('name', $nomenclatureName)
                ->first();

            if (! $positionNomenclature) {
                continue;
            }

            foreach ($items as $item) {
                PositionNomenclatureClassification::query()->updateOrCreate(
                    [
                        'position_nomenclature_id' => $positionNomenclature->id,
                        'name' => $item['name'],
                    ],
                    [
                        'id' => (string) Str::uuid(),
                        'description' => $item['description'],
                    ],
                );
            }
        }
    }
}
