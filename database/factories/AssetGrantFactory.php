<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class AssetGrantFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'source' => fake()->word(),
            'grant_date' => fake()->date(),
            'description' => fake()->text(),
        ];
    }
}
