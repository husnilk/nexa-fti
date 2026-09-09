<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EquipmentProcurementItemController;
use App\Http\Requests\EquipmentProcurementItemControllerStoreRequest;
use App\Http\Requests\EquipmentProcurementItemControllerUpdateRequest;
use App\Models\EquipmentProcurement;
use App\Models\EquipmentProcurementItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EquipmentProcurementItemController
 */
final class EquipmentProcurementItemControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $equipmentProcurementItems = EquipmentProcurementItem::factory()->count(3)->create();

        $response = $this->get(route('equipment-procurement-items.index'));

        $response->assertOk();
        $response->assertViewIs('equipmentProcurementItem.index');
        $response->assertViewHas('equipmentProcurementItems', $equipmentProcurementItems);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('equipment-procurement-items.create'));

        $response->assertOk();
        $response->assertViewIs('equipmentProcurementItem.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentProcurementItemController::class,
            'store',
            EquipmentProcurementItemControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $equipment_procurement = EquipmentProcurement::factory()->create();
        $name = fake()->name();
        $quantity = fake()->numberBetween(-10000, 10000);

        $response = $this->post(route('equipment-procurement-items.store'), [
            'equipment_procurement_id' => $equipment_procurement->id,
            'name' => $name,
            'quantity' => $quantity,
        ]);

        $equipmentProcurementItems = EquipmentProcurementItem::query()
            ->where('equipment_procurement_id', $equipment_procurement->id)
            ->where('name', $name)
            ->where('quantity', $quantity)
            ->get();
        $this->assertCount(1, $equipmentProcurementItems);
        $equipmentProcurementItem = $equipmentProcurementItems->first();

        $response->assertRedirect(route('equipmentProcurementItems.index'));
        $response->assertSessionHas('equipmentProcurementItem.id', $equipmentProcurementItem->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $equipmentProcurementItem = EquipmentProcurementItem::factory()->create();

        $response = $this->get(route('equipment-procurement-items.show', $equipmentProcurementItem));

        $response->assertOk();
        $response->assertViewIs('equipmentProcurementItem.show');
        $response->assertViewHas('equipmentProcurementItem', $equipmentProcurementItem);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $equipmentProcurementItem = EquipmentProcurementItem::factory()->create();

        $response = $this->get(route('equipment-procurement-items.edit', $equipmentProcurementItem));

        $response->assertOk();
        $response->assertViewIs('equipmentProcurementItem.edit');
        $response->assertViewHas('equipmentProcurementItem', $equipmentProcurementItem);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentProcurementItemController::class,
            'update',
            EquipmentProcurementItemControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $equipmentProcurementItem = EquipmentProcurementItem::factory()->create();
        $equipment_procurement = EquipmentProcurement::factory()->create();
        $name = fake()->name();
        $quantity = fake()->numberBetween(-10000, 10000);

        $response = $this->put(route('equipment-procurement-items.update', $equipmentProcurementItem), [
            'equipment_procurement_id' => $equipment_procurement->id,
            'name' => $name,
            'quantity' => $quantity,
        ]);

        $equipmentProcurementItem->refresh();

        $response->assertRedirect(route('equipmentProcurementItems.index'));
        $response->assertSessionHas('equipmentProcurementItem.id', $equipmentProcurementItem->id);

        $this->assertEquals($equipment_procurement->id, $equipmentProcurementItem->equipment_procurement_id);
        $this->assertEquals($name, $equipmentProcurementItem->name);
        $this->assertEquals($quantity, $equipmentProcurementItem->quantity);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $equipmentProcurementItem = EquipmentProcurementItem::factory()->create();

        $response = $this->delete(route('equipment-procurement-items.destroy', $equipmentProcurementItem));

        $response->assertRedirect(route('equipmentProcurementItems.index'));

        $this->assertModelMissing($equipmentProcurementItem);
    }
}
