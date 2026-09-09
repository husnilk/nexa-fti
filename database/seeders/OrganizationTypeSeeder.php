<?php

namespace Database\Seeders;

use App\Models\OrganizationType;
use Illuminate\Database\Seeder;

class OrganizationTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $organizationTypes = [
            ['name' => 'Rektorat', 'level' => 1],
            ['name' => 'Direktorat', 'level' => 2],
            ['name' => 'Lembaga', 'level' => 2],
            ['name' => 'UPT', 'level' => 2],
            ['name' => 'Fakultas', 'level' => 2],
            ['name' => 'Departemen', 'level' => 3],
            ['name' => 'Bagian', 'level' => 3],
            ['name' => 'Prodi', 'level' => 4],
            ['name' => 'Lainnya', 'level' => 99],
        ];

        foreach ($organizationTypes as $organizationType) {
            OrganizationType::query()->updateOrCreate(
                ['name' => $organizationType['name']],
                ['level' => $organizationType['level']],
            );
        }
    }
}
