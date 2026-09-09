<?php

namespace Database\Factories;

use App\Models\Position;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Position>
 */
class PositionFactory extends Factory
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
            'parent_id' => null,
            'grade' => fake()->numberBetween(1, 15),
            'job_value' => fake()->numberBetween(100, 1000),
            'cg' => fake()->numberBetween(1, 20),
            'skp_point' => fake()->numberBetween(10, 200),
            'is_active' => true,
            'qualification' => fake()->sentence(),
            'description' => fake()->paragraph(),
        ];
    }
}
