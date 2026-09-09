<?php

namespace Database\Seeders;

use App\Models\MeetingRefreshmentItem;
use Illuminate\Database\Seeder;

class MeetingRefreshmentItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MeetingRefreshmentItem::factory()->count(5)->create();
    }
}
