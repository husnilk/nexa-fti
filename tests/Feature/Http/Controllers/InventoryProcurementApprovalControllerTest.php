<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\InventoryProcurementApprovalController;
use App\Http\Requests\InventoryProcurementApprovalControllerStoreRequest;
use App\Http\Requests\InventoryProcurementApprovalControllerUpdateRequest;
use App\Models\Approver;
use App\Models\Employee;
use App\Models\InventoryProcurement;
use App\Models\InventoryProcurementApproval;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see InventoryProcurementApprovalController
 */
final class InventoryProcurementApprovalControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $inventoryProcurementApprovals = InventoryProcurementApproval::factory()->count(3)->create();

        $response = $this->get(route('inventory-procurement-approvals.index'));

        $response->assertOk();
        $response->assertViewIs('inventoryProcurementApproval.index');
        $response->assertViewHas('inventoryProcurementApprovals', $inventoryProcurementApprovals);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('inventory-procurement-approvals.create'));

        $response->assertOk();
        $response->assertViewIs('inventoryProcurementApproval.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryProcurementApprovalController::class,
            'store',
            InventoryProcurementApprovalControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $inventory_procurement = InventoryProcurement::factory()->create();
        $approver = Approver::factory()->create();
        $level = fake()->numberBetween(-10000, 10000);
        $status = fake()->randomElement(/** enum_attributes **/);
        $approver_id = Employee::factory()->create();

        $response = $this->post(route('inventory-procurement-approvals.store'), [
            'inventory_procurement_id' => $inventory_procurement->id,
            'approver_id' => $approver->id,
            'level' => $level,
            'status' => $status,
            'approver_id_id' => $approver_id->id,
        ]);

        $inventoryProcurementApprovals = InventoryProcurementApproval::query()
            ->where('inventory_procurement_id', $inventory_procurement->id)
            ->where('approver_id', $approver->id)
            ->where('level', $level)
            ->where('status', $status)
            ->where('approver_id_id', $approver_id->id)
            ->get();
        $this->assertCount(1, $inventoryProcurementApprovals);
        $inventoryProcurementApproval = $inventoryProcurementApprovals->first();

        $response->assertRedirect(route('inventoryProcurementApprovals.index'));
        $response->assertSessionHas('inventoryProcurementApproval.id', $inventoryProcurementApproval->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $inventoryProcurementApproval = InventoryProcurementApproval::factory()->create();

        $response = $this->get(route('inventory-procurement-approvals.show', $inventoryProcurementApproval));

        $response->assertOk();
        $response->assertViewIs('inventoryProcurementApproval.show');
        $response->assertViewHas('inventoryProcurementApproval', $inventoryProcurementApproval);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $inventoryProcurementApproval = InventoryProcurementApproval::factory()->create();

        $response = $this->get(route('inventory-procurement-approvals.edit', $inventoryProcurementApproval));

        $response->assertOk();
        $response->assertViewIs('inventoryProcurementApproval.edit');
        $response->assertViewHas('inventoryProcurementApproval', $inventoryProcurementApproval);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryProcurementApprovalController::class,
            'update',
            InventoryProcurementApprovalControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $inventoryProcurementApproval = InventoryProcurementApproval::factory()->create();
        $inventory_procurement = InventoryProcurement::factory()->create();
        $approver = Approver::factory()->create();
        $level = fake()->numberBetween(-10000, 10000);
        $status = fake()->randomElement(/** enum_attributes **/);
        $approver_id = Employee::factory()->create();

        $response = $this->put(route('inventory-procurement-approvals.update', $inventoryProcurementApproval), [
            'inventory_procurement_id' => $inventory_procurement->id,
            'approver_id' => $approver->id,
            'level' => $level,
            'status' => $status,
            'approver_id_id' => $approver_id->id,
        ]);

        $inventoryProcurementApproval->refresh();

        $response->assertRedirect(route('inventoryProcurementApprovals.index'));
        $response->assertSessionHas('inventoryProcurementApproval.id', $inventoryProcurementApproval->id);

        $this->assertEquals($inventory_procurement->id, $inventoryProcurementApproval->inventory_procurement_id);
        $this->assertEquals($approver->id, $inventoryProcurementApproval->approver_id);
        $this->assertEquals($level, $inventoryProcurementApproval->level);
        $this->assertEquals($status, $inventoryProcurementApproval->status);
        $this->assertEquals($approver_id->id, $inventoryProcurementApproval->approver_id_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $inventoryProcurementApproval = InventoryProcurementApproval::factory()->create();

        $response = $this->delete(route('inventory-procurement-approvals.destroy', $inventoryProcurementApproval));

        $response->assertRedirect(route('inventoryProcurementApprovals.index'));

        $this->assertModelMissing($inventoryProcurementApproval);
    }
}
