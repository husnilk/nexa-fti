<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class EquipmentProcurementFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'procurement_number' => fake()->word(),
            'title' => fake()->sentence(4),
            'description' => fake()->text(),
            'requested_by' => Employee::factory(),
            'request_date' => fake()->date(),
            'status' => fake()->randomElement(['draft', 'pending', 'approved', 'rejected', 'completed', 'cancelled']),
            'approved_by' => Employee::factory(),
            'approved_at' => fake()->dateTime(),
            'requested_by_id' => Employee::factory(),
            'approved_by_id' => Employee::factory(),
        ];
    }
}
