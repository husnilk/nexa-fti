<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EquipmentAuditDetailController;
use App\Http\Requests\EquipmentAuditDetailControllerStoreRequest;
use App\Http\Requests\EquipmentAuditDetailControllerUpdateRequest;
use App\Models\Equipment;
use App\Models\EquipmentAudit;
use App\Models\EquipmentAuditDetail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EquipmentAuditDetailController
 */
final class EquipmentAuditDetailControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $equipmentAuditDetails = EquipmentAuditDetail::factory()->count(3)->create();

        $response = $this->get(route('equipment-audit-details.index'));

        $response->assertOk();
        $response->assertViewIs('equipmentAuditDetail.index');
        $response->assertViewHas('equipmentAuditDetails', $equipmentAuditDetails);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('equipment-audit-details.create'));

        $response->assertOk();
        $response->assertViewIs('equipmentAuditDetail.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentAuditDetailController::class,
            'store',
            EquipmentAuditDetailControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $equipment_audit = EquipmentAudit::factory()->create();
        $equipment = Equipment::factory()->create();
        $condition = fake()->randomElement(/** enum_attributes **/);
        $found = fake()->boolean();

        $response = $this->post(route('equipment-audit-details.store'), [
            'equipment_audit_id' => $equipment_audit->id,
            'equipment_id' => $equipment->id,
            'condition' => $condition,
            'found' => $found,
        ]);

        $equipmentAuditDetails = EquipmentAuditDetail::query()
            ->where('equipment_audit_id', $equipment_audit->id)
            ->where('equipment_id', $equipment->id)
            ->where('condition', $condition)
            ->where('found', $found)
            ->get();
        $this->assertCount(1, $equipmentAuditDetails);
        $equipmentAuditDetail = $equipmentAuditDetails->first();

        $response->assertRedirect(route('equipmentAuditDetails.index'));
        $response->assertSessionHas('equipmentAuditDetail.id', $equipmentAuditDetail->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $equipmentAuditDetail = EquipmentAuditDetail::factory()->create();

        $response = $this->get(route('equipment-audit-details.show', $equipmentAuditDetail));

        $response->assertOk();
        $response->assertViewIs('equipmentAuditDetail.show');
        $response->assertViewHas('equipmentAuditDetail', $equipmentAuditDetail);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $equipmentAuditDetail = EquipmentAuditDetail::factory()->create();

        $response = $this->get(route('equipment-audit-details.edit', $equipmentAuditDetail));

        $response->assertOk();
        $response->assertViewIs('equipmentAuditDetail.edit');
        $response->assertViewHas('equipmentAuditDetail', $equipmentAuditDetail);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentAuditDetailController::class,
            'update',
            EquipmentAuditDetailControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $equipmentAuditDetail = EquipmentAuditDetail::factory()->create();
        $equipment_audit = EquipmentAudit::factory()->create();
        $equipment = Equipment::factory()->create();
        $condition = fake()->randomElement(/** enum_attributes **/);
        $found = fake()->boolean();

        $response = $this->put(route('equipment-audit-details.update', $equipmentAuditDetail), [
            'equipment_audit_id' => $equipment_audit->id,
            'equipment_id' => $equipment->id,
            'condition' => $condition,
            'found' => $found,
        ]);

        $equipmentAuditDetail->refresh();

        $response->assertRedirect(route('equipmentAuditDetails.index'));
        $response->assertSessionHas('equipmentAuditDetail.id', $equipmentAuditDetail->id);

        $this->assertEquals($equipment_audit->id, $equipmentAuditDetail->equipment_audit_id);
        $this->assertEquals($equipment->id, $equipmentAuditDetail->equipment_id);
        $this->assertEquals($condition, $equipmentAuditDetail->condition);
        $this->assertEquals($found, $equipmentAuditDetail->found);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $equipmentAuditDetail = EquipmentAuditDetail::factory()->create();

        $response = $this->delete(route('equipment-audit-details.destroy', $equipmentAuditDetail));

        $response->assertRedirect(route('equipmentAuditDetails.index'));

        $this->assertModelMissing($equipmentAuditDetail);
    }
}
