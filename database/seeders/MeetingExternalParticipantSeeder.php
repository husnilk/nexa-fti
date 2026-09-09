<?php

namespace Database\Seeders;

use App\Models\MeetingExternalParticipant;
use Illuminate\Database\Seeder;

class MeetingExternalParticipantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MeetingExternalParticipant::factory()->count(5)->create();
    }
}
