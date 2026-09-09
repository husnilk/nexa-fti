<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EventController;
use App\Http\Requests\EventStoreRequest;
use App\Http\Requests\EventUpdateRequest;
use App\Models\Employee;
use App\Models\Event;
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
 * @see EventController
 */
final class EventControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        Permission::findOrCreate('event.view', 'web');
        Permission::findOrCreate('event.manage', 'web');
    }

    #[Test]
    public function index_displays_view(): void
    {
        $this->user->givePermissionTo('event.view');
        $events = Event::factory()->count(3)->create();

        $response = $this->actingAs($this->user)->get(route('events.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('events/index'));
    }

    #[Test]
    public function create_displays_view(): void
    {
        $this->user->givePermissionTo('event.view');
        $response = $this->actingAs($this->user)->get(route('events.create'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('events/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EventController::class,
            'store',
            EventStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $this->user->givePermissionTo('event.manage');
        $title = fake()->sentence(4);
        $slug = fake()->slug();
        $event_type = fake()->randomElement(['seminar', 'workshop', 'training', 'conference', 'webinar', 'other']);
        $delivery_mode = fake()->randomElement(['offline', 'online', 'hybrid']);
        $start_date = Carbon::parse(fake()->date());
        $end_date = Carbon::parse(fake()->date());
        $status = fake()->randomElement(['draft', 'published', 'ongoing', 'completed', 'cancelled']);
        $created_by = Employee::factory()->create();

        $response = $this->actingAs($this->user)->post(route('events.store'), [
            'title' => $title,
            'slug' => $slug,
            'event_type' => $event_type,
            'delivery_mode' => $delivery_mode,
            'start_date' => $start_date->toDateString(),
            'end_date' => $end_date->toDateString(),
            'status' => $status,
            'created_by' => $created_by->id,
            'created_by_id' => $created_by->id,
        ]);

        $response->assertSessionHasNoErrors();

        $events = Event::query()
            ->where('title', $title)
            ->where('slug', $slug)
            ->where('event_type', $event_type)
            ->where('delivery_mode', $delivery_mode)
            ->where('status', $status)
            ->where('created_by', $created_by->id)
            ->where('created_by_id', $created_by->id)
            ->get();
        $this->assertCount(1, $events);
        $event = $events->first();

        $response->assertRedirect(route('events.index'));
    }

    #[Test]
    public function show_displays_view(): void
    {
        $this->user->givePermissionTo('event.view');
        $event = Event::factory()->create();

        $response = $this->actingAs($this->user)->get(route('events.show', $event));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('events/show'));
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $this->user->givePermissionTo('event.view');
        $event = Event::factory()->create();

        $response = $this->actingAs($this->user)->get(route('events.edit', $event));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('events/edit'));
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EventController::class,
            'update',
            EventUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $this->user->givePermissionTo('event.manage');
        $event = Event::factory()->create();
        $title = fake()->sentence(4);
        $slug = fake()->slug();
        $event_type = fake()->randomElement(['seminar', 'workshop', 'training', 'conference', 'webinar', 'other']);
        $delivery_mode = fake()->randomElement(['offline', 'online', 'hybrid']);
        $start_date = Carbon::parse(fake()->date());
        $end_date = Carbon::parse(fake()->date());
        $status = fake()->randomElement(['draft', 'published', 'ongoing', 'completed', 'cancelled']);
        $created_by = Employee::factory()->create();

        $response = $this->actingAs($this->user)->put(route('events.update', $event), [
            'title' => $title,
            'slug' => $slug,
            'event_type' => $event_type,
            'delivery_mode' => $delivery_mode,
            'start_date' => $start_date->toDateString(),
            'end_date' => $end_date->toDateString(),
            'status' => $status,
            'created_by' => $created_by->id,
            'created_by_id' => $created_by->id,
        ]);

        $response->assertSessionHasNoErrors();
        $event->refresh();

        $response->assertRedirect(route('events.index'));

        $this->assertEquals($title, $event->title);
        $this->assertEquals($slug, $event->slug);
        $this->assertEquals($event_type, $event->event_type);
        $this->assertEquals($delivery_mode, $event->delivery_mode);
        $this->assertEquals($status, $event->status);
        $this->assertEquals($created_by->id, $event->created_by);
        $this->assertEquals($created_by->id, $event->created_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $this->user->givePermissionTo('event.manage');
        $event = Event::factory()->create();

        $response = $this->actingAs($this->user)->delete(route('events.destroy', $event));

        $response->assertRedirect(route('events.index'));

        $this->assertModelMissing($event);
    }

    #[Test]
    public function publish_publishes_event_and_redirects(): void
    {
        $this->user->givePermissionTo('event.manage');
        // We must also create an employee record for the authenticated user, as publishing links the published_by to the auth user's employee record.
        $employee = Employee::factory()->create(['id' => $this->user->id]);
        $event = Event::factory()->create(['status' => 'draft']);

        $response = $this->actingAs($this->user)->post(route('events.publish', $event));

        $event->refresh();

        $response->assertRedirect(route('events.index'));
        $this->assertEquals('published', $event->status);
        $this->assertEquals($employee->id, $event->published_by);
    }
}
