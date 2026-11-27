<?php

namespace Database\Factories;

use App\Models\Rubric;
use App\Models\RubricCategory;
use App\Models\RubricRegulation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Rubric>
 */
class RubricFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'rubric_category_id' => RubricCategory::factory(),
            'rubric_regulation_id' => RubricRegulation::factory(),
            'activity' => fake()->sentence(4),
            'code' => fake()->unique()->bothify('R-####'),
            'description' => fake()->optional()->sentence(),
            'quantity' => fake()->numberBetween(1, 10),
            'unit' => fake()->randomElement(['kegiatan', 'dokumen', 'jam', 'SKS']),
        ];
    }
}
