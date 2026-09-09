<?php

namespace Database\Factories;

use App\Models\InventoryIssue;
use App\Models\InventoryRequestItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryIssueItemFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'inventory_issue_id' => InventoryIssue::factory(),
            'inventory_issue_item_id' => InventoryRequestItem::factory(),
            'quantity' => fake()->numberBetween(-10000, 10000),
            'inventory_request_item_id' => InventoryRequestItem::factory(),
        ];
    }
}
