<?php

namespace Database\Seeders;

use App\Models\MeetingMinute;
use Illuminate\Database\Seeder;

class MeetingMinuteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MeetingMinute::factory()->count(5)->create();
    }
}
