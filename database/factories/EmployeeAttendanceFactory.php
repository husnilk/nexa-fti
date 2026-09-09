<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmployeeAttendanceFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'date' => fake()->date(),
            'check_in' => fake()->dateTime(),
            'check_out' => fake()->dateTime(),
            'break_in' => fake()->dateTime(),
            'break_out' => fake()->dateTime(),
            'status' => fake()->randomElement(['present', 'absent', 'leave', 'overtime', 'holiday']),
            'notes' => fake()->word(),
        ];
    }
}
