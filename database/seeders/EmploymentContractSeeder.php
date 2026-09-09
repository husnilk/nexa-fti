<?php

namespace Database\Seeders;

use App\Models\EmploymentContract;
use Illuminate\Database\Seeder;

class EmploymentContractSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        EmploymentContract::factory()->count(5)->create();
    }
}
