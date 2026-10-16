<?php

namespace Database\Factories;

use App\Models\RubricRegulation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RubricRegulation>
 */
class RubricRegulationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->sentence(4),
            'regulation_number' => (string) fake()->numberBetween(1, 99),
            'regulation_year' => (string) fake()->numberBetween(2018, 2026),
            'description' => fake()->optional()->sentence(),
            'file_path' => null,
            'is_active' => RubricRegulation::STATUS_ACTIVE,
        ];
    }
}
