<?php

namespace Database\Seeders;

use App\Models\CommitteeDocument;
use Illuminate\Database\Seeder;

class CommitteeDocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CommitteeDocument::factory()->count(5)->create();
    }
}
