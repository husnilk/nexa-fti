<?php

namespace Database\Factories;

use App\Models\Committee;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommitteeBudgetFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'committee_id' => Committee::factory(),
            'budget_number' => fake()->unique()->numerify('BUD-#####'),
            'title' => fake()->sentence(4),
            'prepared_by' => Employee::factory(),
            'prepared_at' => fake()->date(),
            'status' => fake()->randomElement(['draft', 'submitted', 'approved', 'rejected']),
            'approved_by' => Employee::factory(),
            'approved_at' => fake()->dateTime(),
            'prepared_by_id' => Employee::factory(),
            'approved_by_id' => Employee::factory(),
        ];
    }
}
