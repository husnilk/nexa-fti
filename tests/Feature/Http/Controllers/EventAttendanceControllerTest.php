<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EventAttendanceController;
use App\Http\Requests\EventAttendanceStoreRequest;
use App\Http\Requests\EventAttendanceUpdateRequest;
use App\Models\Employee;
use App\Models\Event;
use App\Models\EventAttendance;
use App\Models\EventRegistration;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EventAttendanceController
 */
final class EventAttendanceControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $eventAttendances = EventAttendance::factory()->count(3)->create();

        $response = $this->get(route('event-attendances.index'));

        $response->assertOk();
        $response->assertViewIs('eventAttendance.index');
        $response->assertViewHas('eventAttendances', $eventAttendances);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('event-attendances.create'));

        $response->assertOk();
        $response->assertViewIs('eventAttendance.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EventAttendanceController::class,
            'store',
            EventAttendanceStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $event_registration = EventRegistration::factory()->create();
        $attendance_method = fake()->randomElement(['manual', 'qr_scan', 'system']);
        $status = fake()->randomElement(['present', 'absent', 'partial']);
        $event = Event::factory()->create();
        $checked_by = Employee::factory()->create();

        $response = $this->post(route('event-attendances.store'), [
            'event_registration_id' => $event_registration->id,
            'attendance_method' => $attendance_method,
            'status' => $status,
            'event_id' => $event->id,
            'checked_by_id' => $checked_by->id,
        ]);

        $eventAttendances = EventAttendance::query()
            ->where('event_registration_id', $event_registration->id)
            ->where('attendance_method', $attendance_method)
            ->where('status', $status)
            ->where('event_id', $event->id)
            ->where('checked_by_id', $checked_by->id)
            ->get();
        $this->assertCount(1, $eventAttendances);
        $eventAttendance = $eventAttendances->first();

        $response->assertRedirect(route('event-attendances.index'));
        $response->assertSessionHas('eventAttendance.id', $eventAttendance->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $eventAttendance = EventAttendance::factory()->create();

        $response = $this->get(route('event-attendances.show', $eventAttendance));

        $response->assertOk();
        $response->assertViewIs('eventAttendance.show');
        $response->assertViewHas('eventAttendance', $eventAttendance);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $eventAttendance = EventAttendance::factory()->create();

        $response = $this->get(route('event-attendances.edit', $eventAttendance));

        $response->assertOk();
        $response->assertViewIs('eventAttendance.edit');
        $response->assertViewHas('eventAttendance', $eventAttendance);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EventAttendanceController::class,
            'update',
            EventAttendanceUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $eventAttendance = EventAttendance::factory()->create();
        $event_registration = EventRegistration::factory()->create();
        $attendance_method = fake()->randomElement(['manual', 'qr_scan', 'system']);
        $status = fake()->randomElement(['present', 'absent', 'partial']);
        $event = Event::factory()->create();
        $checked_by = Employee::factory()->create();

        $response = $this->put(route('event-attendances.update', $eventAttendance), [
            'event_registration_id' => $event_registration->id,
            'attendance_method' => $attendance_method,
            'status' => $status,
            'event_id' => $event->id,
            'checked_by_id' => $checked_by->id,
        ]);

        $eventAttendance->refresh();

        $response->assertRedirect(route('event-attendances.index'));
        $response->assertSessionHas('eventAttendance.id', $eventAttendance->id);

        $this->assertEquals($event_registration->id, $eventAttendance->event_registration_id);
        $this->assertEquals($attendance_method, $eventAttendance->attendance_method);
        $this->assertEquals($status, $eventAttendance->status);
        $this->assertEquals($event->id, $eventAttendance->event_id);
        $this->assertEquals($checked_by->id, $eventAttendance->checked_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $eventAttendance = EventAttendance::factory()->create();

        $response = $this->delete(route('event-attendances.destroy', $eventAttendance));

        $response->assertRedirect(route('event-attendances.index'));

        $this->assertModelMissing($eventAttendance);
    }
}
