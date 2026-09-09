<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EquipmentUsageApprovalController;
use App\Http\Requests\EquipmentUsageApprovalControllerStoreRequest;
use App\Http\Requests\EquipmentUsageApprovalControllerUpdateRequest;
use App\Models\Approver;
use App\Models\Employee;
use App\Models\EquipmentUsage;
use App\Models\EquipmentUsageApproval;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EquipmentUsageApprovalController
 */
final class EquipmentUsageApprovalControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $equipmentUsageApprovals = EquipmentUsageApproval::factory()->count(3)->create();

        $response = $this->get(route('equipment-usage-approvals.index'));

        $response->assertOk();
        $response->assertViewIs('equipmentUsageApproval.index');
        $response->assertViewHas('equipmentUsageApprovals', $equipmentUsageApprovals);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('equipment-usage-approvals.create'));

        $response->assertOk();
        $response->assertViewIs('equipmentUsageApproval.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentUsageApprovalController::class,
            'store',
            EquipmentUsageApprovalControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $equipment_usage = EquipmentUsage::factory()->create();
        $approver = Approver::factory()->create();
        $level = fake()->numberBetween(-10000, 10000);
        $status = fake()->randomElement(/** enum_attributes **/);
        $approver_id = Employee::factory()->create();

        $response = $this->post(route('equipment-usage-approvals.store'), [
            'equipment_usage_id' => $equipment_usage->id,
            'approver_id' => $approver->id,
            'level' => $level,
            'status' => $status,
            'approver_id_id' => $approver_id->id,
        ]);

        $equipmentUsageApprovals = EquipmentUsageApproval::query()
            ->where('equipment_usage_id', $equipment_usage->id)
            ->where('approver_id', $approver->id)
            ->where('level', $level)
            ->where('status', $status)
            ->where('approver_id_id', $approver_id->id)
            ->get();
        $this->assertCount(1, $equipmentUsageApprovals);
        $equipmentUsageApproval = $equipmentUsageApprovals->first();

        $response->assertRedirect(route('equipmentUsageApprovals.index'));
        $response->assertSessionHas('equipmentUsageApproval.id', $equipmentUsageApproval->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $equipmentUsageApproval = EquipmentUsageApproval::factory()->create();

        $response = $this->get(route('equipment-usage-approvals.show', $equipmentUsageApproval));

        $response->assertOk();
        $response->assertViewIs('equipmentUsageApproval.show');
        $response->assertViewHas('equipmentUsageApproval', $equipmentUsageApproval);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $equipmentUsageApproval = EquipmentUsageApproval::factory()->create();

        $response = $this->get(route('equipment-usage-approvals.edit', $equipmentUsageApproval));

        $response->assertOk();
        $response->assertViewIs('equipmentUsageApproval.edit');
        $response->assertViewHas('equipmentUsageApproval', $equipmentUsageApproval);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentUsageApprovalController::class,
            'update',
            EquipmentUsageApprovalControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $equipmentUsageApproval = EquipmentUsageApproval::factory()->create();
        $equipment_usage = EquipmentUsage::factory()->create();
        $approver = Approver::factory()->create();
        $level = fake()->numberBetween(-10000, 10000);
        $status = fake()->randomElement(/** enum_attributes **/);
        $approver_id = Employee::factory()->create();

        $response = $this->put(route('equipment-usage-approvals.update', $equipmentUsageApproval), [
            'equipment_usage_id' => $equipment_usage->id,
            'approver_id' => $approver->id,
            'level' => $level,
            'status' => $status,
            'approver_id_id' => $approver_id->id,
        ]);

        $equipmentUsageApproval->refresh();

        $response->assertRedirect(route('equipmentUsageApprovals.index'));
        $response->assertSessionHas('equipmentUsageApproval.id', $equipmentUsageApproval->id);

        $this->assertEquals($equipment_usage->id, $equipmentUsageApproval->equipment_usage_id);
        $this->assertEquals($approver->id, $equipmentUsageApproval->approver_id);
        $this->assertEquals($level, $equipmentUsageApproval->level);
        $this->assertEquals($status, $equipmentUsageApproval->status);
        $this->assertEquals($approver_id->id, $equipmentUsageApproval->approver_id_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $equipmentUsageApproval = EquipmentUsageApproval::factory()->create();

        $response = $this->delete(route('equipment-usage-approvals.destroy', $equipmentUsageApproval));

        $response->assertRedirect(route('equipmentUsageApprovals.index'));

        $this->assertModelMissing($equipmentUsageApproval);
    }
}
