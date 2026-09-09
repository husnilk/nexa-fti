<?php

namespace Database\Factories;

use App\Models\EquipmentModel;
use Illuminate\Database\Eloquent\Factories\Factory;

class EquipmentFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'equipment_model_id' => EquipmentModel::factory(),
            'equipment_number' => fake()->word(),
            'serial_number' => fake()->word(),
            'acquisition_date' => fake()->date(),
            'acquisition_cost' => fake()->randomFloat(2, 0, 999999999999.99),
            'residual_value' => fake()->randomFloat(2, 0, 999999999999.99),
            'useful_life' => fake()->numberBetween(-10000, 10000),
            'condition' => fake()->randomElement(['excellent', 'good', 'fair', 'damaged', 'broken']),
            'status' => fake()->randomElement(['available', 'in_use', 'maintenance', 'disposed']),
            'qr_code' => fake()->word(),
            'notes' => fake()->text(),
        ];
    }
}
