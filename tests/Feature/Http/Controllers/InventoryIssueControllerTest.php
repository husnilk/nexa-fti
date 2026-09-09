<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\InventoryIssueController;
use App\Http\Requests\InventoryIssueControllerStoreRequest;
use App\Http\Requests\InventoryIssueControllerUpdateRequest;
use App\Models\Employee;
use App\Models\InventoryIssue;
use App\Models\InventoryRequest;
use App\Models\IssuedBy;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see InventoryIssueController
 */
final class InventoryIssueControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $inventoryIssues = InventoryIssue::factory()->count(3)->create();

        $response = $this->get(route('inventory-issues.index'));

        $response->assertOk();
        $response->assertViewIs('inventoryIssue.index');
        $response->assertViewHas('inventoryIssues', $inventoryIssues);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('inventory-issues.create'));

        $response->assertOk();
        $response->assertViewIs('inventoryIssue.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryIssueController::class,
            'store',
            InventoryIssueControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $inventory_request = InventoryRequest::factory()->create();
        $warehouse = Warehouse::factory()->create();
        $issue_number = fake()->word();
        $issue_date = Carbon::parse(fake()->date());
        $issued_by = IssuedBy::factory()->create();
        $issued_by = Employee::factory()->create();

        $response = $this->post(route('inventory-issues.store'), [
            'inventory_request_id' => $inventory_request->id,
            'warehouse_id' => $warehouse->id,
            'issue_number' => $issue_number,
            'issue_date' => $issue_date->toDateString(),
            'issued_by' => $issued_by->id,
            'issued_by_id' => $issued_by->id,
        ]);

        $inventoryIssues = InventoryIssue::query()
            ->where('inventory_request_id', $inventory_request->id)
            ->where('warehouse_id', $warehouse->id)
            ->where('issue_number', $issue_number)
            ->where('issue_date', $issue_date)
            ->where('issued_by', $issued_by->id)
            ->where('issued_by_id', $issued_by->id)
            ->get();
        $this->assertCount(1, $inventoryIssues);
        $inventoryIssue = $inventoryIssues->first();

        $response->assertRedirect(route('inventoryIssues.index'));
        $response->assertSessionHas('inventoryIssue.id', $inventoryIssue->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $inventoryIssue = InventoryIssue::factory()->create();

        $response = $this->get(route('inventory-issues.show', $inventoryIssue));

        $response->assertOk();
        $response->assertViewIs('inventoryIssue.show');
        $response->assertViewHas('inventoryIssue', $inventoryIssue);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $inventoryIssue = InventoryIssue::factory()->create();

        $response = $this->get(route('inventory-issues.edit', $inventoryIssue));

        $response->assertOk();
        $response->assertViewIs('inventoryIssue.edit');
        $response->assertViewHas('inventoryIssue', $inventoryIssue);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryIssueController::class,
            'update',
            InventoryIssueControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $inventoryIssue = InventoryIssue::factory()->create();
        $inventory_request = InventoryRequest::factory()->create();
        $warehouse = Warehouse::factory()->create();
        $issue_number = fake()->word();
        $issue_date = Carbon::parse(fake()->date());
        $issued_by = IssuedBy::factory()->create();
        $issued_by = Employee::factory()->create();

        $response = $this->put(route('inventory-issues.update', $inventoryIssue), [
            'inventory_request_id' => $inventory_request->id,
            'warehouse_id' => $warehouse->id,
            'issue_number' => $issue_number,
            'issue_date' => $issue_date->toDateString(),
            'issued_by' => $issued_by->id,
            'issued_by_id' => $issued_by->id,
        ]);

        $inventoryIssue->refresh();

        $response->assertRedirect(route('inventoryIssues.index'));
        $response->assertSessionHas('inventoryIssue.id', $inventoryIssue->id);

        $this->assertEquals($inventory_request->id, $inventoryIssue->inventory_request_id);
        $this->assertEquals($warehouse->id, $inventoryIssue->warehouse_id);
        $this->assertEquals($issue_number, $inventoryIssue->issue_number);
        $this->assertEquals($issue_date, $inventoryIssue->issue_date);
        $this->assertEquals($issued_by->id, $inventoryIssue->issued_by);
        $this->assertEquals($issued_by->id, $inventoryIssue->issued_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $inventoryIssue = InventoryIssue::factory()->create();

        $response = $this->delete(route('inventory-issues.destroy', $inventoryIssue));

        $response->assertRedirect(route('inventoryIssues.index'));

        $this->assertModelMissing($inventoryIssue);
    }
}
