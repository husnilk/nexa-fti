<?php

namespace Database\Seeders;

use App\Models\MeetingActionItem;
use Illuminate\Database\Seeder;

class MeetingActionItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MeetingActionItem::factory()->count(5)->create();
    }
}
