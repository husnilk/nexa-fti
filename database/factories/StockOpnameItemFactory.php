<?php

namespace Database\Factories;

use App\Models\Item;
use App\Models\StockOpname;
use Illuminate\Database\Eloquent\Factories\Factory;

class StockOpnameItemFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'stock_opname_id' => StockOpname::factory(),
            'item_id' => Item::factory(),
            'system_quantity' => fake()->numberBetween(-10000, 10000),
            'physical_quantity' => fake()->numberBetween(-10000, 10000),
            'variance' => fake()->numberBetween(-10000, 10000),
            'notes' => fake()->text(),
        ];
    }
}
