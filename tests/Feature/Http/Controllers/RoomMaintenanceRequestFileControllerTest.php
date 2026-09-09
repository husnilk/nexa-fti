<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\RoomMaintenanceRequestFileController;
use App\Http\Requests\RoomMaintenanceRequestFileControllerStoreRequest;
use App\Http\Requests\RoomMaintenanceRequestFileControllerUpdateRequest;
use App\Models\RoomMaintenanceRequest;
use App\Models\RoomMaintenanceRequestFile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see RoomMaintenanceRequestFileController
 */
final class RoomMaintenanceRequestFileControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $roomMaintenanceRequestFiles = RoomMaintenanceRequestFile::factory()->count(3)->create();

        $response = $this->get(route('room-maintenance-request-files.index'));

        $response->assertOk();
        $response->assertViewIs('roomMaintenanceRequestFile.index');
        $response->assertViewHas('roomMaintenanceRequestFiles', $roomMaintenanceRequestFiles);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('room-maintenance-request-files.create'));

        $response->assertOk();
        $response->assertViewIs('roomMaintenanceRequestFile.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            RoomMaintenanceRequestFileController::class,
            'store',
            RoomMaintenanceRequestFileControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $room_maintenance_request = RoomMaintenanceRequest::factory()->create();

        $response = $this->post(route('room-maintenance-request-files.store'), [
            'room_maintenance_request_id' => $room_maintenance_request->id,
        ]);

        $roomMaintenanceRequestFiles = RoomMaintenanceRequestFile::query()
            ->where('room_maintenance_request_id', $room_maintenance_request->id)
            ->get();
        $this->assertCount(1, $roomMaintenanceRequestFiles);
        $roomMaintenanceRequestFile = $roomMaintenanceRequestFiles->first();

        $response->assertRedirect(route('roomMaintenanceRequestFiles.index'));
        $response->assertSessionHas('roomMaintenanceRequestFile.id', $roomMaintenanceRequestFile->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $roomMaintenanceRequestFile = RoomMaintenanceRequestFile::factory()->create();

        $response = $this->get(route('room-maintenance-request-files.show', $roomMaintenanceRequestFile));

        $response->assertOk();
        $response->assertViewIs('roomMaintenanceRequestFile.show');
        $response->assertViewHas('roomMaintenanceRequestFile', $roomMaintenanceRequestFile);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $roomMaintenanceRequestFile = RoomMaintenanceRequestFile::factory()->create();

        $response = $this->get(route('room-maintenance-request-files.edit', $roomMaintenanceRequestFile));

        $response->assertOk();
        $response->assertViewIs('roomMaintenanceRequestFile.edit');
        $response->assertViewHas('roomMaintenanceRequestFile', $roomMaintenanceRequestFile);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            RoomMaintenanceRequestFileController::class,
            'update',
            RoomMaintenanceRequestFileControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $roomMaintenanceRequestFile = RoomMaintenanceRequestFile::factory()->create();
        $room_maintenance_request = RoomMaintenanceRequest::factory()->create();

        $response = $this->put(route('room-maintenance-request-files.update', $roomMaintenanceRequestFile), [
            'room_maintenance_request_id' => $room_maintenance_request->id,
        ]);

        $roomMaintenanceRequestFile->refresh();

        $response->assertRedirect(route('roomMaintenanceRequestFiles.index'));
        $response->assertSessionHas('roomMaintenanceRequestFile.id', $roomMaintenanceRequestFile->id);

        $this->assertEquals($room_maintenance_request->id, $roomMaintenanceRequestFile->room_maintenance_request_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $roomMaintenanceRequestFile = RoomMaintenanceRequestFile::factory()->create();

        $response = $this->delete(route('room-maintenance-request-files.destroy', $roomMaintenanceRequestFile));

        $response->assertRedirect(route('roomMaintenanceRequestFiles.index'));

        $this->assertModelMissing($roomMaintenanceRequestFile);
    }
}
