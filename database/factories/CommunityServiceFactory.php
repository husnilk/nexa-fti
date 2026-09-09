<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CommunityServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'description' => fake()->text(),
            'location' => fake()->word(),
            'start_date' => fake()->date(),
            'end_date' => fake()->date(),
            'funding_source' => fake()->word(),
            'status' => fake()->randomElement(['proposed', 'ongoing', 'completed']),
        ];
    }
}
