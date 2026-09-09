<?php

namespace Database\Seeders;

use App\Models\MeetingParticipant;
use Illuminate\Database\Seeder;

class MeetingParticipantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MeetingParticipant::factory()->count(5)->create();
    }
}
