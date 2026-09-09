<?php

namespace Database\Seeders;

use App\Models\CommitteeBudget;
use Illuminate\Database\Seeder;

class CommitteeBudgetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CommitteeBudget::factory()->count(5)->create();
    }
}
