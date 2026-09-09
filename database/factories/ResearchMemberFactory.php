<?php

namespace Database\Factories;

use App\Models\Research;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResearchMemberFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'research_id' => Research::factory(),
            'user_id' => User::factory(),
            'role' => fake()->word(),
        ];
    }
}
