<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EquipmentReceiptItemController;
use App\Http\Requests\EquipmentReceiptItemControllerStoreRequest;
use App\Http\Requests\EquipmentReceiptItemControllerUpdateRequest;
use App\Models\EquipmentProcurementItem;
use App\Models\EquipmentReceipt;
use App\Models\EquipmentReceiptItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EquipmentReceiptItemController
 */
final class EquipmentReceiptItemControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $equipmentReceiptItems = EquipmentReceiptItem::factory()->count(3)->create();

        $response = $this->get(route('equipment-receipt-items.index'));

        $response->assertOk();
        $response->assertViewIs('equipmentReceiptItem.index');
        $response->assertViewHas('equipmentReceiptItems', $equipmentReceiptItems);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('equipment-receipt-items.create'));

        $response->assertOk();
        $response->assertViewIs('equipmentReceiptItem.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentReceiptItemController::class,
            'store',
            EquipmentReceiptItemControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $equipment_receipt = EquipmentReceipt::factory()->create();
        $equipment_procurement_item = EquipmentProcurementItem::factory()->create();
        $quantity = fake()->numberBetween(-10000, 10000);

        $response = $this->post(route('equipment-receipt-items.store'), [
            'equipment_receipt_id' => $equipment_receipt->id,
            'equipment_procurement_item_id' => $equipment_procurement_item->id,
            'quantity' => $quantity,
        ]);

        $equipmentReceiptItems = EquipmentReceiptItem::query()
            ->where('equipment_receipt_id', $equipment_receipt->id)
            ->where('equipment_procurement_item_id', $equipment_procurement_item->id)
            ->where('quantity', $quantity)
            ->get();
        $this->assertCount(1, $equipmentReceiptItems);
        $equipmentReceiptItem = $equipmentReceiptItems->first();

        $response->assertRedirect(route('equipmentReceiptItems.index'));
        $response->assertSessionHas('equipmentReceiptItem.id', $equipmentReceiptItem->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $equipmentReceiptItem = EquipmentReceiptItem::factory()->create();

        $response = $this->get(route('equipment-receipt-items.show', $equipmentReceiptItem));

        $response->assertOk();
        $response->assertViewIs('equipmentReceiptItem.show');
        $response->assertViewHas('equipmentReceiptItem', $equipmentReceiptItem);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $equipmentReceiptItem = EquipmentReceiptItem::factory()->create();

        $response = $this->get(route('equipment-receipt-items.edit', $equipmentReceiptItem));

        $response->assertOk();
        $response->assertViewIs('equipmentReceiptItem.edit');
        $response->assertViewHas('equipmentReceiptItem', $equipmentReceiptItem);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentReceiptItemController::class,
            'update',
            EquipmentReceiptItemControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $equipmentReceiptItem = EquipmentReceiptItem::factory()->create();
        $equipment_receipt = EquipmentReceipt::factory()->create();
        $equipment_procurement_item = EquipmentProcurementItem::factory()->create();
        $quantity = fake()->numberBetween(-10000, 10000);

        $response = $this->put(route('equipment-receipt-items.update', $equipmentReceiptItem), [
            'equipment_receipt_id' => $equipment_receipt->id,
            'equipment_procurement_item_id' => $equipment_procurement_item->id,
            'quantity' => $quantity,
        ]);

        $equipmentReceiptItem->refresh();

        $response->assertRedirect(route('equipmentReceiptItems.index'));
        $response->assertSessionHas('equipmentReceiptItem.id', $equipmentReceiptItem->id);

        $this->assertEquals($equipment_receipt->id, $equipmentReceiptItem->equipment_receipt_id);
        $this->assertEquals($equipment_procurement_item->id, $equipmentReceiptItem->equipment_procurement_item_id);
        $this->assertEquals($quantity, $equipmentReceiptItem->quantity);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $equipmentReceiptItem = EquipmentReceiptItem::factory()->create();

        $response = $this->delete(route('equipment-receipt-items.destroy', $equipmentReceiptItem));

        $response->assertRedirect(route('equipmentReceiptItems.index'));

        $this->assertModelMissing($equipmentReceiptItem);
    }
}
