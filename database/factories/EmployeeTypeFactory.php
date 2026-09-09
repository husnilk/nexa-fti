<?php

namespace Database\Factories;

use App\Models\EmployeeType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmployeeType>
 */
class EmployeeTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->jobTitle(),
            'description' => fake()->sentence(),
        ];
    }
}
