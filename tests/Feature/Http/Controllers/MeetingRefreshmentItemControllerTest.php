<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\MeetingRefreshmentItemController;
use App\Http\Requests\MeetingRefreshmentItemStoreRequest;
use App\Http\Requests\MeetingRefreshmentItemUpdateRequest;
use App\Models\MeetingRefreshmentItem;
use App\Models\MeetingRefreshmentRequest;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Inertia\Testing\AssertableInertia as Assert;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see MeetingRefreshmentItemController
 */
final class MeetingRefreshmentItemControllerTest extends TestCase
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
        $meetingRefreshmentItems = MeetingRefreshmentItem::factory()->count(3)->create();

        $response = $this->get(route('meeting-refreshment-items.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/refreshment-items/index'));

    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('meeting-refreshment-items.create'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/refreshment-items/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            MeetingRefreshmentItemController::class,
            'store',
            MeetingRefreshmentItemStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $meeting_refreshment_request = MeetingRefreshmentRequest::factory()->create();
        $item_name = fake()->word();
        $quantity = fake()->numberBetween(-10000, 10000);

        $response = $this->post(route('meeting-refreshment-items.store'), [
            'meeting_refreshment_request_id' => $meeting_refreshment_request->id,
            'item_name' => $item_name,
            'quantity' => $quantity,
        ]);

        $meetingRefreshmentItems = MeetingRefreshmentItem::query()->where('item_name', $item_name)->get();
        $this->assertCount(1, $meetingRefreshmentItems);
        $meetingRefreshmentItem = $meetingRefreshmentItems->first();

        $response->assertRedirect(route('meeting-refreshment-items.index'));
        $response->assertSessionHas('meetingRefreshmentItem.id', $meetingRefreshmentItem->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $meetingRefreshmentItem = MeetingRefreshmentItem::factory()->create();

        $response = $this->get(route('meeting-refreshment-items.show', $meetingRefreshmentItem));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/refreshment-items/show'));

    }

    #[Test]
    public function edit_displays_view(): void
    {
        $meetingRefreshmentItem = MeetingRefreshmentItem::factory()->create();

        $response = $this->get(route('meeting-refreshment-items.edit', $meetingRefreshmentItem));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/refreshment-items/edit'));

    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            MeetingRefreshmentItemController::class,
            'update',
            MeetingRefreshmentItemUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $meetingRefreshmentItem = MeetingRefreshmentItem::factory()->create();
        $meeting_refreshment_request = MeetingRefreshmentRequest::factory()->create();
        $item_name = fake()->word();
        $quantity = fake()->numberBetween(-10000, 10000);

        $response = $this->put(route('meeting-refreshment-items.update', $meetingRefreshmentItem), [
            'meeting_refreshment_request_id' => $meeting_refreshment_request->id,
            'item_name' => $item_name,
            'quantity' => $quantity,
        ]);

        $meetingRefreshmentItem->refresh();

        $response->assertRedirect(route('meeting-refreshment-items.index'));
        $response->assertSessionHas('meetingRefreshmentItem.id', $meetingRefreshmentItem->id);

        $this->assertEquals($meeting_refreshment_request->id, $meetingRefreshmentItem->meeting_refreshment_request_id);
        $this->assertEquals($item_name, $meetingRefreshmentItem->item_name);
        $this->assertEquals($quantity, $meetingRefreshmentItem->quantity);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $meetingRefreshmentItem = MeetingRefreshmentItem::factory()->create();

        $response = $this->delete(route('meeting-refreshment-items.destroy', $meetingRefreshmentItem));

        $response->assertRedirect(route('meeting-refreshment-items.index'));

        $this->assertModelMissing($meetingRefreshmentItem);
    }
}
