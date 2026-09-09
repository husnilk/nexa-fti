<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\OrganizationType;
use Illuminate\Database\Seeder;

class OrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = OrganizationType::query()->pluck('id', 'name');

        $rektorat = Organization::factory()->create([
            'name' => 'Rektorat',
            'code' => 'REKTORAT',
            'organization_type_id' => $types['Rektorat'],
            'is_active' => true,
            'description' => 'Unit pusat administrasi universitas.',
        ]);

        Organization::factory()->create([
            'parent_id' => $rektorat->id,
            'name' => 'Direktorat Akademik',
            'code' => 'DIR-AKADEMIK',
            'organization_type_id' => $types['Direktorat'],
            'is_active' => true,
            'description' => 'Direktorat yang menangani layanan akademik.',
        ]);

        Organization::factory()->create([
            'parent_id' => $rektorat->id,
            'name' => 'UPT Teknologi Informasi',
            'code' => 'UPT-TI',
            'organization_type_id' => $types['UPT'],
            'is_active' => true,
            'description' => 'Unit pelaksana teknis teknologi informasi.',
        ]);

        Organization::factory()->create([
            'parent_id' => $rektorat->id,
            'name' => 'Fakultas Teknik',
            'code' => 'FT',
            'organization_type_id' => $types['Fakultas'],
            'is_active' => true,
            'description' => 'Fakultas Teknik.',
        ]);

    }
}
