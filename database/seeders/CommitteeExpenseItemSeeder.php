<?php

namespace Database\Seeders;

use App\Models\CommitteeExpenseItem;
use Illuminate\Database\Seeder;

class CommitteeExpenseItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CommitteeExpenseItem::factory()->count(5)->create();
    }
}
