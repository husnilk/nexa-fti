<?php

namespace Database\Factories;

use App\Models\EquipmentCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class EquipmentModelFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'equipment_category_id' => EquipmentCategory::factory(),
            'manufacturer' => fake()->word(),
            'brand' => fake()->word(),
            'model_name' => fake()->word(),
            'specification' => fake()->text(),
            'image' => fake()->word(),
            'default_useful_life' => fake()->numberBetween(-10000, 10000),
        ];
    }
}
