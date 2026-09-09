<?php

namespace Database\Factories;

use App\Models\Committee;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommitteeExpenseFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'committee_id' => Committee::factory(),
            'expense_number' => fake()->unique()->numerify('EXP-#####'),
            'expense_date' => fake()->date(),
            'submitted_by' => Employee::factory(),
            'description' => fake()->text(),
            'status' => fake()->randomElement(['draft', 'submitted', 'approved', 'rejected']),
            'approved_by' => Employee::factory(),
            'approved_at' => fake()->dateTime(),
            'submitted_by_id' => Employee::factory(),
            'approved_by_id' => Employee::factory(),
        ];
    }
}
