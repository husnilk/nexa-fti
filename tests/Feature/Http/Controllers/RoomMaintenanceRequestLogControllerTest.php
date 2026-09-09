<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\RoomMaintenanceRequestLogController;
use App\Http\Requests\RoomMaintenanceRequestLogControllerStoreRequest;
use App\Http\Requests\RoomMaintenanceRequestLogControllerUpdateRequest;
use App\Models\Employee;
use App\Models\LoggedBy;
use App\Models\RoomMaintenanceRequest;
use App\Models\RoomMaintenanceRequestLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see RoomMaintenanceRequestLogController
 */
final class RoomMaintenanceRequestLogControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $roomMaintenanceRequestLogs = RoomMaintenanceRequestLog::factory()->count(3)->create();

        $response = $this->get(route('room-maintenance-request-logs.index'));

        $response->assertOk();
        $response->assertViewIs('roomMaintenanceRequestLog.index');
        $response->assertViewHas('roomMaintenanceRequestLogs', $roomMaintenanceRequestLogs);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('room-maintenance-request-logs.create'));

        $response->assertOk();
        $response->assertViewIs('roomMaintenanceRequestLog.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            RoomMaintenanceRequestLogController::class,
            'store',
            RoomMaintenanceRequestLogControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $room_maintenance_request = RoomMaintenanceRequest::factory()->create();
        $log = fake()->text();
        $logged_by = LoggedBy::factory()->create();
        $logged_at = Carbon::parse(fake()->dateTime());
        $status = fake()->randomElement(/** enum_attributes **/);
        $logged_by = Employee::factory()->create();
        $verified_by = Employee::factory()->create();

        $response = $this->post(route('room-maintenance-request-logs.store'), [
            'room_maintenance_request_id' => $room_maintenance_request->id,
            'log' => $log,
            'logged_by' => $logged_by->id,
            'logged_at' => $logged_at->toDateTimeString(),
            'status' => $status,
            'logged_by_id' => $logged_by->id,
            'verified_by_id' => $verified_by->id,
        ]);

        $roomMaintenanceRequestLogs = RoomMaintenanceRequestLog::query()
            ->where('room_maintenance_request_id', $room_maintenance_request->id)
            ->where('log', $log)
            ->where('logged_by', $logged_by->id)
            ->where('logged_at', $logged_at)
            ->where('status', $status)
            ->where('logged_by_id', $logged_by->id)
            ->where('verified_by_id', $verified_by->id)
            ->get();
        $this->assertCount(1, $roomMaintenanceRequestLogs);
        $roomMaintenanceRequestLog = $roomMaintenanceRequestLogs->first();

        $response->assertRedirect(route('roomMaintenanceRequestLogs.index'));
        $response->assertSessionHas('roomMaintenanceRequestLog.id', $roomMaintenanceRequestLog->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $roomMaintenanceRequestLog = RoomMaintenanceRequestLog::factory()->create();

        $response = $this->get(route('room-maintenance-request-logs.show', $roomMaintenanceRequestLog));

        $response->assertOk();
        $response->assertViewIs('roomMaintenanceRequestLog.show');
        $response->assertViewHas('roomMaintenanceRequestLog', $roomMaintenanceRequestLog);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $roomMaintenanceRequestLog = RoomMaintenanceRequestLog::factory()->create();

        $response = $this->get(route('room-maintenance-request-logs.edit', $roomMaintenanceRequestLog));

        $response->assertOk();
        $response->assertViewIs('roomMaintenanceRequestLog.edit');
        $response->assertViewHas('roomMaintenanceRequestLog', $roomMaintenanceRequestLog);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            RoomMaintenanceRequestLogController::class,
            'update',
            RoomMaintenanceRequestLogControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $roomMaintenanceRequestLog = RoomMaintenanceRequestLog::factory()->create();
        $room_maintenance_request = RoomMaintenanceRequest::factory()->create();
        $log = fake()->text();
        $logged_by = LoggedBy::factory()->create();
        $logged_at = Carbon::parse(fake()->dateTime());
        $status = fake()->randomElement(/** enum_attributes **/);
        $logged_by = Employee::factory()->create();
        $verified_by = Employee::factory()->create();

        $response = $this->put(route('room-maintenance-request-logs.update', $roomMaintenanceRequestLog), [
            'room_maintenance_request_id' => $room_maintenance_request->id,
            'log' => $log,
            'logged_by' => $logged_by->id,
            'logged_at' => $logged_at->toDateTimeString(),
            'status' => $status,
            'logged_by_id' => $logged_by->id,
            'verified_by_id' => $verified_by->id,
        ]);

        $roomMaintenanceRequestLog->refresh();

        $response->assertRedirect(route('roomMaintenanceRequestLogs.index'));
        $response->assertSessionHas('roomMaintenanceRequestLog.id', $roomMaintenanceRequestLog->id);

        $this->assertEquals($room_maintenance_request->id, $roomMaintenanceRequestLog->room_maintenance_request_id);
        $this->assertEquals($log, $roomMaintenanceRequestLog->log);
        $this->assertEquals($logged_by->id, $roomMaintenanceRequestLog->logged_by);
        $this->assertEquals($logged_at->timestamp, $roomMaintenanceRequestLog->logged_at);
        $this->assertEquals($status, $roomMaintenanceRequestLog->status);
        $this->assertEquals($logged_by->id, $roomMaintenanceRequestLog->logged_by_id);
        $this->assertEquals($verified_by->id, $roomMaintenanceRequestLog->verified_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $roomMaintenanceRequestLog = RoomMaintenanceRequestLog::factory()->create();

        $response = $this->delete(route('room-maintenance-request-logs.destroy', $roomMaintenanceRequestLog));

        $response->assertRedirect(route('roomMaintenanceRequestLogs.index'));

        $this->assertModelMissing($roomMaintenanceRequestLog);
    }
}
