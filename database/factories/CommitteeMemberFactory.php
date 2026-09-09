<?php

namespace Database\Factories;

use App\Models\Committee;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommitteeMemberFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'committee_id' => Committee::factory(),
            'supervisor_id' => null,
            'user_id' => Employee::factory(),
            'external_name' => fake()->word(),
            'role' => fake()->word(),
            'is_leader' => fake()->boolean(),
            'supervisor_id_id' => 0,
        ];
    }
}
