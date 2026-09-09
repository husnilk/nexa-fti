<?php

namespace Database\Factories;

use App\Models\Assignment;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Assignment>
 */
class AssignmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'description' => fake()->text(),
            'assigned_by' => Employee::factory(),
            'assigned_to' => Employee::factory(),
            'parent_id' => null,
            'start_date' => fake()->date(),
            'due_date' => fake()->dateTimeBetween('now', '+1 year')->format('Y-m-d'),
            'status' => fake()->randomElement(['assigned', 'in_progress', 'completed', 'delegated', 'cancelled']),
            'priority' => fake()->randomElement(['low', 'medium', 'high']),
        ];
    }
}
