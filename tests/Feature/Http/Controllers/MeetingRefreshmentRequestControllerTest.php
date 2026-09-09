<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\MeetingRefreshmentRequestController;
use App\Http\Requests\MeetingRefreshmentRequestStoreRequest;
use App\Http\Requests\MeetingRefreshmentRequestUpdateRequest;
use App\Models\Employee;
use App\Models\Meeting;
use App\Models\MeetingRefreshmentRequest;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use Inertia\Testing\AssertableInertia as Assert;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see MeetingRefreshmentRequestController
 */
final class MeetingRefreshmentRequestControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        Permission::findOrCreate('meeting.view', 'web');
        Permission::findOrCreate('meeting.manage', 'web');
        $this->user->givePermissionTo(['meeting.view', 'meeting.manage']);
        $this->actingAs($this->user);
    }

    #[Test]
    public function index_displays_view(): void
    {
        $meetingRefreshmentRequests = MeetingRefreshmentRequest::factory()->count(3)->create();

        $response = $this->get(route('meeting-refreshment-requests.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/refreshment-requests/index'));

    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('meeting-refreshment-requests.create'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/refreshment-requests/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            MeetingRefreshmentRequestController::class,
            'store',
            MeetingRefreshmentRequestStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $meeting = Meeting::factory()->create();
        $request_date = Carbon::parse(fake()->date());
        $participant_count = fake()->numberBetween(-10000, 10000);
        $status = fake()->randomElement(['draft', 'pending', 'approved', 'rejected', 'fulfilled']);
        $requested_by = Employee::factory()->create();
        $approved_by = Employee::factory()->create();

        $response = $this->post(route('meeting-refreshment-requests.store'), [
            'meeting_id' => $meeting->id,
            'request_date' => $request_date->toDateString(),
            'participant_count' => $participant_count,
            'status' => $status,
            'requested_by_id' => $requested_by->id,
            'approved_by_id' => $approved_by->id,
        ]);

        $meetingRefreshmentRequests = MeetingRefreshmentRequest::query()->where('meeting_id', $meeting->id)->get();
        $this->assertCount(1, $meetingRefreshmentRequests);
        $meetingRefreshmentRequest = $meetingRefreshmentRequests->first();

        $response->assertRedirect(route('meeting-refreshment-requests.index'));
        $response->assertSessionHas('meetingRefreshmentRequest.id', $meetingRefreshmentRequest->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $meetingRefreshmentRequest = MeetingRefreshmentRequest::factory()->create();

        $response = $this->get(route('meeting-refreshment-requests.show', $meetingRefreshmentRequest));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/refreshment-requests/show'));

    }

    #[Test]
    public function edit_displays_view(): void
    {
        $meetingRefreshmentRequest = MeetingRefreshmentRequest::factory()->create();

        $response = $this->get(route('meeting-refreshment-requests.edit', $meetingRefreshmentRequest));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/refreshment-requests/edit'));

    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            MeetingRefreshmentRequestController::class,
            'update',
            MeetingRefreshmentRequestUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $meetingRefreshmentRequest = MeetingRefreshmentRequest::factory()->create();
        $meeting = Meeting::factory()->create();
        $request_date = Carbon::parse(fake()->date());
        $participant_count = fake()->numberBetween(-10000, 10000);
        $status = fake()->randomElement(['draft', 'pending', 'approved', 'rejected', 'fulfilled']);
        $requested_by = Employee::factory()->create();
        $approved_by = Employee::factory()->create();

        $response = $this->put(route('meeting-refreshment-requests.update', $meetingRefreshmentRequest), [
            'meeting_id' => $meeting->id,
            'request_date' => $request_date->toDateString(),
            'participant_count' => $participant_count,
            'status' => $status,
            'requested_by_id' => $requested_by->id,
            'approved_by_id' => $approved_by->id,
        ]);

        $meetingRefreshmentRequest->refresh();

        $response->assertRedirect(route('meeting-refreshment-requests.index'));
        $response->assertSessionHas('meetingRefreshmentRequest.id', $meetingRefreshmentRequest->id);

        $this->assertEquals($meeting->id, $meetingRefreshmentRequest->meeting_id);
        $this->assertEquals($request_date, $meetingRefreshmentRequest->request_date);
        $this->assertEquals($participant_count, $meetingRefreshmentRequest->participant_count);
        $this->assertEquals($status, $meetingRefreshmentRequest->status);
        $this->assertEquals($requested_by->id, $meetingRefreshmentRequest->requested_by_id);
        $this->assertEquals($approved_by->id, $meetingRefreshmentRequest->approved_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $meetingRefreshmentRequest = MeetingRefreshmentRequest::factory()->create();

        $response = $this->delete(route('meeting-refreshment-requests.destroy', $meetingRefreshmentRequest));

        $response->assertRedirect(route('meeting-refreshment-requests.index'));

        $this->assertModelMissing($meetingRefreshmentRequest);
    }
}
