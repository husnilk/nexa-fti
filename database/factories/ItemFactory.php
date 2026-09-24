<?php

namespace Database\Factories;

use App\Models\ItemCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class ItemFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'item_category_id' => ItemCategory::factory(),
            'name' => $this->faker->words(3, true),
            'code' => 'ITM-'.$this->faker->unique()->bothify('####-??'),
            'unit' => $this->faker->randomElement(['pcs', 'box', 'set', 'unit', 'pack']),
            'minimal_quantity' => $this->faker->numberBetween(5, 50),
            'description' => $this->faker->paragraph(),
            'picture' => null,
        ];
    }
}
