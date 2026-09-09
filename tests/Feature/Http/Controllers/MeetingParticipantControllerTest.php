<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\MeetingParticipantController;
use App\Http\Requests\MeetingParticipantStoreRequest;
use App\Http\Requests\MeetingParticipantUpdateRequest;
use App\Models\Meeting;
use App\Models\MeetingParticipant;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Inertia\Testing\AssertableInertia as Assert;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see MeetingParticipantController
 */
final class MeetingParticipantControllerTest extends TestCase
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
        $meetingParticipants = MeetingParticipant::factory()->count(3)->create();

        $response = $this->get(route('meeting-participants.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/participants/index'));

    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('meeting-participants.create'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/participants/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            MeetingParticipantController::class,
            'store',
            MeetingParticipantStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $meeting = Meeting::factory()->create();
        $user = User::factory()->create();
        $role = fake()->randomElement(['participant', 'moderator', 'speaker', 'note_taker']);
        $attendance_status = fake()->randomElement(['invited', 'attended', 'absent']);
        $attendance_method = fake()->randomElement(['manual', 'qr_scan']);

        $response = $this->post(route('meeting-participants.store'), [
            'meeting_id' => $meeting->id,
            'user_id' => $user->id,
            'role' => $role,
            'attendance_status' => $attendance_status,
            'attendance_method' => $attendance_method,
        ]);

        $meetingParticipants = MeetingParticipant::query()->where('user_id', $user->id)->get();
        $this->assertCount(1, $meetingParticipants);
        $meetingParticipant = $meetingParticipants->first();

        $response->assertRedirect(route('meeting-participants.index'));
        $response->assertSessionHas('meetingParticipant.id', $meetingParticipant->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $meetingParticipant = MeetingParticipant::factory()->create();

        $response = $this->get(route('meeting-participants.show', $meetingParticipant));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/participants/show'));

    }

    #[Test]
    public function edit_displays_view(): void
    {
        $meetingParticipant = MeetingParticipant::factory()->create();

        $response = $this->get(route('meeting-participants.edit', $meetingParticipant));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/participants/edit'));

    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            MeetingParticipantController::class,
            'update',
            MeetingParticipantUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $meetingParticipant = MeetingParticipant::factory()->create();
        $meeting = Meeting::factory()->create();
        $user = User::factory()->create();
        $role = fake()->randomElement(['participant', 'moderator', 'speaker', 'note_taker']);
        $attendance_status = fake()->randomElement(['invited', 'attended', 'absent']);
        $attendance_method = fake()->randomElement(['manual', 'qr_scan']);

        $response = $this->put(route('meeting-participants.update', $meetingParticipant), [
            'meeting_id' => $meeting->id,
            'user_id' => $user->id,
            'role' => $role,
            'attendance_status' => $attendance_status,
            'attendance_method' => $attendance_method,
        ]);

        $meetingParticipant->refresh();

        $response->assertRedirect(route('meeting-participants.index'));
        $response->assertSessionHas('meetingParticipant.id', $meetingParticipant->id);

        $this->assertEquals($meeting->id, $meetingParticipant->meeting_id);
        $this->assertEquals($user->id, $meetingParticipant->user_id);
        $this->assertEquals($role, $meetingParticipant->role);
        $this->assertEquals($attendance_status, $meetingParticipant->attendance_status);
        $this->assertEquals($attendance_method, $meetingParticipant->attendance_method);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $meetingParticipant = MeetingParticipant::factory()->create();

        $response = $this->delete(route('meeting-participants.destroy', $meetingParticipant));

        $response->assertRedirect(route('meeting-participants.index'));

        $this->assertModelMissing($meetingParticipant);
    }
}
