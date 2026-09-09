<?php

namespace Database\Seeders;

use App\Models\EquipmentCategory;
use Illuminate\Database\Seeder;

class EquipmentCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['code' => 'COMP', 'name' => 'Computing', 'description' => 'Laptops, Desktops, Servers, etc.'],
            ['code' => 'NET', 'name' => 'Networking', 'description' => 'Routers, Switches, Access Points, etc.'],
            ['code' => 'AV', 'name' => 'Audio Visual', 'description' => 'Projectors, Displays, Speakers, etc.'],
            ['code' => 'OFF', 'name' => 'Office Equipment', 'description' => 'Printers, Scanners, Photocopiers, etc.'],
            ['code' => 'LAB', 'name' => 'Laboratory', 'description' => 'Scientific and research equipment.'],
        ];

        foreach ($categories as $category) {
            EquipmentCategory::updateOrCreate(['code' => $category['code']], $category);
        }
    }
}
