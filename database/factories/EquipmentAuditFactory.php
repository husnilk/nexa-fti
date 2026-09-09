<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class EquipmentAuditFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'audit_number' => fake()->word(),
            'audit_date' => fake()->date(),
            'conducted_by' => Employee::factory(),
            'notes' => fake()->text(),
            'conducted_by_id' => Employee::factory(),
        ];
    }
}
