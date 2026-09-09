<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\InventoryReceiptItemController;
use App\Http\Requests\InventoryReceiptItemControllerStoreRequest;
use App\Http\Requests\InventoryReceiptItemControllerUpdateRequest;
use App\Models\InventoryProcurementItem;
use App\Models\InventoryReceipt;
use App\Models\InventoryReceiptItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see InventoryReceiptItemController
 */
final class InventoryReceiptItemControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $inventoryReceiptItems = InventoryReceiptItem::factory()->count(3)->create();

        $response = $this->get(route('inventory-receipt-items.index'));

        $response->assertOk();
        $response->assertViewIs('inventoryReceiptItem.index');
        $response->assertViewHas('inventoryReceiptItems', $inventoryReceiptItems);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('inventory-receipt-items.create'));

        $response->assertOk();
        $response->assertViewIs('inventoryReceiptItem.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryReceiptItemController::class,
            'store',
            InventoryReceiptItemControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $inventory_receipt = InventoryReceipt::factory()->create();
        $inventory_procurement_item = InventoryProcurementItem::factory()->create();
        $quantity = fake()->numberBetween(-10000, 10000);

        $response = $this->post(route('inventory-receipt-items.store'), [
            'inventory_receipt_id' => $inventory_receipt->id,
            'inventory_procurement_item_id' => $inventory_procurement_item->id,
            'quantity' => $quantity,
        ]);

        $inventoryReceiptItems = InventoryReceiptItem::query()
            ->where('inventory_receipt_id', $inventory_receipt->id)
            ->where('inventory_procurement_item_id', $inventory_procurement_item->id)
            ->where('quantity', $quantity)
            ->get();
        $this->assertCount(1, $inventoryReceiptItems);
        $inventoryReceiptItem = $inventoryReceiptItems->first();

        $response->assertRedirect(route('inventoryReceiptItems.index'));
        $response->assertSessionHas('inventoryReceiptItem.id', $inventoryReceiptItem->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $inventoryReceiptItem = InventoryReceiptItem::factory()->create();

        $response = $this->get(route('inventory-receipt-items.show', $inventoryReceiptItem));

        $response->assertOk();
        $response->assertViewIs('inventoryReceiptItem.show');
        $response->assertViewHas('inventoryReceiptItem', $inventoryReceiptItem);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $inventoryReceiptItem = InventoryReceiptItem::factory()->create();

        $response = $this->get(route('inventory-receipt-items.edit', $inventoryReceiptItem));

        $response->assertOk();
        $response->assertViewIs('inventoryReceiptItem.edit');
        $response->assertViewHas('inventoryReceiptItem', $inventoryReceiptItem);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryReceiptItemController::class,
            'update',
            InventoryReceiptItemControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $inventoryReceiptItem = InventoryReceiptItem::factory()->create();
        $inventory_receipt = InventoryReceipt::factory()->create();
        $inventory_procurement_item = InventoryProcurementItem::factory()->create();
        $quantity = fake()->numberBetween(-10000, 10000);

        $response = $this->put(route('inventory-receipt-items.update', $inventoryReceiptItem), [
            'inventory_receipt_id' => $inventory_receipt->id,
            'inventory_procurement_item_id' => $inventory_procurement_item->id,
            'quantity' => $quantity,
        ]);

        $inventoryReceiptItem->refresh();

        $response->assertRedirect(route('inventoryReceiptItems.index'));
        $response->assertSessionHas('inventoryReceiptItem.id', $inventoryReceiptItem->id);

        $this->assertEquals($inventory_receipt->id, $inventoryReceiptItem->inventory_receipt_id);
        $this->assertEquals($inventory_procurement_item->id, $inventoryReceiptItem->inventory_procurement_item_id);
        $this->assertEquals($quantity, $inventoryReceiptItem->quantity);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $inventoryReceiptItem = InventoryReceiptItem::factory()->create();

        $response = $this->delete(route('inventory-receipt-items.destroy', $inventoryReceiptItem));

        $response->assertRedirect(route('inventoryReceiptItems.index'));

        $this->assertModelMissing($inventoryReceiptItem);
    }
}
