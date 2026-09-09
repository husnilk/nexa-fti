<?php

namespace Database\Factories;

use App\Models\OrganizationType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrganizationType>
 */
class OrganizationTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->lexify('Type-????').' '.fake()->companySuffix(),
            'level' => fake()->numberBetween(1, 10),
        ];
    }
}
