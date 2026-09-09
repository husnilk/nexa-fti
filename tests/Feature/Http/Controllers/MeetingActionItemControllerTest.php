<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\MeetingActionItemController;
use App\Http\Requests\MeetingActionItemStoreRequest;
use App\Http\Requests\MeetingActionItemUpdateRequest;
use App\Models\Employee;
use App\Models\Meeting;
use App\Models\MeetingActionItem;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Inertia\Testing\AssertableInertia as Assert;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see MeetingActionItemController
 */
final class MeetingActionItemControllerTest extends TestCase
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
        $meetingActionItems = MeetingActionItem::factory()->count(3)->create();

        $response = $this->get(route('meeting-action-items.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/action-items/index'));

    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('meeting-action-items.create'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/action-items/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            MeetingActionItemController::class,
            'store',
            MeetingActionItemStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $meeting = Meeting::factory()->create();
        $title = fake()->sentence(4);
        $status = fake()->randomElement(['open', 'in_progress', 'completed', 'cancelled']);
        $assigned_to = Employee::factory()->create();

        $response = $this->post(route('meeting-action-items.store'), [
            'meeting_id' => $meeting->id,
            'title' => $title,
            'status' => $status,
            'assigned_to_id' => $assigned_to->id,
        ]);

        $meetingActionItems = MeetingActionItem::query()->where('title', $title)->get();
        $this->assertCount(1, $meetingActionItems);
        $meetingActionItem = $meetingActionItems->first();

        $response->assertRedirect(route('meeting-action-items.index'));
        $response->assertSessionHas('meetingActionItem.id', $meetingActionItem->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $meetingActionItem = MeetingActionItem::factory()->create();

        $response = $this->get(route('meeting-action-items.show', $meetingActionItem));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/action-items/show'));

    }

    #[Test]
    public function edit_displays_view(): void
    {
        $meetingActionItem = MeetingActionItem::factory()->create();

        $response = $this->get(route('meeting-action-items.edit', $meetingActionItem));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/action-items/edit'));

    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            MeetingActionItemController::class,
            'update',
            MeetingActionItemUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $meetingActionItem = MeetingActionItem::factory()->create();
        $meeting = Meeting::factory()->create();
        $title = fake()->sentence(4);
        $status = fake()->randomElement(['open', 'in_progress', 'completed', 'cancelled']);
        $assigned_to = Employee::factory()->create();

        $response = $this->put(route('meeting-action-items.update', $meetingActionItem), [
            'meeting_id' => $meeting->id,
            'title' => $title,
            'status' => $status,
            'assigned_to_id' => $assigned_to->id,
        ]);

        $meetingActionItem->refresh();

        $response->assertRedirect(route('meeting-action-items.index'));
        $response->assertSessionHas('meetingActionItem.id', $meetingActionItem->id);

        $this->assertEquals($meeting->id, $meetingActionItem->meeting_id);
        $this->assertEquals($title, $meetingActionItem->title);
        $this->assertEquals($status, $meetingActionItem->status);
        $this->assertEquals($assigned_to->id, $meetingActionItem->assigned_to_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $meetingActionItem = MeetingActionItem::factory()->create();

        $response = $this->delete(route('meeting-action-items.destroy', $meetingActionItem));

        $response->assertRedirect(route('meeting-action-items.index'));

        $this->assertModelMissing($meetingActionItem);
    }
}
