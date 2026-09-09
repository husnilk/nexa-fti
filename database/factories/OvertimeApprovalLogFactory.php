<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\OvertimeRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

class OvertimeApprovalLogFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'overtime_request_id' => OvertimeRequest::factory(),
            'approver_id' => Employee::factory(),
            'status' => 'approved',
            'notes' => fake()->sentence(),
            'action_date' => now(),
        ];
    }
}
