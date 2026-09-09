<?php

namespace Database\Seeders;

use App\Models\EventDocument;
use Illuminate\Database\Seeder;

class EventDocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        EventDocument::factory()->count(5)->create();
    }
}
