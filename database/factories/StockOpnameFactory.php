<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

class StockOpnameFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'warehouse_id' => Warehouse::factory(),
            'opname_number' => fake()->word(),
            'opname_date' => fake()->date(),
            'conducted_by' => Employee::factory(),
            'notes' => fake()->text(),
            'status' => fake()->randomElement(['draft', 'completed']),
            'conducted_by_id' => Employee::factory(),
        ];
    }
}
