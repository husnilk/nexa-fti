<?php

namespace Database\Factories;

use App\Models\EquipmentMaintenanceRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

class EquipmentMaintenanceActivityFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'equipment_maintenance_request_id' => EquipmentMaintenanceRequest::factory(),
            'activity_date' => fake()->dateTime(),
            'description' => fake()->text(),
            'cost' => fake()->randomFloat(2, 0, 999999999999.99),
            'performed_by' => fake()->word(),
            'status' => fake()->randomElement(['in_progress', 'resolved']),
            'notes' => fake()->text(),
            'photo' => fake()->word(),
        ];
    }
}
