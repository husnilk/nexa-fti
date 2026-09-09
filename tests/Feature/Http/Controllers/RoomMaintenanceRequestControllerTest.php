<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\RoomMaintenanceRequestController;
use App\Http\Requests\RoomMaintenanceRequestControllerStoreRequest;
use App\Http\Requests\RoomMaintenanceRequestControllerUpdateRequest;
use App\Models\Employee;
use App\Models\ReportedBy;
use App\Models\Room;
use App\Models\RoomMaintenanceRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see RoomMaintenanceRequestController
 */
final class RoomMaintenanceRequestControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $roomMaintenanceRequests = RoomMaintenanceRequest::factory()->count(3)->create();

        $response = $this->get(route('room-maintenance-requests.index'));

        $response->assertOk();
        $response->assertViewIs('roomMaintenanceRequest.index');
        $response->assertViewHas('roomMaintenanceRequests', $roomMaintenanceRequests);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('room-maintenance-requests.create'));

        $response->assertOk();
        $response->assertViewIs('roomMaintenanceRequest.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            RoomMaintenanceRequestController::class,
            'store',
            RoomMaintenanceRequestControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $room = Room::factory()->create();
        $reported_by = ReportedBy::factory()->create();
        $issue_description = fake()->text();
        $status = fake()->randomElement(/** enum_attributes **/);
        $reported_at = Carbon::parse(fake()->dateTime());
        $reported_by = Employee::factory()->create();

        $response = $this->post(route('room-maintenance-requests.store'), [
            'room_id' => $room->id,
            'reported_by' => $reported_by->id,
            'issue_description' => $issue_description,
            'status' => $status,
            'reported_at' => $reported_at->toDateTimeString(),
            'reported_by_id' => $reported_by->id,
        ]);

        $roomMaintenanceRequests = RoomMaintenanceRequest::query()
            ->where('room_id', $room->id)
            ->where('reported_by', $reported_by->id)
            ->where('issue_description', $issue_description)
            ->where('status', $status)
            ->where('reported_at', $reported_at)
            ->where('reported_by_id', $reported_by->id)
            ->get();
        $this->assertCount(1, $roomMaintenanceRequests);
        $roomMaintenanceRequest = $roomMaintenanceRequests->first();

        $response->assertRedirect(route('roomMaintenanceRequests.index'));
        $response->assertSessionHas('roomMaintenanceRequest.id', $roomMaintenanceRequest->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $roomMaintenanceRequest = RoomMaintenanceRequest::factory()->create();

        $response = $this->get(route('room-maintenance-requests.show', $roomMaintenanceRequest));

        $response->assertOk();
        $response->assertViewIs('roomMaintenanceRequest.show');
        $response->assertViewHas('roomMaintenanceRequest', $roomMaintenanceRequest);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $roomMaintenanceRequest = RoomMaintenanceRequest::factory()->create();

        $response = $this->get(route('room-maintenance-requests.edit', $roomMaintenanceRequest));

        $response->assertOk();
        $response->assertViewIs('roomMaintenanceRequest.edit');
        $response->assertViewHas('roomMaintenanceRequest', $roomMaintenanceRequest);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            RoomMaintenanceRequestController::class,
            'update',
            RoomMaintenanceRequestControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $roomMaintenanceRequest = RoomMaintenanceRequest::factory()->create();
        $room = Room::factory()->create();
        $reported_by = ReportedBy::factory()->create();
        $issue_description = fake()->text();
        $status = fake()->randomElement(/** enum_attributes **/);
        $reported_at = Carbon::parse(fake()->dateTime());
        $reported_by = Employee::factory()->create();

        $response = $this->put(route('room-maintenance-requests.update', $roomMaintenanceRequest), [
            'room_id' => $room->id,
            'reported_by' => $reported_by->id,
            'issue_description' => $issue_description,
            'status' => $status,
            'reported_at' => $reported_at->toDateTimeString(),
            'reported_by_id' => $reported_by->id,
        ]);

        $roomMaintenanceRequest->refresh();

        $response->assertRedirect(route('roomMaintenanceRequests.index'));
        $response->assertSessionHas('roomMaintenanceRequest.id', $roomMaintenanceRequest->id);

        $this->assertEquals($room->id, $roomMaintenanceRequest->room_id);
        $this->assertEquals($reported_by->id, $roomMaintenanceRequest->reported_by);
        $this->assertEquals($issue_description, $roomMaintenanceRequest->issue_description);
        $this->assertEquals($status, $roomMaintenanceRequest->status);
        $this->assertEquals($reported_at->timestamp, $roomMaintenanceRequest->reported_at);
        $this->assertEquals($reported_by->id, $roomMaintenanceRequest->reported_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $roomMaintenanceRequest = RoomMaintenanceRequest::factory()->create();

        $response = $this->delete(route('room-maintenance-requests.destroy', $roomMaintenanceRequest));

        $response->assertRedirect(route('roomMaintenanceRequests.index'));

        $this->assertModelMissing($roomMaintenanceRequest);
    }
}
