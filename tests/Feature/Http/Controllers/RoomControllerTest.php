<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\RoomController;
use App\Http\Requests\RoomControllerStoreRequest;
use App\Http\Requests\RoomControllerUpdateRequest;
use App\Models\Asset;
use App\Models\Building;
use App\Models\Employee;
use App\Models\ResponsibleEmployee;
use App\Models\Room;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see RoomController
 */
final class RoomControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $rooms = Room::factory()->count(3)->create();

        $response = $this->get(route('rooms.index'));

        $response->assertOk();
        $response->assertViewIs('room.index');
        $response->assertViewHas('rooms', $rooms);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('rooms.create'));

        $response->assertOk();
        $response->assertViewIs('room.manage');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            RoomController::class,
            'store',
            RoomControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $building = Building::factory()->create();
        $name = fake()->name();
        $code = fake()->word();
        $capacity = fake()->numberBetween(-10000, 10000);
        $is_public = fake()->boolean();
        $responsible_employee = ResponsibleEmployee::factory()->create();
        $asset = Asset::factory()->create();
        $responsible_employee_id = Employee::factory()->create();

        $response = $this->post(route('rooms.store'), [
            'building_id' => $building->id,
            'name' => $name,
            'code' => $code,
            'capacity' => $capacity,
            'is_public' => $is_public,
            'responsible_employee_id' => $responsible_employee->id,
            'asset_id' => $asset->id,
            'responsible_employee_id_id' => $responsible_employee_id->id,
        ]);

        $rooms = Room::query()
            ->where('building_id', $building->id)
            ->where('name', $name)
            ->where('code', $code)
            ->where('capacity', $capacity)
            ->where('is_public', $is_public)
            ->where('responsible_employee_id', $responsible_employee->id)
            ->where('asset_id', $asset->id)
            ->where('responsible_employee_id_id', $responsible_employee_id->id)
            ->get();
        $this->assertCount(1, $rooms);
        $room = $rooms->first();

        $response->assertRedirect(route('rooms.index'));
        $response->assertSessionHas('room.id', $room->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $room = Room::factory()->create();

        $response = $this->get(route('rooms.show', $room));

        $response->assertOk();
        $response->assertViewIs('room.show');
        $response->assertViewHas('room', $room);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $room = Room::factory()->create();

        $response = $this->get(route('rooms.edit', $room));

        $response->assertOk();
        $response->assertViewIs('room.edit');
        $response->assertViewHas('room', $room);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            RoomController::class,
            'update',
            RoomControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $room = Room::factory()->create();
        $building = Building::factory()->create();
        $name = fake()->name();
        $code = fake()->word();
        $capacity = fake()->numberBetween(-10000, 10000);
        $is_public = fake()->boolean();
        $responsible_employee = ResponsibleEmployee::factory()->create();
        $asset = Asset::factory()->create();
        $responsible_employee_id = Employee::factory()->create();

        $response = $this->put(route('rooms.update', $room), [
            'building_id' => $building->id,
            'name' => $name,
            'code' => $code,
            'capacity' => $capacity,
            'is_public' => $is_public,
            'responsible_employee_id' => $responsible_employee->id,
            'asset_id' => $asset->id,
            'responsible_employee_id_id' => $responsible_employee_id->id,
        ]);

        $room->refresh();

        $response->assertRedirect(route('rooms.index'));
        $response->assertSessionHas('room.id', $room->id);

        $this->assertEquals($building->id, $room->building_id);
        $this->assertEquals($name, $room->name);
        $this->assertEquals($code, $room->code);
        $this->assertEquals($capacity, $room->capacity);
        $this->assertEquals($is_public, $room->is_public);
        $this->assertEquals($responsible_employee->id, $room->responsible_employee_id);
        $this->assertEquals($asset->id, $room->asset_id);
        $this->assertEquals($responsible_employee_id->id, $room->responsible_employee_id_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $room = Room::factory()->create();

        $response = $this->delete(route('rooms.destroy', $room));

        $response->assertRedirect(route('rooms.index'));

        $this->assertModelMissing($room);
    }
}
