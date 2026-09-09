<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Equipment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EquipmentUsageFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'equipment_id' => Equipment::factory(),
            'borrower_type' => fake()->randomElement(['employee', 'student']),
            'borrower_id' => User::factory(),
            'planned_start_date' => fake()->dateTime(),
            'planned_return_date' => fake()->dateTime(),
            'actual_start_date' => fake()->dateTime(),
            'actual_return_date' => fake()->dateTime(),
            'purpose' => fake()->text(),
            'status' => fake()->randomElement(['requested', 'approved', 'rejected', 'borrowed', 'returned']),
            'approved_by' => Employee::factory(),
        ];
    }
}
