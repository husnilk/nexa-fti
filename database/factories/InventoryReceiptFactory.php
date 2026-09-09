<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\InventoryProcurement;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryReceiptFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'inventory_procurement_id' => InventoryProcurement::factory(),
            'warehouse_id' => Warehouse::factory(),
            'receipt_number' => fake()->word(),
            'receipt_date' => fake()->date(),
            'received_by' => Employee::factory(),
            'received_by_id' => Employee::factory(),
        ];
    }
}
