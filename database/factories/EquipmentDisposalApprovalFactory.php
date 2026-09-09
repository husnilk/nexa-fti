<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\EquipmentDisposal;
use Illuminate\Database\Eloquent\Factories\Factory;

class EquipmentDisposalApprovalFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'equipment_disposal_id' => EquipmentDisposal::factory(),
            'approver_id' => Employee::factory(),
            'level' => fake()->numberBetween(-10000, 10000),
            'status' => fake()->randomElement(['pending', 'approved', 'rejected']),
            'notes' => fake()->text(),
            'approved_at' => fake()->dateTime(),
            'approver_id_id' => Employee::factory(),
        ];
    }
}
