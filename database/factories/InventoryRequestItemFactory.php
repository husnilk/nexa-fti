<?php

namespace Database\Factories;

use App\Models\InventoryRequest;
use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryRequestItemFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'inventory_request_id' => InventoryRequest::factory(),
            'item_id' => Item::factory(),
            'item_name' => function (array $attributes) {
                return Item::find($attributes['item_id'])->name;
            },
            'specification' => $this->faker->sentence(),
            'quantity' => $this->faker->numberBetween(1, 20),
        ];
    }
}
