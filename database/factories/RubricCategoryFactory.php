<?php

namespace Database\Factories;

use App\Models\RubricCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RubricCategory>
 */
class RubricCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'code' => fake()->unique()->bothify('RC-###'),
            'description' => fake()->optional()->sentence(),
        ];
    }
}
