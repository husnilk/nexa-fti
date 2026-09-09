<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class LeaveTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'code' => fake()->word(),
            'description' => fake()->text(),
            'default_quota' => fake()->numberBetween(-10000, 10000),
            'requires_attachment' => fake()->boolean(),
        ];
    }
}
