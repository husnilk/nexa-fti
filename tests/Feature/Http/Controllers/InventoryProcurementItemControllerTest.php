<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\InventoryProcurementItemController;
use App\Http\Requests\InventoryProcurementItemControllerStoreRequest;
use App\Http\Requests\InventoryProcurementItemControllerUpdateRequest;
use App\Models\InventoryProcurement;
use App\Models\InventoryProcurementItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see InventoryProcurementItemController
 */
final class InventoryProcurementItemControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $inventoryProcurementItems = InventoryProcurementItem::factory()->count(3)->create();

        $response = $this->get(route('inventory-procurement-items.index'));

        $response->assertOk();
        $response->assertViewIs('inventoryProcurementItem.index');
        $response->assertViewHas('inventoryProcurementItems', $inventoryProcurementItems);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('inventory-procurement-items.create'));

        $response->assertOk();
        $response->assertViewIs('inventoryProcurementItem.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryProcurementItemController::class,
            'store',
            InventoryProcurementItemControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $inventory_procurement = InventoryProcurement::factory()->create();
        $quantity = fake()->numberBetween(-10000, 10000);

        $response = $this->post(route('inventory-procurement-items.store'), [
            'inventory_procurement_id' => $inventory_procurement->id,
            'quantity' => $quantity,
        ]);

        $inventoryProcurementItems = InventoryProcurementItem::query()
            ->where('inventory_procurement_id', $inventory_procurement->id)
            ->where('quantity', $quantity)
            ->get();
        $this->assertCount(1, $inventoryProcurementItems);
        $inventoryProcurementItem = $inventoryProcurementItems->first();

        $response->assertRedirect(route('inventoryProcurementItems.index'));
        $response->assertSessionHas('inventoryProcurementItem.id', $inventoryProcurementItem->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $inventoryProcurementItem = InventoryProcurementItem::factory()->create();

        $response = $this->get(route('inventory-procurement-items.show', $inventoryProcurementItem));

        $response->assertOk();
        $response->assertViewIs('inventoryProcurementItem.show');
        $response->assertViewHas('inventoryProcurementItem', $inventoryProcurementItem);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $inventoryProcurementItem = InventoryProcurementItem::factory()->create();

        $response = $this->get(route('inventory-procurement-items.edit', $inventoryProcurementItem));

        $response->assertOk();
        $response->assertViewIs('inventoryProcurementItem.edit');
        $response->assertViewHas('inventoryProcurementItem', $inventoryProcurementItem);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryProcurementItemController::class,
            'update',
            InventoryProcurementItemControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $inventoryProcurementItem = InventoryProcurementItem::factory()->create();
        $inventory_procurement = InventoryProcurement::factory()->create();
        $quantity = fake()->numberBetween(-10000, 10000);

        $response = $this->put(route('inventory-procurement-items.update', $inventoryProcurementItem), [
            'inventory_procurement_id' => $inventory_procurement->id,
            'quantity' => $quantity,
        ]);

        $inventoryProcurementItem->refresh();

        $response->assertRedirect(route('inventoryProcurementItems.index'));
        $response->assertSessionHas('inventoryProcurementItem.id', $inventoryProcurementItem->id);

        $this->assertEquals($inventory_procurement->id, $inventoryProcurementItem->inventory_procurement_id);
        $this->assertEquals($quantity, $inventoryProcurementItem->quantity);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $inventoryProcurementItem = InventoryProcurementItem::factory()->create();

        $response = $this->delete(route('inventory-procurement-items.destroy', $inventoryProcurementItem));

        $response->assertRedirect(route('inventoryProcurementItems.index'));

        $this->assertModelMissing($inventoryProcurementItem);
    }
}
