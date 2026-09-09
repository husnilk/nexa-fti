<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EquipmentProcurementApprovalController;
use App\Http\Requests\EquipmentProcurementApprovalControllerStoreRequest;
use App\Http\Requests\EquipmentProcurementApprovalControllerUpdateRequest;
use App\Models\Approver;
use App\Models\Employee;
use App\Models\EquipmentProcurement;
use App\Models\EquipmentProcurementApproval;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EquipmentProcurementApprovalController
 */
final class EquipmentProcurementApprovalControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $equipmentProcurementApprovals = EquipmentProcurementApproval::factory()->count(3)->create();

        $response = $this->get(route('equipment-procurement-approvals.index'));

        $response->assertOk();
        $response->assertViewIs('equipmentProcurementApproval.index');
        $response->assertViewHas('equipmentProcurementApprovals', $equipmentProcurementApprovals);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('equipment-procurement-approvals.create'));

        $response->assertOk();
        $response->assertViewIs('equipmentProcurementApproval.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentProcurementApprovalController::class,
            'store',
            EquipmentProcurementApprovalControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $equipment_procurement = EquipmentProcurement::factory()->create();
        $approver = Approver::factory()->create();
        $level = fake()->numberBetween(-10000, 10000);
        $status = fake()->randomElement(/** enum_attributes **/);
        $approver_id = Employee::factory()->create();

        $response = $this->post(route('equipment-procurement-approvals.store'), [
            'equipment_procurement_id' => $equipment_procurement->id,
            'approver_id' => $approver->id,
            'level' => $level,
            'status' => $status,
            'approver_id_id' => $approver_id->id,
        ]);

        $equipmentProcurementApprovals = EquipmentProcurementApproval::query()
            ->where('equipment_procurement_id', $equipment_procurement->id)
            ->where('approver_id', $approver->id)
            ->where('level', $level)
            ->where('status', $status)
            ->where('approver_id_id', $approver_id->id)
            ->get();
        $this->assertCount(1, $equipmentProcurementApprovals);
        $equipmentProcurementApproval = $equipmentProcurementApprovals->first();

        $response->assertRedirect(route('equipmentProcurementApprovals.index'));
        $response->assertSessionHas('equipmentProcurementApproval.id', $equipmentProcurementApproval->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $equipmentProcurementApproval = EquipmentProcurementApproval::factory()->create();

        $response = $this->get(route('equipment-procurement-approvals.show', $equipmentProcurementApproval));

        $response->assertOk();
        $response->assertViewIs('equipmentProcurementApproval.show');
        $response->assertViewHas('equipmentProcurementApproval', $equipmentProcurementApproval);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $equipmentProcurementApproval = EquipmentProcurementApproval::factory()->create();

        $response = $this->get(route('equipment-procurement-approvals.edit', $equipmentProcurementApproval));

        $response->assertOk();
        $response->assertViewIs('equipmentProcurementApproval.edit');
        $response->assertViewHas('equipmentProcurementApproval', $equipmentProcurementApproval);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentProcurementApprovalController::class,
            'update',
            EquipmentProcurementApprovalControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $equipmentProcurementApproval = EquipmentProcurementApproval::factory()->create();
        $equipment_procurement = EquipmentProcurement::factory()->create();
        $approver = Approver::factory()->create();
        $level = fake()->numberBetween(-10000, 10000);
        $status = fake()->randomElement(/** enum_attributes **/);
        $approver_id = Employee::factory()->create();

        $response = $this->put(route('equipment-procurement-approvals.update', $equipmentProcurementApproval), [
            'equipment_procurement_id' => $equipment_procurement->id,
            'approver_id' => $approver->id,
            'level' => $level,
            'status' => $status,
            'approver_id_id' => $approver_id->id,
        ]);

        $equipmentProcurementApproval->refresh();

        $response->assertRedirect(route('equipmentProcurementApprovals.index'));
        $response->assertSessionHas('equipmentProcurementApproval.id', $equipmentProcurementApproval->id);

        $this->assertEquals($equipment_procurement->id, $equipmentProcurementApproval->equipment_procurement_id);
        $this->assertEquals($approver->id, $equipmentProcurementApproval->approver_id);
        $this->assertEquals($level, $equipmentProcurementApproval->level);
        $this->assertEquals($status, $equipmentProcurementApproval->status);
        $this->assertEquals($approver_id->id, $equipmentProcurementApproval->approver_id_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $equipmentProcurementApproval = EquipmentProcurementApproval::factory()->create();

        $response = $this->delete(route('equipment-procurement-approvals.destroy', $equipmentProcurementApproval));

        $response->assertRedirect(route('equipmentProcurementApprovals.index'));

        $this->assertModelMissing($equipmentProcurementApproval);
    }
}
