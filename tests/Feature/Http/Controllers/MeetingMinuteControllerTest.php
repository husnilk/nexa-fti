<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\MeetingMinuteController;
use App\Http\Requests\MeetingMinuteStoreRequest;
use App\Http\Requests\MeetingMinuteUpdateRequest;
use App\Models\Employee;
use App\Models\Meeting;
use App\Models\MeetingMinute;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Inertia\Testing\AssertableInertia as Assert;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see MeetingMinuteController
 */
final class MeetingMinuteControllerTest extends TestCase
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
        $meetingMinutes = MeetingMinute::factory()->count(3)->create();

        $response = $this->get(route('meeting-minutes.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/minutes/index'));

    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('meeting-minutes.create'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/minutes/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            MeetingMinuteController::class,
            'store',
            MeetingMinuteStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $meeting = Meeting::factory()->create();
        $version = fake()->numberBetween(-10000, 10000);
        $summary = fake()->text();
        $is_final = fake()->boolean();
        $prepared_by = Employee::factory()->create();
        $approved_by = Employee::factory()->create();

        $response = $this->post(route('meeting-minutes.store'), [
            'meeting_id' => $meeting->id,
            'version' => $version,
            'summary' => $summary,
            'is_final' => $is_final,
            'prepared_by_id' => $prepared_by->id,
            'approved_by_id' => $approved_by->id,
        ]);

        $meetingMinutes = MeetingMinute::query()->where('summary', $summary)->get();
        $this->assertCount(1, $meetingMinutes);
        $meetingMinute = $meetingMinutes->first();

        $response->assertRedirect(route('meeting-minutes.index'));
        $response->assertSessionHas('meetingMinute.id', $meetingMinute->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $meetingMinute = MeetingMinute::factory()->create();

        $response = $this->get(route('meeting-minutes.show', $meetingMinute));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/minutes/show'));

    }

    #[Test]
    public function edit_displays_view(): void
    {
        $meetingMinute = MeetingMinute::factory()->create();

        $response = $this->get(route('meeting-minutes.edit', $meetingMinute));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/minutes/edit'));

    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            MeetingMinuteController::class,
            'update',
            MeetingMinuteUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $meetingMinute = MeetingMinute::factory()->create();
        $meeting = Meeting::factory()->create();
        $version = fake()->numberBetween(-10000, 10000);
        $summary = fake()->text();
        $is_final = fake()->boolean();
        $prepared_by = Employee::factory()->create();
        $approved_by = Employee::factory()->create();

        $response = $this->put(route('meeting-minutes.update', $meetingMinute), [
            'meeting_id' => $meeting->id,
            'version' => $version,
            'summary' => $summary,
            'is_final' => $is_final,
            'prepared_by_id' => $prepared_by->id,
            'approved_by_id' => $approved_by->id,
        ]);

        $meetingMinute->refresh();

        $response->assertRedirect(route('meeting-minutes.index'));
        $response->assertSessionHas('meetingMinute.id', $meetingMinute->id);

        $this->assertEquals($meeting->id, $meetingMinute->meeting_id);
        $this->assertEquals($version, $meetingMinute->version);
        $this->assertEquals($summary, $meetingMinute->summary);
        $this->assertEquals($is_final, $meetingMinute->is_final);
        $this->assertEquals($prepared_by->id, $meetingMinute->prepared_by_id);
        $this->assertEquals($approved_by->id, $meetingMinute->approved_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $meetingMinute = MeetingMinute::factory()->create();

        $response = $this->delete(route('meeting-minutes.destroy', $meetingMinute));

        $response->assertRedirect(route('meeting-minutes.index'));

        $this->assertModelMissing($meetingMinute);
    }
}
