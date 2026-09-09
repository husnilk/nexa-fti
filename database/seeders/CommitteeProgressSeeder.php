<?php

namespace Database\Seeders;

use App\Models\CommitteeProgress;
use Illuminate\Database\Seeder;

class CommitteeProgressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CommitteeProgress::factory()->count(5)->create();
    }
}
