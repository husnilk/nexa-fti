<?php

namespace Database\Seeders;

use App\Models\AssignmentProgress;
use Illuminate\Database\Seeder;

class AssignmentProgressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AssignmentProgress::factory()->count(5)->create();
    }
}
