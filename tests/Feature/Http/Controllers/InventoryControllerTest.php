<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\InventoryController;
use App\Http\Requests\InventoryControllerStoreRequest;
use App\Http\Requests\InventoryControllerUpdateRequest;
use App\Models\Inventory;
use App\Models\Item;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see InventoryController
 */
final class InventoryControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $inventories = Inventory::factory()->count(3)->create();

        $response = $this->get(route('inventories.index'));

        $response->assertOk();
        $response->assertViewIs('inventory.index');
        $response->assertViewHas('inventories', $inventories);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('inventories.create'));

        $response->assertOk();
        $response->assertViewIs('inventory.manage');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryController::class,
            'store',
            InventoryControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $warehouse = Warehouse::factory()->create();
        $item = Item::factory()->create();
        $quantity = fake()->numberBetween(-10000, 10000);

        $response = $this->post(route('inventories.store'), [
            'warehouse_id' => $warehouse->id,
            'item_id' => $item->id,
            'quantity' => $quantity,
        ]);

        $inventories = Inventory::query()
            ->where('warehouse_id', $warehouse->id)
            ->where('item_id', $item->id)
            ->where('quantity', $quantity)
            ->get();
        $this->assertCount(1, $inventories);
        $inventory = $inventories->first();

        $response->assertRedirect(route('inventories.index'));
        $response->assertSessionHas('inventory.id', $inventory->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $inventory = Inventory::factory()->create();

        $response = $this->get(route('inventories.show', $inventory));

        $response->assertOk();
        $response->assertViewIs('inventory.show');
        $response->assertViewHas('inventory', $inventory);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $inventory = Inventory::factory()->create();

        $response = $this->get(route('inventories.edit', $inventory));

        $response->assertOk();
        $response->assertViewIs('inventory.edit');
        $response->assertViewHas('inventory', $inventory);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryController::class,
            'update',
            InventoryControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $inventory = Inventory::factory()->create();
        $warehouse = Warehouse::factory()->create();
        $item = Item::factory()->create();
        $quantity = fake()->numberBetween(-10000, 10000);

        $response = $this->put(route('inventories.update', $inventory), [
            'warehouse_id' => $warehouse->id,
            'item_id' => $item->id,
            'quantity' => $quantity,
        ]);

        $inventory->refresh();

        $response->assertRedirect(route('inventories.index'));
        $response->assertSessionHas('inventory.id', $inventory->id);

        $this->assertEquals($warehouse->id, $inventory->warehouse_id);
        $this->assertEquals($item->id, $inventory->item_id);
        $this->assertEquals($quantity, $inventory->quantity);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $inventory = Inventory::factory()->create();

        $response = $this->delete(route('inventories.destroy', $inventory));

        $response->assertRedirect(route('inventories.index'));

        $this->assertModelMissing($inventory);
    }
}
