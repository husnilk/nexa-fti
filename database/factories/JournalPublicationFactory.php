<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class JournalPublicationFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'journal_name' => fake()->word(),
            'issn' => fake()->word(),
            'publisher' => fake()->word(),
            'volume' => fake()->word(),
            'issue' => fake()->word(),
            'pages' => fake()->word(),
            'indexing' => fake()->word(),
            'quartile' => fake()->word(),
        ];
    }
}
