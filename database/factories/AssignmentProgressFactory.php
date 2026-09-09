<?php

namespace Database\Factories;

use App\Models\Assignment;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssignmentProgressFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'assignment_id' => Assignment::factory(),
            'description' => fake()->text(),
            'progress_date' => fake()->date(),
            'status' => fake()->randomElement(['in_progress', 'completed']),
            'attachment' => fake()->word(),
            'created_by' => Employee::factory(),
            'employee_id' => Employee::factory(),
        ];
    }
}
