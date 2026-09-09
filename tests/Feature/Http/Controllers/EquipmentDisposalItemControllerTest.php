<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EquipmentDisposalItemController;
use App\Http\Requests\EquipmentDisposalItemControllerStoreRequest;
use App\Http\Requests\EquipmentDisposalItemControllerUpdateRequest;
use App\Models\Equipment;
use App\Models\EquipmentDisposal;
use App\Models\EquipmentDisposalItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EquipmentDisposalItemController
 */
final class EquipmentDisposalItemControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $equipmentDisposalItems = EquipmentDisposalItem::factory()->count(3)->create();

        $response = $this->get(route('equipment-disposal-items.index'));

        $response->assertOk();
        $response->assertViewIs('equipmentDisposalItem.index');
        $response->assertViewHas('equipmentDisposalItems', $equipmentDisposalItems);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('equipment-disposal-items.create'));

        $response->assertOk();
        $response->assertViewIs('equipmentDisposalItem.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentDisposalItemController::class,
            'store',
            EquipmentDisposalItemControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $equipment_disposal = EquipmentDisposal::factory()->create();
        $equipment = Equipment::factory()->create();

        $response = $this->post(route('equipment-disposal-items.store'), [
            'equipment_disposal_id' => $equipment_disposal->id,
            'equipment_id' => $equipment->id,
        ]);

        $equipmentDisposalItems = EquipmentDisposalItem::query()
            ->where('equipment_disposal_id', $equipment_disposal->id)
            ->where('equipment_id', $equipment->id)
            ->get();
        $this->assertCount(1, $equipmentDisposalItems);
        $equipmentDisposalItem = $equipmentDisposalItems->first();

        $response->assertRedirect(route('equipmentDisposalItems.index'));
        $response->assertSessionHas('equipmentDisposalItem.id', $equipmentDisposalItem->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $equipmentDisposalItem = EquipmentDisposalItem::factory()->create();

        $response = $this->get(route('equipment-disposal-items.show', $equipmentDisposalItem));

        $response->assertOk();
        $response->assertViewIs('equipmentDisposalItem.show');
        $response->assertViewHas('equipmentDisposalItem', $equipmentDisposalItem);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $equipmentDisposalItem = EquipmentDisposalItem::factory()->create();

        $response = $this->get(route('equipment-disposal-items.edit', $equipmentDisposalItem));

        $response->assertOk();
        $response->assertViewIs('equipmentDisposalItem.edit');
        $response->assertViewHas('equipmentDisposalItem', $equipmentDisposalItem);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentDisposalItemController::class,
            'update',
            EquipmentDisposalItemControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $equipmentDisposalItem = EquipmentDisposalItem::factory()->create();
        $equipment_disposal = EquipmentDisposal::factory()->create();
        $equipment = Equipment::factory()->create();

        $response = $this->put(route('equipment-disposal-items.update', $equipmentDisposalItem), [
            'equipment_disposal_id' => $equipment_disposal->id,
            'equipment_id' => $equipment->id,
        ]);

        $equipmentDisposalItem->refresh();

        $response->assertRedirect(route('equipmentDisposalItems.index'));
        $response->assertSessionHas('equipmentDisposalItem.id', $equipmentDisposalItem->id);

        $this->assertEquals($equipment_disposal->id, $equipmentDisposalItem->equipment_disposal_id);
        $this->assertEquals($equipment->id, $equipmentDisposalItem->equipment_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $equipmentDisposalItem = EquipmentDisposalItem::factory()->create();

        $response = $this->delete(route('equipment-disposal-items.destroy', $equipmentDisposalItem));

        $response->assertRedirect(route('equipmentDisposalItems.index'));

        $this->assertModelMissing($equipmentDisposalItem);
    }
}
