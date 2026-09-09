<?php

namespace Database\Factories;

use App\Models\Equipment;
use App\Models\EquipmentDisposal;
use Illuminate\Database\Eloquent\Factories\Factory;

class EquipmentDisposalItemFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'equipment_disposal_id' => EquipmentDisposal::factory(),
            'equipment_id' => Equipment::factory(),
            'book_value' => fake()->randomFloat(2, 0, 999999999999.99),
            'disposal_value' => fake()->randomFloat(2, 0, 999999999999.99),
            'notes' => fake()->text(),
        ];
    }
}
