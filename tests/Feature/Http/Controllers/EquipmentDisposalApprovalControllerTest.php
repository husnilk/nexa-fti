<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EquipmentDisposalApprovalController;
use App\Http\Requests\EquipmentDisposalApprovalControllerStoreRequest;
use App\Http\Requests\EquipmentDisposalApprovalControllerUpdateRequest;
use App\Models\Approver;
use App\Models\Employee;
use App\Models\EquipmentDisposal;
use App\Models\EquipmentDisposalApproval;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EquipmentDisposalApprovalController
 */
final class EquipmentDisposalApprovalControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $equipmentDisposalApprovals = EquipmentDisposalApproval::factory()->count(3)->create();

        $response = $this->get(route('equipment-disposal-approvals.index'));

        $response->assertOk();
        $response->assertViewIs('equipmentDisposalApproval.index');
        $response->assertViewHas('equipmentDisposalApprovals', $equipmentDisposalApprovals);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('equipment-disposal-approvals.create'));

        $response->assertOk();
        $response->assertViewIs('equipmentDisposalApproval.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentDisposalApprovalController::class,
            'store',
            EquipmentDisposalApprovalControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $equipment_disposal = EquipmentDisposal::factory()->create();
        $approver = Approver::factory()->create();
        $level = fake()->numberBetween(-10000, 10000);
        $status = fake()->randomElement(/** enum_attributes **/);
        $approver_id = Employee::factory()->create();

        $response = $this->post(route('equipment-disposal-approvals.store'), [
            'equipment_disposal_id' => $equipment_disposal->id,
            'approver_id' => $approver->id,
            'level' => $level,
            'status' => $status,
            'approver_id_id' => $approver_id->id,
        ]);

        $equipmentDisposalApprovals = EquipmentDisposalApproval::query()
            ->where('equipment_disposal_id', $equipment_disposal->id)
            ->where('approver_id', $approver->id)
            ->where('level', $level)
            ->where('status', $status)
            ->where('approver_id_id', $approver_id->id)
            ->get();
        $this->assertCount(1, $equipmentDisposalApprovals);
        $equipmentDisposalApproval = $equipmentDisposalApprovals->first();

        $response->assertRedirect(route('equipmentDisposalApprovals.index'));
        $response->assertSessionHas('equipmentDisposalApproval.id', $equipmentDisposalApproval->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $equipmentDisposalApproval = EquipmentDisposalApproval::factory()->create();

        $response = $this->get(route('equipment-disposal-approvals.show', $equipmentDisposalApproval));

        $response->assertOk();
        $response->assertViewIs('equipmentDisposalApproval.show');
        $response->assertViewHas('equipmentDisposalApproval', $equipmentDisposalApproval);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $equipmentDisposalApproval = EquipmentDisposalApproval::factory()->create();

        $response = $this->get(route('equipment-disposal-approvals.edit', $equipmentDisposalApproval));

        $response->assertOk();
        $response->assertViewIs('equipmentDisposalApproval.edit');
        $response->assertViewHas('equipmentDisposalApproval', $equipmentDisposalApproval);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentDisposalApprovalController::class,
            'update',
            EquipmentDisposalApprovalControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $equipmentDisposalApproval = EquipmentDisposalApproval::factory()->create();
        $equipment_disposal = EquipmentDisposal::factory()->create();
        $approver = Approver::factory()->create();
        $level = fake()->numberBetween(-10000, 10000);
        $status = fake()->randomElement(/** enum_attributes **/);
        $approver_id = Employee::factory()->create();

        $response = $this->put(route('equipment-disposal-approvals.update', $equipmentDisposalApproval), [
            'equipment_disposal_id' => $equipment_disposal->id,
            'approver_id' => $approver->id,
            'level' => $level,
            'status' => $status,
            'approver_id_id' => $approver_id->id,
        ]);

        $equipmentDisposalApproval->refresh();

        $response->assertRedirect(route('equipmentDisposalApprovals.index'));
        $response->assertSessionHas('equipmentDisposalApproval.id', $equipmentDisposalApproval->id);

        $this->assertEquals($equipment_disposal->id, $equipmentDisposalApproval->equipment_disposal_id);
        $this->assertEquals($approver->id, $equipmentDisposalApproval->approver_id);
        $this->assertEquals($level, $equipmentDisposalApproval->level);
        $this->assertEquals($status, $equipmentDisposalApproval->status);
        $this->assertEquals($approver_id->id, $equipmentDisposalApproval->approver_id_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $equipmentDisposalApproval = EquipmentDisposalApproval::factory()->create();

        $response = $this->delete(route('equipment-disposal-approvals.destroy', $equipmentDisposalApproval));

        $response->assertRedirect(route('equipmentDisposalApprovals.index'));

        $this->assertModelMissing($equipmentDisposalApproval);
    }
}
