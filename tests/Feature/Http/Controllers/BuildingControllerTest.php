<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\BuildingController;
use App\Http\Requests\BuildingControllerStoreRequest;
use App\Http\Requests\BuildingControllerUpdateRequest;
use App\Models\Building;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see BuildingController
 */
final class BuildingControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $buildings = Building::factory()->count(3)->create();

        $response = $this->get(route('buildings.index'));

        $response->assertOk();
        $response->assertViewIs('building.index');
        $response->assertViewHas('buildings', $buildings);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('buildings.create'));

        $response->assertOk();
        $response->assertViewIs('building.manage');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            BuildingController::class,
            'store',
            BuildingControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $name = fake()->name();
        $code = fake()->word();

        $response = $this->post(route('buildings.store'), [
            'name' => $name,
            'code' => $code,
        ]);

        $buildings = Building::query()
            ->where('name', $name)
            ->where('code', $code)
            ->get();
        $this->assertCount(1, $buildings);
        $building = $buildings->first();

        $response->assertRedirect(route('buildings.index'));
        $response->assertSessionHas('building.id', $building->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $building = Building::factory()->create();

        $response = $this->get(route('buildings.show', $building));

        $response->assertOk();
        $response->assertViewIs('building.show');
        $response->assertViewHas('building', $building);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $building = Building::factory()->create();

        $response = $this->get(route('buildings.edit', $building));

        $response->assertOk();
        $response->assertViewIs('building.edit');
        $response->assertViewHas('building', $building);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            BuildingController::class,
            'update',
            BuildingControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $building = Building::factory()->create();
        $name = fake()->name();
        $code = fake()->word();

        $response = $this->put(route('buildings.update', $building), [
            'name' => $name,
            'code' => $code,
        ]);

        $building->refresh();

        $response->assertRedirect(route('buildings.index'));
        $response->assertSessionHas('building.id', $building->id);

        $this->assertEquals($name, $building->name);
        $this->assertEquals($code, $building->code);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $building = Building::factory()->create();

        $response = $this->delete(route('buildings.destroy', $building));

        $response->assertRedirect(route('buildings.index'));

        $this->assertModelMissing($building);
    }
}
