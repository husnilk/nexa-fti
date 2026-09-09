<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\EquipmentProcurement;
use Illuminate\Database\Eloquent\Factories\Factory;

class EquipmentReceiptFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'equipment_procurement_id' => EquipmentProcurement::factory(),
            'receipt_number' => fake()->word(),
            'receipt_date' => fake()->date(),
            'received_by' => Employee::factory(),
            'supplier_name' => fake()->word(),
            'invoice_number' => fake()->word(),
            'received_by_id' => Employee::factory(),
        ];
    }
}
