<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\InventoryRequest;
use App\Models\IssuedBy;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryIssueFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'inventory_request_id' => InventoryRequest::factory(),
            'warehouse_id' => Warehouse::factory(),
            'issue_number' => fake()->word(),
            'issue_date' => fake()->date(),
            'issued_by' => IssuedBy::factory(),
            'issued_by_id' => Employee::factory(),
        ];
    }
}
