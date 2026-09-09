<?php

namespace Database\Seeders;

use App\Models\CommitteeTask;
use Illuminate\Database\Seeder;

class CommitteeTaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CommitteeTask::factory()->count(5)->create();
    }
}
