<?php

namespace Database\Seeders;

use App\Models\Position;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rector = Position::query()->updateOrCreate(
            ['name' => 'Rektor'],
            [
                'id' => (string) Str::uuid(),
                'parent_id' => null,
                'grade' => 17,
                'job_value' => 3200,
                'is_active' => true,
                'qualification' => 'Memiliki pengalaman kepemimpinan strategis di perguruan tinggi.',
                'description' => 'Pimpinan tertinggi universitas.',
            ],
        );

        $viceRectorAcademic = Position::query()->updateOrCreate(
            ['name' => 'Wakil Rektor Bidang Akademik'],
            [
                'id' => (string) Str::uuid(),
                'parent_id' => $rector->id,
                'grade' => 16,
                'job_value' => 2900,
                'is_active' => true,
                'qualification' => 'Memiliki pengalaman pengelolaan bidang akademik.',
                'description' => 'Membantu rektor dalam pengelolaan bidang akademik.',
            ],
        );

        $dean = Position::query()->updateOrCreate(
            ['name' => 'Dekan'],
            [
                'id' => (string) Str::uuid(),
                'parent_id' => $viceRectorAcademic->id,
                'grade' => 15,
                'job_value' => 2600,
                'is_active' => true,
                'qualification' => 'Memiliki pengalaman manajerial pada tingkat fakultas.',
                'description' => 'Pimpinan tertinggi fakultas.',
            ],
        );

        Position::query()->updateOrCreate(
            ['name' => 'Ketua Program Studi'],
            [
                'id' => (string) Str::uuid(),
                'parent_id' => $dean->id,
                'grade' => 13,
                'job_value' => 2100,
                'is_active' => true,
                'qualification' => 'Memiliki pengalaman pengelolaan program studi.',
                'description' => 'Mengelola penyelenggaraan program studi.',
            ],
        );
    }
}
