<?php

namespace Database\Factories;

use App\Models\EmploymentContract;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmploymentContract>
 */
class EmploymentContractFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => fake()->unique()->numberBetween(1, 100000),
            'name' => fake()->word().' Contract',
            'description' => fake()->sentence(),
        ];
    }
}
