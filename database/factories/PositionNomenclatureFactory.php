<?php

namespace Database\Factories;

use App\Models\PositionNomenclature;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PositionNomenclature>
 */
class PositionNomenclatureFactory extends Factory
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
            'grade' => (string) fake()->numberBetween(1, 17),
            'qualification' => fake()->paragraph(),
        ];
    }
}
