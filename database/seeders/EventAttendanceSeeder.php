<?php

namespace Database\Seeders;

use App\Models\EventAttendance;
use Illuminate\Database\Seeder;

class EventAttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        EventAttendance::factory()->count(5)->create();
    }
}
