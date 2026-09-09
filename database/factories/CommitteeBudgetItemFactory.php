<?php

namespace Database\Factories;

use App\Models\CommitteeBudget;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommitteeBudgetItemFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'committee_budget_id' => CommitteeBudget::factory(),
            'category' => fake()->word(),
            'description' => fake()->text(),
            'quantity' => fake()->randomFloat(2, 0, 9999999999.99),
            'unit_price' => fake()->randomFloat(2, 0, 999999999999.99),
            'total_amount' => fake()->randomFloat(2, 0, 999999999999.99),
            'notes' => fake()->text(),
        ];
    }
}
