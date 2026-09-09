<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\MeetingController;
use App\Http\Requests\MeetingStoreRequest;
use App\Http\Requests\MeetingUpdateRequest;
use App\Models\Employee;
use App\Models\Meeting;
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
 * @see MeetingController
 */
final class MeetingControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        Permission::findOrCreate('meeting.view', 'web');
        Permission::findOrCreate('meeting.manage', 'web');
    }

    #[Test]
    public function index_displays_view(): void
    {
        $this->user->givePermissionTo('meeting.view');
        $meetings = Meeting::factory()->count(3)->create();

        $response = $this->actingAs($this->user)->get(route('meetings.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/index'));
    }

    #[Test]
    public function create_displays_view(): void
    {
        $this->user->givePermissionTo('meeting.view');
        $response = $this->actingAs($this->user)->get(route('meetings.create'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            MeetingController::class,
            'store',
            MeetingStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $this->user->givePermissionTo('meeting.manage');
        $title = fake()->sentence(4);
        $meeting_type = fake()->randomElement(['offline', 'online', 'hybrid']);
        $meeting_date = Carbon::parse(fake()->date());
        $start_time = fake()->time();
        $end_time = fake()->time();
        $status = fake()->randomElement(['draft', 'scheduled', 'completed', 'cancelled']);
        $is_confidential = fake()->boolean();
        $organizer_id = Employee::factory()->create();
        $chairman_id = Employee::factory()->create();

        $response = $this->actingAs($this->user)->post(route('meetings.store'), [
            'title' => $title,
            'meeting_type' => $meeting_type,
            'meeting_date' => $meeting_date->toDateString(),
            'start_time' => $start_time,
            'end_time' => $end_time,
            'status' => $status,
            'is_confidential' => $is_confidential,
            'organizer_id_id' => $organizer_id->id,
            'chairman_id_id' => $chairman_id->id,
        ]);

        $response->assertSessionHasNoErrors();

        $meetings = Meeting::query()
            ->where('title', $title)
            ->get();
        $this->assertCount(1, $meetings);
        $meeting = $meetings->first();

        $response->assertRedirect(route('meetings.index'));
        $response->assertSessionHas('meeting.id', $meeting->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $this->user->givePermissionTo('meeting.view');
        $meeting = Meeting::factory()->create();

        $response = $this->actingAs($this->user)->get(route('meetings.show', $meeting));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/show'));
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $this->user->givePermissionTo('meeting.view');
        $meeting = Meeting::factory()->create();

        $response = $this->actingAs($this->user)->get(route('meetings.edit', $meeting));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/edit'));
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            MeetingController::class,
            'update',
            MeetingUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $this->user->givePermissionTo('meeting.manage');
        $meeting = Meeting::factory()->create();
        $title = fake()->sentence(4);
        $meeting_type = fake()->randomElement(['offline', 'online', 'hybrid']);
        $meeting_date = Carbon::parse(fake()->date());
        $start_time = fake()->time();
        $end_time = fake()->time();
        $status = fake()->randomElement(['draft', 'scheduled', 'completed', 'cancelled']);
        $is_confidential = fake()->boolean();
        $organizer_id = Employee::factory()->create();
        $chairman_id = Employee::factory()->create();

        $response = $this->actingAs($this->user)->put(route('meetings.update', $meeting), [
            'title' => $title,
            'meeting_type' => $meeting_type,
            'meeting_date' => $meeting_date->toDateString(),
            'start_time' => $start_time,
            'end_time' => $end_time,
            'status' => $status,
            'is_confidential' => $is_confidential,
            'organizer_id_id' => $organizer_id->id,
            'chairman_id_id' => $chairman_id->id,
        ]);

        $meeting->refresh();

        $response->assertRedirect(route('meetings.index'));
        $response->assertSessionHas('meeting.id', $meeting->id);

        $this->assertEquals($title, $meeting->title);
        $this->assertEquals($meeting_type, $meeting->meeting_type);
        $this->assertEquals($meeting_date->toDateString(), $meeting->meeting_date->toDateString());
        $this->assertEquals($start_time, $meeting->start_time);
        $this->assertEquals($end_time, $meeting->end_time);
        $this->assertEquals($status, $meeting->status);
        $this->assertEquals($is_confidential, $meeting->is_confidential);
        $this->assertEquals($organizer_id->id, $meeting->organizer_id_id);
        $this->assertEquals($chairman_id->id, $meeting->chairman_id_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $this->user->givePermissionTo('meeting.manage');
        $meeting = Meeting::factory()->create();

        $response = $this->actingAs($this->user)->delete(route('meetings.destroy', $meeting));

        $response->assertRedirect(route('meetings.index'));

        $this->assertModelMissing($meeting);
    }
}
