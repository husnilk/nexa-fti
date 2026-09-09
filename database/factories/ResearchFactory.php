<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ResearchFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'description' => fake()->text(),
            'start_date' => fake()->date(),
            'end_date' => fake()->date(),
            'funding_source' => fake()->word(),
            'budget' => fake()->randomFloat(2, 0, 9999999999.99),
            'status' => fake()->randomElement(['proposed', 'ongoing', 'completed']),
        ];
    }
}
