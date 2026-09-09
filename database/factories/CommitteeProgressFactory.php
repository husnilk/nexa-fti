<?php

namespace Database\Factories;

use App\Models\Committee;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommitteeProgressFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'committee_id' => Committee::factory(),
            'progress_date' => fake()->date(),
            'progress_percentage' => fake()->randomFloat(2, 0, 999.99),
            'summary' => fake()->text(),
            'issues' => fake()->text(),
            'risks' => fake()->text(),
            'next_plan' => fake()->text(),
            'reported_by' => fake()->uuid(),
            'reported_by_id' => Employee::factory(),
        ];
    }
}
