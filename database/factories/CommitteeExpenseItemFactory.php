<?php

namespace Database\Factories;

use App\Models\CommitteeBudgetItem;
use App\Models\CommitteeExpense;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommitteeExpenseItemFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'committee_expense_id' => CommitteeExpense::factory(),
            'committee_budget_item_id' => CommitteeBudgetItem::factory(),
            'description' => fake()->text(),
            'quantity' => fake()->randomFloat(2, 0, 9999999999.99),
            'unit_price' => fake()->randomFloat(2, 0, 999999999999.99),
            'total_amount' => fake()->randomFloat(2, 0, 999999999999.99),
            'receipt_number' => fake()->word(),
            'receipt_file' => fake()->word(),
        ];
    }
}
