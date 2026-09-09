<?php

namespace Database\Seeders;

use App\Models\MeetingRefreshmentRequest;
use Illuminate\Database\Seeder;

class MeetingRefreshmentRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MeetingRefreshmentRequest::factory()->count(5)->create();
    }
}
