<?php

namespace Database\Factories;

use App\Models\Position;
use App\Models\PositionResponsibility;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PositionResponsibility>
 */
class PositionResponsibilityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'position_id' => Position::factory(),
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'type' => fake()->randomElement(['primary', 'secondary']),
            'order' => fake()->numberBetween(1, 10),
        ];
    }
}
