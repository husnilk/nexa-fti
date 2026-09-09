<?php

namespace Database\Factories;

use App\Models\EquipmentProcurementItem;
use App\Models\EquipmentReceipt;
use Illuminate\Database\Eloquent\Factories\Factory;

class EquipmentReceiptItemFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'equipment_receipt_id' => EquipmentReceipt::factory(),
            'equipment_procurement_item_id' => EquipmentProcurementItem::factory(),
            'unit_price' => fake()->randomFloat(2, 0, 999999999999.99),
            'quantity' => fake()->numberBetween(-10000, 10000),
        ];
    }
}
