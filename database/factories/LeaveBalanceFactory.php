<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\LeaveType;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeaveBalanceFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'leave_type_id' => LeaveType::factory(),
            'year' => fake()->year(),
            'quota' => fake()->numberBetween(-10000, 10000),
            'used' => fake()->numberBetween(-10000, 10000),
            'remaining' => fake()->numberBetween(-10000, 10000),
        ];
    }
}
