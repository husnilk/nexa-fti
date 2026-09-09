<?php

namespace Database\Factories;

use App\Models\InventoryProcurement;
use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryProcurementItemFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'inventory_procurement_id' => InventoryProcurement::factory(),
            'item_id' => Item::factory(),
            'item_name' => function (array $attributes) {
                return Item::find($attributes['item_id'])->name;
            },
            'quantity' => $this->faker->numberBetween(1, 100),
        ];
    }
}
