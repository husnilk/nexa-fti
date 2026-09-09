<?php

namespace Database\Seeders;

use App\Models\PositionNomenclature;
use App\Models\PositionNomenclatureResponsibility;
use Illuminate\Database\Seeder;

class PositionNomenclatureResponsibilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $responsibilities = [
            'Pengelola Administrasi Akademik' => [
                'Mengelola administrasi pendaftaran mahasiswa baru',
                'Menyusun jadwal perkuliahan dan ujian',
            ],
            'Analis Kepegawaian' => [
                'Melakukan analisis kebutuhan diklat pegawai',
                'Mengelola administrasi kenaikan pangkat dan golongan',
            ],
            'Pranata Teknologi Informasi' => [
                'Mengelola infrastruktur jaringan universitas',
                'Melakukan pemeliharaan sistem informasi akademik',
            ],
            'Pengelola Keuangan' => [
                'Menyusun laporan realisasi anggaran bulanan',
                'Melakukan verifikasi berkas pertanggungjawaban keuangan',
            ],
        ];

        foreach ($responsibilities as $nomenclatureName => $items) {
            $nomenclature = PositionNomenclature::query()->where('name', $nomenclatureName)->first();

            if (! $nomenclature) {
                continue;
            }

            foreach ($items as $name) {
                PositionNomenclatureResponsibility::query()->updateOrCreate(
                    [
                        'position_nomenclature_id' => $nomenclature->id,
                        'name' => $name,
                    ]
                );
            }
        }
    }
}
