<?php

namespace Database\Factories;

use App\Models\Equipment;
use Illuminate\Database\Eloquent\Factories\Factory;

class EquipmentDepreciationFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'equipment_id' => Equipment::factory(),
            'depreciation_date' => fake()->date(),
            'acquisition_cost' => fake()->randomFloat(2, 0, 999999999999.99),
            'depreciation_amount' => fake()->randomFloat(2, 0, 999999999999.99),
            'book_value' => fake()->randomFloat(2, 0, 999999999999.99),
        ];
    }
}
