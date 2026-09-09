<?php

namespace Database\Factories;

use App\Models\FunctionalPosition;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FunctionalPosition>
 */
class FunctionalPositionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->jobTitle(),
            'code' => strtoupper(fake()->unique()->bothify('FP-###')),
            'description' => fake()->sentence(),
            'level' => fake()->numberBetween(1, 5),
            'grade' => fake()->numberBetween(1, 15),
            'job_value' => fake()->numberBetween(100, 1000),
            'is_active' => fake()->boolean(80),
        ];
    }
}
