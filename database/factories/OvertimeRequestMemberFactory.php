<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\OvertimeRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

class OvertimeRequestMemberFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'overtime_request_id' => OvertimeRequest::factory(),
            'employee_id' => Employee::factory(),
            'role' => fake()->jobTitle(),
            'job_desc' => fake()->sentence(),
            'planned_hours' => fake()->randomFloat(2, 1, 8),
            'actual_start_time' => null,
            'actual_end_time' => null,
            'actual_hours' => null,
            'activity' => null,
            'outcome' => null,
        ];
    }
}
