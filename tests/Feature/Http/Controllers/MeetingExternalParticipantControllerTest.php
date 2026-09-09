<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\MeetingExternalParticipantController;
use App\Http\Requests\MeetingExternalParticipantStoreRequest;
use App\Http\Requests\MeetingExternalParticipantUpdateRequest;
use App\Models\Meeting;
use App\Models\MeetingExternalParticipant;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Inertia\Testing\AssertableInertia as Assert;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see MeetingExternalParticipantController
 */
final class MeetingExternalParticipantControllerTest extends TestCase
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
        $meetingExternalParticipants = MeetingExternalParticipant::factory()->count(3)->create();

        $response = $this->get(route('meeting-external-participants.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/external-participants/index'));

    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('meeting-external-participants.create'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/external-participants/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            MeetingExternalParticipantController::class,
            'store',
            MeetingExternalParticipantStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $meeting = Meeting::factory()->create();
        $name = fake()->name();
        $role = fake()->randomElement(['participant', 'speaker', 'guest']);
        $attendance_status = fake()->randomElement(['invited', 'attended', 'absent']);
        $attendance_method = fake()->randomElement(['manual', 'qr_scan']);

        $response = $this->post(route('meeting-external-participants.store'), [
            'meeting_id' => $meeting->id,
            'name' => $name,
            'role' => $role,
            'attendance_status' => $attendance_status,
            'attendance_method' => $attendance_method,
        ]);

        $meetingExternalParticipants = MeetingExternalParticipant::query()->where('name', $name)->get();
        $this->assertCount(1, $meetingExternalParticipants);
        $meetingExternalParticipant = $meetingExternalParticipants->first();

        $response->assertRedirect(route('meeting-external-participants.index'));
        $response->assertSessionHas('meetingExternalParticipant.id', $meetingExternalParticipant->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $meetingExternalParticipant = MeetingExternalParticipant::factory()->create();

        $response = $this->get(route('meeting-external-participants.show', $meetingExternalParticipant));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/external-participants/show'));

    }

    #[Test]
    public function edit_displays_view(): void
    {
        $meetingExternalParticipant = MeetingExternalParticipant::factory()->create();

        $response = $this->get(route('meeting-external-participants.edit', $meetingExternalParticipant));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/external-participants/edit'));

    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            MeetingExternalParticipantController::class,
            'update',
            MeetingExternalParticipantUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $meetingExternalParticipant = MeetingExternalParticipant::factory()->create();
        $meeting = Meeting::factory()->create();
        $name = fake()->name();
        $role = fake()->randomElement(['participant', 'speaker', 'guest']);
        $attendance_status = fake()->randomElement(['invited', 'attended', 'absent']);
        $attendance_method = fake()->randomElement(['manual', 'qr_scan']);

        $response = $this->put(route('meeting-external-participants.update', $meetingExternalParticipant), [
            'meeting_id' => $meeting->id,
            'name' => $name,
            'role' => $role,
            'attendance_status' => $attendance_status,
            'attendance_method' => $attendance_method,
        ]);

        $meetingExternalParticipant->refresh();

        $response->assertRedirect(route('meeting-external-participants.index'));
        $response->assertSessionHas('meetingExternalParticipant.id', $meetingExternalParticipant->id);

        $this->assertEquals($meeting->id, $meetingExternalParticipant->meeting_id);
        $this->assertEquals($name, $meetingExternalParticipant->name);
        $this->assertEquals($role, $meetingExternalParticipant->role);
        $this->assertEquals($attendance_status, $meetingExternalParticipant->attendance_status);
        $this->assertEquals($attendance_method, $meetingExternalParticipant->attendance_method);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $meetingExternalParticipant = MeetingExternalParticipant::factory()->create();

        $response = $this->delete(route('meeting-external-participants.destroy', $meetingExternalParticipant));

        $response->assertRedirect(route('meeting-external-participants.index'));

        $this->assertModelMissing($meetingExternalParticipant);
    }
}
