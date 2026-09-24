<?php

namespace Database\Factories;

use App\Models\Item;
use App\Models\ItemVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ItemVariant>
 */
class ItemVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'item_id' => Item::factory(),
            'name' => fake()->randomElement(['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Silver', 'Gold']),
        ];
    }
}
