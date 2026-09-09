<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Equipment;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

class EquipmentDistributionFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'equipment_id' => Equipment::factory(),
            'employee_id' => Employee::factory(),
            'room_id' => Room::factory(),
            'assigned_date' => fake()->date(),
            'returned_date' => fake()->date(),
            'status' => fake()->randomElement(['active', 'inactive', 'lost', 'damaged', 'under_repair']),
            'notes' => fake()->text(),
            'photo' => fake()->word(),
        ];
    }
}
