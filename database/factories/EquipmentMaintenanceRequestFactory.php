<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Equipment;
use Illuminate\Database\Eloquent\Factories\Factory;

class EquipmentMaintenanceRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'equipment_id' => Equipment::factory(),
            'reported_by' => Employee::factory(),
            'report_date' => fake()->date(),
            'problem_description' => fake()->text(),
            'priority' => fake()->randomElement(['low', 'medium', 'high']),
            'status' => fake()->randomElement(['open', 'in_progress', 'resolved', 'rejected']),
            'notes' => fake()->text(),
            'photo' => fake()->word(),
            'estimated_cost' => fake()->randomFloat(2, 0, 999999999999.99),
            'actual_cost' => fake()->randomFloat(2, 0, 999999999999.99),
            'reported_by_id' => Employee::factory(),
        ];
    }
}
