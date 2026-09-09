<?php

namespace Database\Seeders;

use App\Models\FunctionalPosition;
use Illuminate\Database\Seeder;
use Str;

class FunctionalPositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $functionalPositions = [
            [
                'name' => 'Asisten Ahli',
                'code' => 'AA',
                'description' => 'Jabatan fungsional dosen tingkat awal.',
                'level' => 1,
            ],
            [
                'name' => 'Lektor',
                'code' => 'L',
                'description' => 'Jabatan fungsional dosen tingkat menengah.',
                'level' => 2,
            ],
            [
                'name' => 'Lektor Kepala',
                'code' => 'LK',
                'description' => 'Jabatan fungsional dosen tingkat lanjut.',
                'level' => 3,
            ],
            [
                'name' => 'Guru Besar',
                'code' => 'GB',
                'description' => 'Jabatan fungsional dosen tertinggi.',
                'level' => 4,
            ],
        ];

        foreach ($functionalPositions as $functionalPosition) {
            FunctionalPosition::query()->updateOrCreate(
                ['code' => $functionalPosition['code']],
                [
                    'id' => (string) Str::uuid(),
                    'name' => $functionalPosition['name'],
                    'description' => $functionalPosition['description'],
                    'level' => $functionalPosition['level'],
                ],
            );
        }
    }
}
