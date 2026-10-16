<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Ept;
use App\Models\Period;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ept>
 */
class EptFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $year = fake()->numberBetween(2025, 2027);

        return [
            'employee_id' => Employee::factory(),
            'period_id' => Period::factory(),
            'year' => $year,
            'start' => 1,
            'end' => 12,
            'start_date' => "{$year}-01-01",
            'end_date' => "{$year}-12-31",
            'orientation' => fake()->numberBetween(70, 95),
            'integrity' => fake()->numberBetween(70, 95),
            'commitment' => fake()->numberBetween(70, 95),
            'discipline' => fake()->numberBetween(70, 95),
            'teamwork' => fake()->numberBetween(70, 95),
            'leadership' => fake()->numberBetween(70, 95),
            'skp_achievement' => fake()->randomFloat(2, 70, 100),
            'work_result_rating' => fake()->numberBetween(1, 3),
            'behavior_rating' => fake()->numberBetween(1, 3),
            'performance_predicate' => fake()->numberBetween(2, 5),
            'points' => fake()->numberBetween(0, 100),
            'status' => Ept::STATUS_DRAFT,
        ];
    }
}
