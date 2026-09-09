<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\InventoryRequestDetailController;
use App\Http\Requests\InventoryRequestDetailControllerStoreRequest;
use App\Http\Requests\InventoryRequestDetailControllerUpdateRequest;
use App\Models\InventoryRequestDetail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see InventoryRequestDetailController
 */
final class InventoryRequestDetailControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $inventoryRequestDetails = InventoryRequestDetail::factory()->count(3)->create();

        $response = $this->get(route('inventory-request-details.index'));

        $response->assertOk();
        $response->assertViewIs('inventoryRequestDetail.index');
        $response->assertViewHas('inventoryRequestDetails', $inventoryRequestDetails);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('inventory-request-details.create'));

        $response->assertOk();
        $response->assertViewIs('inventoryRequestDetail.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryRequestDetailController::class,
            'store',
            InventoryRequestDetailControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $response = $this->post(route('inventory-request-details.store'));

        $response->assertRedirect(route('inventoryRequestDetails.index'));
        $response->assertSessionHas('inventoryRequestDetail.id', $inventoryRequestDetail->id);

        $this->assertDatabaseHas(inventoryRequestDetails, [/* ... */]);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $inventoryRequestDetail = InventoryRequestDetail::factory()->create();

        $response = $this->get(route('inventory-request-details.show', $inventoryRequestDetail));

        $response->assertOk();
        $response->assertViewIs('inventoryRequestDetail.show');
        $response->assertViewHas('inventoryRequestDetail', $inventoryRequestDetail);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $inventoryRequestDetail = InventoryRequestDetail::factory()->create();

        $response = $this->get(route('inventory-request-details.edit', $inventoryRequestDetail));

        $response->assertOk();
        $response->assertViewIs('inventoryRequestDetail.edit');
        $response->assertViewHas('inventoryRequestDetail', $inventoryRequestDetail);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryRequestDetailController::class,
            'update',
            InventoryRequestDetailControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $inventoryRequestDetail = InventoryRequestDetail::factory()->create();

        $response = $this->put(route('inventory-request-details.update', $inventoryRequestDetail));

        $inventoryRequestDetail->refresh();

        $response->assertRedirect(route('inventoryRequestDetails.index'));
        $response->assertSessionHas('inventoryRequestDetail.id', $inventoryRequestDetail->id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $inventoryRequestDetail = InventoryRequestDetail::factory()->create();

        $response = $this->delete(route('inventory-request-details.destroy', $inventoryRequestDetail));

        $response->assertRedirect(route('inventoryRequestDetails.index'));

        $this->assertModelMissing($inventoryRequestDetail);
    }
}
