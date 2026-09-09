<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\LeaveRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeaveApprovalFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'leave_request_id' => LeaveRequest::factory(),
            'approver_id' => Employee::factory(),
            'level' => fake()->numberBetween(-10000, 10000),
            'status' => fake()->randomElement(['pending', 'approved', 'rejected']),
            'notes' => fake()->text(),
            'action_date' => fake()->dateTime(),
            'employee_id' => Employee::factory(),
        ];
    }
}
