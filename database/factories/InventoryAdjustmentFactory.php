<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Item;
use App\Models\StockOpnameItem;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryAdjustmentFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'stock_opname_item_id' => StockOpnameItem::factory(),
            'warehouse_id' => Warehouse::factory(),
            'item_id' => Item::factory(),
            'adjustment_quantity' => fake()->numberBetween(-10000, 10000),
            'reason' => fake()->text(),
            'adjusted_by' => Employee::factory(),
            'adjustment_date' => fake()->dateTime(),
            'adjusted_by_id' => Employee::factory(),
        ];
    }
}
