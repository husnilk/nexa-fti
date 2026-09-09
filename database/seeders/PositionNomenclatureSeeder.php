<?php

namespace Database\Seeders;

use App\Models\PositionNomenclature;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PositionNomenclatureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nomenclatures = [
            [
                'name' => 'Pengelola Administrasi Akademik',
                'grade' => '7',
                'qualification' => 'Minimal D3/S1 administrasi, manajemen, atau bidang terkait.',
            ],
            [
                'name' => 'Analis Kepegawaian',
                'grade' => '9',
                'qualification' => 'Minimal S1 manajemen sumber daya manusia, administrasi publik, atau bidang terkait.',
            ],
            [
                'name' => 'Pranata Teknologi Informasi',
                'grade' => '9',
                'qualification' => 'Minimal S1 teknologi informasi, sistem informasi, ilmu komputer, atau bidang terkait.',
            ],
            [
                'name' => 'Pengelola Keuangan',
                'grade' => '8',
                'qualification' => 'Minimal D3/S1 akuntansi, keuangan, atau bidang terkait.',
            ],
        ];

        foreach ($nomenclatures as $nomenclature) {
            PositionNomenclature::query()->updateOrCreate(
                ['name' => $nomenclature['name']],
                [
                    'id' => (string) Str::uuid(),
                    'grade' => $nomenclature['grade'],
                    'qualification' => $nomenclature['qualification'],
                ],
            );
        }
    }
}
