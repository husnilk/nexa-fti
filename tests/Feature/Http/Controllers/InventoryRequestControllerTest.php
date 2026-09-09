<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\InventoryRequestController;
use App\Http\Requests\InventoryRequestControllerStoreRequest;
use App\Http\Requests\InventoryRequestControllerUpdateRequest;
use App\Models\Employee;
use App\Models\InventoryRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see InventoryRequestController
 */
final class InventoryRequestControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $inventoryRequests = InventoryRequest::factory()->count(3)->create();

        $response = $this->get(route('inventory-requests.index'));

        $response->assertOk();
        $response->assertViewIs('inventoryRequest.index');
        $response->assertViewHas('inventoryRequests', $inventoryRequests);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('inventory-requests.create'));

        $response->assertOk();
        $response->assertViewIs('inventoryRequest.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryRequestController::class,
            'store',
            InventoryRequestControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $request_number = fake()->word();
        $employee = Employee::factory()->create();
        $request_date = Carbon::parse(fake()->date());
        $status = fake()->randomElement(/** enum_attributes **/);
        $approved_by = Employee::factory()->create();

        $response = $this->post(route('inventory-requests.store'), [
            'request_number' => $request_number,
            'employee_id' => $employee->id,
            'request_date' => $request_date->toDateString(),
            'status' => $status,
            'approved_by_id' => $approved_by->id,
        ]);

        $inventoryRequests = InventoryRequest::query()
            ->where('request_number', $request_number)
            ->where('employee_id', $employee->id)
            ->where('request_date', $request_date)
            ->where('status', $status)
            ->where('approved_by_id', $approved_by->id)
            ->get();
        $this->assertCount(1, $inventoryRequests);
        $inventoryRequest = $inventoryRequests->first();

        $response->assertRedirect(route('inventoryRequests.index'));
        $response->assertSessionHas('inventoryRequest.id', $inventoryRequest->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $inventoryRequest = InventoryRequest::factory()->create();

        $response = $this->get(route('inventory-requests.show', $inventoryRequest));

        $response->assertOk();
        $response->assertViewIs('inventoryRequest.show');
        $response->assertViewHas('inventoryRequest', $inventoryRequest);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $inventoryRequest = InventoryRequest::factory()->create();

        $response = $this->get(route('inventory-requests.edit', $inventoryRequest));

        $response->assertOk();
        $response->assertViewIs('inventoryRequest.edit');
        $response->assertViewHas('inventoryRequest', $inventoryRequest);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryRequestController::class,
            'update',
            InventoryRequestControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $inventoryRequest = InventoryRequest::factory()->create();
        $request_number = fake()->word();
        $employee = Employee::factory()->create();
        $request_date = Carbon::parse(fake()->date());
        $status = fake()->randomElement(/** enum_attributes **/);
        $approved_by = Employee::factory()->create();

        $response = $this->put(route('inventory-requests.update', $inventoryRequest), [
            'request_number' => $request_number,
            'employee_id' => $employee->id,
            'request_date' => $request_date->toDateString(),
            'status' => $status,
            'approved_by_id' => $approved_by->id,
        ]);

        $inventoryRequest->refresh();

        $response->assertRedirect(route('inventoryRequests.index'));
        $response->assertSessionHas('inventoryRequest.id', $inventoryRequest->id);

        $this->assertEquals($request_number, $inventoryRequest->request_number);
        $this->assertEquals($employee->id, $inventoryRequest->employee_id);
        $this->assertEquals($request_date, $inventoryRequest->request_date);
        $this->assertEquals($status, $inventoryRequest->status);
        $this->assertEquals($approved_by->id, $inventoryRequest->approved_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $inventoryRequest = InventoryRequest::factory()->create();

        $response = $this->delete(route('inventory-requests.destroy', $inventoryRequest));

        $response->assertRedirect(route('inventoryRequests.index'));

        $this->assertModelMissing($inventoryRequest);
    }
}
