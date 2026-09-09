<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Inventory;
use App\Models\InventoryProcurement;
use App\Models\InventoryProcurementItem;
use App\Models\InventoryRequest;
use App\Models\InventoryRequestItem;
use App\Models\Item;
use App\Models\ItemCategory;
use App\Models\Organization;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Organization if not exists
        $org = Organization::first() ?? Organization::factory()->create(['name' => 'Faculty of Information Technology']);

        // 2. Create Warehouses
        $warehouses = [
            Warehouse::factory()->create(['name' => 'Main IT Storage', 'organization_id' => $org->id, 'code' => 'WH-MAIN']),
            Warehouse::factory()->create(['name' => 'Administrative Depot', 'organization_id' => $org->id, 'code' => 'WH-ADMIN']),
            Warehouse::factory()->create(['name' => 'Lab Equipment Room', 'organization_id' => $org->id, 'code' => 'WH-LAB']),
        ];

        // 3. Create Categories and Items
        $categories = ItemCategory::factory(5)->create();

        $categories->each(function ($category) use ($warehouses) {
            $items = Item::factory(5)->create(['item_category_id' => $category->id]);

            // 4. Populate initial stock for some items
            $items->each(function ($item) use ($warehouses) {
                Inventory::factory()->create([
                    'item_id' => $item->id,
                    'warehouse_id' => fake()->randomElement($warehouses)->id,
                    'quantity' => fake()->numberBetween(10, 100),
                ]);
            });
        });

        // 5. Create some Procurements (Inbound workflow demo)
        $employees = Employee::factory(5)->create();

        InventoryProcurement::factory(3)
            ->has(InventoryProcurementItem::factory()->count(3), 'inventoryProcurementItems')
            ->create(['created_by_id' => $employees->random()->id]);

        InventoryProcurement::factory(2)
            ->approved()
            ->has(InventoryProcurementItem::factory()->count(2), 'inventoryProcurementItems')
            ->create(['created_by_id' => $employees->random()->id]);

        // 6. Create some Requests (Outbound workflow demo)
        InventoryRequest::factory(3)
            ->has(InventoryRequestItem::factory()->count(2), 'inventoryRequestItems')
            ->create(['employee_id' => $employees->random()->id]);

        InventoryRequest::factory(2)
            ->approved()
            ->has(InventoryRequestItem::factory()->count(3), 'inventoryRequestItems')
            ->create(['employee_id' => $employees->random()->id]);
    }
}
