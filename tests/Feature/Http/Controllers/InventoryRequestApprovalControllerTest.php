<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\InventoryRequestApprovalController;
use App\Http\Requests\InventoryRequestApprovalControllerStoreRequest;
use App\Http\Requests\InventoryRequestApprovalControllerUpdateRequest;
use App\Models\Approver;
use App\Models\Employee;
use App\Models\InventoryRequest;
use App\Models\InventoryRequestApproval;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see InventoryRequestApprovalController
 */
final class InventoryRequestApprovalControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $inventoryRequestApprovals = InventoryRequestApproval::factory()->count(3)->create();

        $response = $this->get(route('inventory-request-approvals.index'));

        $response->assertOk();
        $response->assertViewIs('inventoryRequestApproval.index');
        $response->assertViewHas('inventoryRequestApprovals', $inventoryRequestApprovals);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('inventory-request-approvals.create'));

        $response->assertOk();
        $response->assertViewIs('inventoryRequestApproval.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryRequestApprovalController::class,
            'store',
            InventoryRequestApprovalControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $inventory_request = InventoryRequest::factory()->create();
        $approver = Approver::factory()->create();
        $status = fake()->randomElement(/** enum_attributes **/);
        $action_date = Carbon::parse(fake()->dateTime());
        $approver_id = Employee::factory()->create();

        $response = $this->post(route('inventory-request-approvals.store'), [
            'inventory_request_id' => $inventory_request->id,
            'approver_id' => $approver->id,
            'status' => $status,
            'action_date' => $action_date->toDateTimeString(),
            'approver_id_id' => $approver_id->id,
        ]);

        $inventoryRequestApprovals = InventoryRequestApproval::query()
            ->where('inventory_request_id', $inventory_request->id)
            ->where('approver_id', $approver->id)
            ->where('status', $status)
            ->where('action_date', $action_date)
            ->where('approver_id_id', $approver_id->id)
            ->get();
        $this->assertCount(1, $inventoryRequestApprovals);
        $inventoryRequestApproval = $inventoryRequestApprovals->first();

        $response->assertRedirect(route('inventoryRequestApprovals.index'));
        $response->assertSessionHas('inventoryRequestApproval.id', $inventoryRequestApproval->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $inventoryRequestApproval = InventoryRequestApproval::factory()->create();

        $response = $this->get(route('inventory-request-approvals.show', $inventoryRequestApproval));

        $response->assertOk();
        $response->assertViewIs('inventoryRequestApproval.show');
        $response->assertViewHas('inventoryRequestApproval', $inventoryRequestApproval);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $inventoryRequestApproval = InventoryRequestApproval::factory()->create();

        $response = $this->get(route('inventory-request-approvals.edit', $inventoryRequestApproval));

        $response->assertOk();
        $response->assertViewIs('inventoryRequestApproval.edit');
        $response->assertViewHas('inventoryRequestApproval', $inventoryRequestApproval);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryRequestApprovalController::class,
            'update',
            InventoryRequestApprovalControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $inventoryRequestApproval = InventoryRequestApproval::factory()->create();
        $inventory_request = InventoryRequest::factory()->create();
        $approver = Approver::factory()->create();
        $status = fake()->randomElement(/** enum_attributes **/);
        $action_date = Carbon::parse(fake()->dateTime());
        $approver_id = Employee::factory()->create();

        $response = $this->put(route('inventory-request-approvals.update', $inventoryRequestApproval), [
            'inventory_request_id' => $inventory_request->id,
            'approver_id' => $approver->id,
            'status' => $status,
            'action_date' => $action_date->toDateTimeString(),
            'approver_id_id' => $approver_id->id,
        ]);

        $inventoryRequestApproval->refresh();

        $response->assertRedirect(route('inventoryRequestApprovals.index'));
        $response->assertSessionHas('inventoryRequestApproval.id', $inventoryRequestApproval->id);

        $this->assertEquals($inventory_request->id, $inventoryRequestApproval->inventory_request_id);
        $this->assertEquals($approver->id, $inventoryRequestApproval->approver_id);
        $this->assertEquals($status, $inventoryRequestApproval->status);
        $this->assertEquals($action_date->timestamp, $inventoryRequestApproval->action_date);
        $this->assertEquals($approver_id->id, $inventoryRequestApproval->approver_id_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $inventoryRequestApproval = InventoryRequestApproval::factory()->create();

        $response = $this->delete(route('inventory-request-approvals.destroy', $inventoryRequestApproval));

        $response->assertRedirect(route('inventoryRequestApprovals.index'));

        $this->assertModelMissing($inventoryRequestApproval);
    }
}
