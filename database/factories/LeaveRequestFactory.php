<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\LeaveType;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeaveRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'leave_type_id' => LeaveType::factory(),
            'start_date' => fake()->date(),
            'end_date' => fake()->date(),
            'total_days' => fake()->numberBetween(-10000, 10000),
            'reason' => fake()->text(),
            'attachment' => fake()->word(),
            'address_leave' => fake()->word(),
            'contact_leave' => fake()->word(),
            'status' => fake()->randomElement(['pending', 'approved', 'rejected', 'cancelled']),
            'submitted_at' => fake()->dateTime(),
            'approved_at' => fake()->dateTime(),
        ];
    }
}
