<?php

namespace Database\Seeders;

use App\Models\EventReminder;
use Illuminate\Database\Seeder;

class EventReminderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        EventReminder::factory()->count(5)->create();
    }
}
