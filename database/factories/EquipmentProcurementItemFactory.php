<?php

namespace Database\Factories;

use App\Models\EquipmentModel;
use App\Models\EquipmentProcurement;
use Illuminate\Database\Eloquent\Factories\Factory;

class EquipmentProcurementItemFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'equipment_procurement_id' => EquipmentProcurement::factory(),
            'equipment_model_id' => EquipmentModel::factory(),
            'name' => fake()->name(),
            'specification' => fake()->text(),
            'quantity' => fake()->numberBetween(-10000, 10000),
            'estimated_unit_price' => fake()->randomFloat(2, 0, 999999999999.99),
            'purchase_link' => fake()->word(),
            'photo' => fake()->word(),
        ];
    }
}
