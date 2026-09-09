<?php

namespace Database\Seeders;

use App\Models\CommitteeExpense;
use Illuminate\Database\Seeder;

class CommitteeExpenseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CommitteeExpense::factory()->count(5)->create();
    }
}
