<?php

namespace Database\Seeders;

use App\Models\EventRegistration;
use Illuminate\Database\Seeder;

class EventRegistrationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        EventRegistration::factory()->count(5)->create();
    }
}
