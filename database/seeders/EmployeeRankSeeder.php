<?php

namespace Database\Seeders;

use App\Models\EmployeeRank;
use Illuminate\Database\Seeder;

class EmployeeRankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ranks = [
            ['code' => 'III/a', 'name' => 'Penata Muda', 'order' => 1, 'description' => 'Golongan III/a'],
            ['code' => 'III/b', 'name' => 'Penata Muda Tingkat I', 'order' => 2, 'description' => 'Golongan III/b'],
            ['code' => 'III/c', 'name' => 'Penata', 'order' => 3, 'description' => 'Golongan III/c'],
            ['code' => 'III/d', 'name' => 'Penata Tingkat I', 'order' => 4, 'description' => 'Golongan III/d'],
            ['code' => 'IV/a', 'name' => 'Pembina', 'order' => 5, 'description' => 'Golongan IV/a'],
            ['code' => 'IV/b', 'name' => 'Pembina Tingkat I', 'order' => 6, 'description' => 'Golongan IV/b'],
            ['code' => 'IV/c', 'name' => 'Pembina Utama Muda', 'order' => 7, 'description' => 'Golongan IV/c'],
            ['code' => 'IV/d', 'name' => 'Pembina Utama Madya', 'order' => 8, 'description' => 'Golongan IV/d'],
            ['code' => 'IV/e', 'name' => 'Pembina Utama', 'order' => 9, 'description' => 'Golongan IV/e'],
        ];

        foreach ($ranks as $rank) {
            EmployeeRank::query()->updateOrCreate(
                ['code' => $rank['code']],
                [
                    'name' => $rank['name'],
                    'order' => $rank['order'],
                    'description' => $rank['description'],
                ]
            );
        }
    }
}
