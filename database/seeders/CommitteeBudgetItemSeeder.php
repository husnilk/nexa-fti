<?php

namespace Database\Seeders;

use App\Models\CommitteeBudgetItem;
use Illuminate\Database\Seeder;

class CommitteeBudgetItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CommitteeBudgetItem::factory()->count(5)->create();
    }
}
