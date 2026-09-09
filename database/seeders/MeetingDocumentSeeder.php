<?php

namespace Database\Seeders;

use App\Models\MeetingDocument;
use Illuminate\Database\Seeder;

class MeetingDocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MeetingDocument::factory()->count(5)->create();
    }
}
