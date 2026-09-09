<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\InventoryProcurementController;
use App\Http\Requests\InventoryProcurementControllerStoreRequest;
use App\Http\Requests\InventoryProcurementControllerUpdateRequest;
use App\Models\CreatedBy;
use App\Models\Employee;
use App\Models\InventoryProcurement;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see InventoryProcurementController
 */
final class InventoryProcurementControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $inventoryProcurements = InventoryProcurement::factory()->count(3)->create();

        $response = $this->get(route('inventory-procurements.index'));

        $response->assertOk();
        $response->assertViewIs('inventoryProcurement.index');
        $response->assertViewHas('inventoryProcurements', $inventoryProcurements);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('inventory-procurements.create'));

        $response->assertOk();
        $response->assertViewIs('inventoryProcurement.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryProcurementController::class,
            'store',
            InventoryProcurementControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $request_number = fake()->word();
        $title = fake()->sentence(4);
        $status = fake()->randomElement(/** enum_attributes **/);
        $created_by = CreatedBy::factory()->create();
        $created_by = Employee::factory()->create();

        $response = $this->post(route('inventory-procurements.store'), [
            'request_number' => $request_number,
            'title' => $title,
            'status' => $status,
            'created_by' => $created_by->id,
            'created_by_id' => $created_by->id,
        ]);

        $inventoryProcurements = InventoryProcurement::query()
            ->where('request_number', $request_number)
            ->where('title', $title)
            ->where('status', $status)
            ->where('created_by', $created_by->id)
            ->where('created_by_id', $created_by->id)
            ->get();
        $this->assertCount(1, $inventoryProcurements);
        $inventoryProcurement = $inventoryProcurements->first();

        $response->assertRedirect(route('inventoryProcurements.index'));
        $response->assertSessionHas('inventoryProcurement.id', $inventoryProcurement->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $inventoryProcurement = InventoryProcurement::factory()->create();

        $response = $this->get(route('inventory-procurements.show', $inventoryProcurement));

        $response->assertOk();
        $response->assertViewIs('inventoryProcurement.show');
        $response->assertViewHas('inventoryProcurement', $inventoryProcurement);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $inventoryProcurement = InventoryProcurement::factory()->create();

        $response = $this->get(route('inventory-procurements.edit', $inventoryProcurement));

        $response->assertOk();
        $response->assertViewIs('inventoryProcurement.edit');
        $response->assertViewHas('inventoryProcurement', $inventoryProcurement);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryProcurementController::class,
            'update',
            InventoryProcurementControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $inventoryProcurement = InventoryProcurement::factory()->create();
        $request_number = fake()->word();
        $title = fake()->sentence(4);
        $status = fake()->randomElement(/** enum_attributes **/);
        $created_by = CreatedBy::factory()->create();
        $created_by = Employee::factory()->create();

        $response = $this->put(route('inventory-procurements.update', $inventoryProcurement), [
            'request_number' => $request_number,
            'title' => $title,
            'status' => $status,
            'created_by' => $created_by->id,
            'created_by_id' => $created_by->id,
        ]);

        $inventoryProcurement->refresh();

        $response->assertRedirect(route('inventoryProcurements.index'));
        $response->assertSessionHas('inventoryProcurement.id', $inventoryProcurement->id);

        $this->assertEquals($request_number, $inventoryProcurement->request_number);
        $this->assertEquals($title, $inventoryProcurement->title);
        $this->assertEquals($status, $inventoryProcurement->status);
        $this->assertEquals($created_by->id, $inventoryProcurement->created_by);
        $this->assertEquals($created_by->id, $inventoryProcurement->created_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $inventoryProcurement = InventoryProcurement::factory()->create();

        $response = $this->delete(route('inventory-procurements.destroy', $inventoryProcurement));

        $response->assertRedirect(route('inventoryProcurements.index'));

        $this->assertModelMissing($inventoryProcurement);
    }
}
