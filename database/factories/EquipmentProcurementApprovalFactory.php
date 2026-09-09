<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\EquipmentProcurement;
use Illuminate\Database\Eloquent\Factories\Factory;

class EquipmentProcurementApprovalFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'equipment_procurement_id' => EquipmentProcurement::factory(),
            'approver_id' => Employee::factory(),
            'level' => fake()->numberBetween(-10000, 10000),
            'status' => fake()->randomElement(['pending', 'approved', 'rejected']),
            'notes' => fake()->text(),
            'approved_at' => fake()->dateTime(),
            'approver_id_id' => Employee::factory(),
        ];
    }
}
