<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\InventoryRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryRequestApprovalFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'inventory_request_id' => InventoryRequest::factory(),
            'approver_id' => Employee::factory(),
            'status' => fake()->randomElement(['approved', 'rejected']),
            'notes' => fake()->text(),
            'action_date' => fake()->dateTime(),
            'approver_id_id' => Employee::factory(),
        ];
    }
}
