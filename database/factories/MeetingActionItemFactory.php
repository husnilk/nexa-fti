<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Meeting;
use Illuminate\Database\Eloquent\Factories\Factory;

class MeetingActionItemFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'meeting_id' => Meeting::factory(),
            'title' => fake()->sentence(4),
            'description' => fake()->text(),
            'assigned_to' => fake()->uuid(),
            'due_date' => fake()->date(),
            'status' => fake()->randomElement(['open', 'in_progress', 'completed', 'cancelled']),
            'assigned_to_id' => Employee::factory(),
        ];
    }
}
