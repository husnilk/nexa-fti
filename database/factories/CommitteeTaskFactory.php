<?php

namespace Database\Factories;

use App\Models\Committee;
use App\Models\CommitteeMember;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommitteeTaskFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'committee_id' => Committee::factory(),
            'parent_id' => null,
            'title' => fake()->sentence(4),
            'description' => fake()->text(),
            'assigned_to' => fake()->uuid(),
            'start_date' => fake()->date(),
            'due_date' => fake()->date(),
            'priority' => fake()->randomElement(['low', 'medium', 'high']),
            'status' => fake()->randomElement(['open', 'in_progress', 'completed', 'cancelled']),
            'completion_percentage' => fake()->randomFloat(2, 0, 99.99),
            'parent_id_id' => 0,
            'assigned_to_id' => CommitteeMember::factory(),
        ];
    }
}
