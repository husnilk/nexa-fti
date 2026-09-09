<?php

namespace Database\Factories;

use App\Models\InventoryProcurementItem;
use App\Models\InventoryReceipt;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryReceiptItemFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'inventory_receipt_id' => InventoryReceipt::factory(),
            'inventory_procurement_item_id' => InventoryProcurementItem::factory(),
            'quantity' => fake()->numberBetween(-10000, 10000),
            'unit_price' => fake()->randomFloat(2, 0, 999999999999.99),
        ];
    }
}
