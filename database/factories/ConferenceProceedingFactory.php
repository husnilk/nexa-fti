<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ConferenceProceedingFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'conference_name' => fake()->word(),
            'conference_location' => fake()->word(),
            'conference_date' => fake()->date(),
            'publisher' => fake()->word(),
            'isbn' => fake()->word(),
            'pages' => fake()->word(),
            'indexing' => fake()->word(),
        ];
    }
}
