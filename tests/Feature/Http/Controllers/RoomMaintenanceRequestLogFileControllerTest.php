<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\RoomMaintenanceRequestLogFileController;
use App\Http\Requests\RoomMaintenanceRequestLogFileControllerStoreRequest;
use App\Http\Requests\RoomMaintenanceRequestLogFileControllerUpdateRequest;
use App\Models\RoomMaintenanceRequestLog;
use App\Models\RoomMaintenanceRequestLogFile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see RoomMaintenanceRequestLogFileController
 */
final class RoomMaintenanceRequestLogFileControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $roomMaintenanceRequestLogFiles = RoomMaintenanceRequestLogFile::factory()->count(3)->create();

        $response = $this->get(route('room-maintenance-request-log-files.index'));

        $response->assertOk();
        $response->assertViewIs('roomMaintenanceRequestLogFile.index');
        $response->assertViewHas('roomMaintenanceRequestLogFiles', $roomMaintenanceRequestLogFiles);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('room-maintenance-request-log-files.create'));

        $response->assertOk();
        $response->assertViewIs('roomMaintenanceRequestLogFile.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            RoomMaintenanceRequestLogFileController::class,
            'store',
            RoomMaintenanceRequestLogFileControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $room_maintenance_request_log = RoomMaintenanceRequestLog::factory()->create();

        $response = $this->post(route('room-maintenance-request-log-files.store'), [
            'room_maintenance_request_log_id' => $room_maintenance_request_log->id,
        ]);

        $roomMaintenanceRequestLogFiles = RoomMaintenanceRequestLogFile::query()
            ->where('room_maintenance_request_log_id', $room_maintenance_request_log->id)
            ->get();
        $this->assertCount(1, $roomMaintenanceRequestLogFiles);
        $roomMaintenanceRequestLogFile = $roomMaintenanceRequestLogFiles->first();

        $response->assertRedirect(route('roomMaintenanceRequestLogFiles.index'));
        $response->assertSessionHas('roomMaintenanceRequestLogFile.id', $roomMaintenanceRequestLogFile->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $roomMaintenanceRequestLogFile = RoomMaintenanceRequestLogFile::factory()->create();

        $response = $this->get(route('room-maintenance-request-log-files.show', $roomMaintenanceRequestLogFile));

        $response->assertOk();
        $response->assertViewIs('roomMaintenanceRequestLogFile.show');
        $response->assertViewHas('roomMaintenanceRequestLogFile', $roomMaintenanceRequestLogFile);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $roomMaintenanceRequestLogFile = RoomMaintenanceRequestLogFile::factory()->create();

        $response = $this->get(route('room-maintenance-request-log-files.edit', $roomMaintenanceRequestLogFile));

        $response->assertOk();
        $response->assertViewIs('roomMaintenanceRequestLogFile.edit');
        $response->assertViewHas('roomMaintenanceRequestLogFile', $roomMaintenanceRequestLogFile);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            RoomMaintenanceRequestLogFileController::class,
            'update',
            RoomMaintenanceRequestLogFileControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $roomMaintenanceRequestLogFile = RoomMaintenanceRequestLogFile::factory()->create();
        $room_maintenance_request_log = RoomMaintenanceRequestLog::factory()->create();

        $response = $this->put(route('room-maintenance-request-log-files.update', $roomMaintenanceRequestLogFile), [
            'room_maintenance_request_log_id' => $room_maintenance_request_log->id,
        ]);

        $roomMaintenanceRequestLogFile->refresh();

        $response->assertRedirect(route('roomMaintenanceRequestLogFiles.index'));
        $response->assertSessionHas('roomMaintenanceRequestLogFile.id', $roomMaintenanceRequestLogFile->id);

        $this->assertEquals($room_maintenance_request_log->id, $roomMaintenanceRequestLogFile->room_maintenance_request_log_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $roomMaintenanceRequestLogFile = RoomMaintenanceRequestLogFile::factory()->create();

        $response = $this->delete(route('room-maintenance-request-log-files.destroy', $roomMaintenanceRequestLogFile));

        $response->assertRedirect(route('roomMaintenanceRequestLogFiles.index'));

        $this->assertModelMissing($roomMaintenanceRequestLogFile);
    }
}
