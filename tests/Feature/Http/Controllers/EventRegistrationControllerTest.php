<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EventRegistrationController;
use App\Http\Requests\EventRegistrationStoreRequest;
use App\Http\Requests\EventRegistrationUpdateRequest;
use App\Models\Event;
use App\Models\EventRegistration;
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
 * @see EventRegistrationController
 */
final class EventRegistrationControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        Permission::findOrCreate('event.manage', 'web');
        $this->user->givePermissionTo('event.manage');
    }

    #[Test]
    public function index_displays_view(): void
    {
        $eventRegistrations = EventRegistration::factory()->count(3)->create();

        $response = $this->actingAs($this->user)->get(route('event-registrations.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('event-registrations/index'));
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->actingAs($this->user)->get(route('event-registrations.create'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('event-registrations/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EventRegistrationController::class,
            'store',
            EventRegistrationStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $event = Event::factory()->create();
        $user = User::factory()->create();
        $registration_number = fake()->word();
        $registered_at = Carbon::parse(fake()->dateTime());
        $attendance_status = fake()->randomElement(['registered', 'attended', 'no_show', 'cancelled']);
        $ticket_number = fake()->word();
        $issued_at = Carbon::parse(fake()->dateTime());
        $certificate_number = fake()->word();

        $response = $this->actingAs($this->user)->post(route('event-registrations.store'), [
            'event_id' => $event->id,
            'user_id' => $user->id,
            'registration_number' => $registration_number,
            'registered_at' => $registered_at->toDateTimeString(),
            'attendance_status' => $attendance_status,
            'ticket_number' => $ticket_number,
            'issued_at' => $issued_at->toDateTimeString(),
            'certificate_number' => $certificate_number,
        ]);

        $eventRegistrations = EventRegistration::query()
            ->where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->where('registration_number', $registration_number)
            ->where('registered_at', $registered_at)
            ->where('attendance_status', $attendance_status)
            ->where('ticket_number', $ticket_number)
            ->where('issued_at', $issued_at)
            ->where('certificate_number', $certificate_number)
            ->get();
        $this->assertCount(1, $eventRegistrations);
        $eventRegistration = $eventRegistrations->first();

        $response->assertRedirect(route('event-registrations.index', ['event_id' => $event->id]));
    }

    #[Test]
    public function show_displays_view(): void
    {
        $eventRegistration = EventRegistration::factory()->create();

        $response = $this->actingAs($this->user)->get(route('event-registrations.show', $eventRegistration));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('event-registrations/show'));
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $eventRegistration = EventRegistration::factory()->create();

        $response = $this->actingAs($this->user)->get(route('event-registrations.edit', $eventRegistration));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('event-registrations/edit'));
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EventRegistrationController::class,
            'update',
            EventRegistrationUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $eventRegistration = EventRegistration::factory()->create();
        $event = Event::factory()->create();
        $user = User::factory()->create();
        $registration_number = fake()->word();
        $registered_at = Carbon::parse(fake()->dateTime());
        $attendance_status = fake()->randomElement(['registered', 'attended', 'no_show', 'cancelled']);
        $ticket_number = fake()->word();
        $issued_at = Carbon::parse(fake()->dateTime());
        $certificate_number = fake()->word();

        $response = $this->actingAs($this->user)->put(route('event-registrations.update', $eventRegistration), [
            'event_id' => $event->id,
            'user_id' => $user->id,
            'registration_number' => $registration_number,
            'registered_at' => $registered_at->toDateTimeString(),
            'attendance_status' => $attendance_status,
            'ticket_number' => $ticket_number,
            'issued_at' => $issued_at->toDateTimeString(),
            'certificate_number' => $certificate_number,
        ]);

        $eventRegistration->refresh();

        $response->assertRedirect(route('event-registrations.index', ['event_id' => $event->id]));

        $this->assertEquals($event->id, $eventRegistration->event_id);
        $this->assertEquals($user->id, $eventRegistration->user_id);
        $this->assertEquals($registration_number, $eventRegistration->registration_number);
        $this->assertEquals($registered_at->timestamp, $eventRegistration->registered_at);
        $this->assertEquals($attendance_status, $eventRegistration->attendance_status);
        $this->assertEquals($ticket_number, $eventRegistration->ticket_number);
        $this->assertEquals($issued_at->timestamp, $eventRegistration->issued_at);
        $this->assertEquals($certificate_number, $eventRegistration->certificate_number);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $eventRegistration = EventRegistration::factory()->create();

        $response = $this->actingAs($this->user)->delete(route('event-registrations.destroy', $eventRegistration));

        $response->assertRedirect(route('event-registrations.index', ['event_id' => $eventRegistration->event_id]));

        $this->assertModelMissing($eventRegistration);
    }
}
