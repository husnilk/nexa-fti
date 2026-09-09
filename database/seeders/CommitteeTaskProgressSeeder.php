<?php

namespace Database\Seeders;

use App\Models\CommitteeTaskProgress;
use Illuminate\Database\Seeder;

class CommitteeTaskProgressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CommitteeTaskProgress::factory()->count(5)->create();
    }
}
