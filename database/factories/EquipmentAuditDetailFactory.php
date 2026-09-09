<?php

namespace Database\Factories;

use App\Models\Equipment;
use App\Models\EquipmentAudit;
use Illuminate\Database\Eloquent\Factories\Factory;

class EquipmentAuditDetailFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'equipment_audit_id' => EquipmentAudit::factory(),
            'equipment_id' => Equipment::factory(),
            'condition' => fake()->randomElement(['excellent', 'good', 'fair', 'damaged', 'broken']),
            'found' => fake()->boolean(),
            'notes' => fake()->text(),
        ];
    }
}
