<?php

namespace Database\Factories;

use App\Models\Research;
use Illuminate\Database\Eloquent\Factories\Factory;

class PublicationFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'publication_date' => fake()->date(),
            'doi' => fake()->word(),
            'url' => fake()->url(),
            'abstract' => fake()->text(),
            'research_id' => Research::factory(),
        ];
    }
}
