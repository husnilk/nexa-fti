<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\WarehouseController;
use App\Http\Requests\WarehouseControllerStoreRequest;
use App\Http\Requests\WarehouseControllerUpdateRequest;
use App\Models\OrganizationUnit;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see WarehouseController
 */
final class WarehouseControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $warehouses = Warehouse::factory()->count(3)->create();

        $response = $this->get(route('warehouses.index'));

        $response->assertOk();
        $response->assertViewIs('warehouse.index');
        $response->assertViewHas('warehouses', $warehouses);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('warehouses.create'));

        $response->assertOk();
        $response->assertViewIs('warehouse.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            WarehouseController::class,
            'store',
            WarehouseControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $organization_unit = OrganizationUnit::factory()->create();
        $code = fake()->word();
        $name = fake()->name();
        $is_active = fake()->boolean();

        $response = $this->post(route('warehouses.store'), [
            'organization_unit_id' => $organization_unit->id,
            'code' => $code,
            'name' => $name,
            'is_active' => $is_active,
        ]);

        $warehouses = Warehouse::query()
            ->where('organization_unit_id', $organization_unit->id)
            ->where('code', $code)
            ->where('name', $name)
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $warehouses);
        $warehouse = $warehouses->first();

        $response->assertRedirect(route('warehouses.index'));
        $response->assertSessionHas('warehouse.id', $warehouse->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $warehouse = Warehouse::factory()->create();

        $response = $this->get(route('warehouses.show', $warehouse));

        $response->assertOk();
        $response->assertViewIs('warehouse.show');
        $response->assertViewHas('warehouse', $warehouse);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $warehouse = Warehouse::factory()->create();

        $response = $this->get(route('warehouses.edit', $warehouse));

        $response->assertOk();
        $response->assertViewIs('warehouse.edit');
        $response->assertViewHas('warehouse', $warehouse);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            WarehouseController::class,
            'update',
            WarehouseControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $warehouse = Warehouse::factory()->create();
        $organization_unit = OrganizationUnit::factory()->create();
        $code = fake()->word();
        $name = fake()->name();
        $is_active = fake()->boolean();

        $response = $this->put(route('warehouses.update', $warehouse), [
            'organization_unit_id' => $organization_unit->id,
            'code' => $code,
            'name' => $name,
            'is_active' => $is_active,
        ]);

        $warehouse->refresh();

        $response->assertRedirect(route('warehouses.index'));
        $response->assertSessionHas('warehouse.id', $warehouse->id);

        $this->assertEquals($organization_unit->id, $warehouse->organization_unit_id);
        $this->assertEquals($code, $warehouse->code);
        $this->assertEquals($name, $warehouse->name);
        $this->assertEquals($is_active, $warehouse->is_active);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $warehouse = Warehouse::factory()->create();

        $response = $this->delete(route('warehouses.destroy', $warehouse));

        $response->assertRedirect(route('warehouses.index'));

        $this->assertModelMissing($warehouse);
    }
}
