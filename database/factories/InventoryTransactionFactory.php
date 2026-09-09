<?php

namespace Database\Factories;

use App\Models\Item;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'warehouse_id' => Warehouse::factory(),
            'item_id' => Item::factory(),
            'type' => fake()->randomElement(['in', 'out', 'adjustment']),
            'quantity' => fake()->numberBetween(-10000, 10000),
            'balance_after' => fake()->numberBetween(-10000, 10000),
            'transaction_date' => fake()->date(),
            'reference' => fake()->word(),
            'notes' => fake()->text(),
        ];
    }
}
