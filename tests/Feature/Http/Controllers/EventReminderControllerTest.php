<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EventReminderController;
use App\Http\Requests\EventReminderStoreRequest;
use App\Http\Requests\EventReminderUpdateRequest;
use App\Models\Employee;
use App\Models\Event;
use App\Models\EventReminder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EventReminderController
 */
final class EventReminderControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $eventReminders = EventReminder::factory()->count(3)->create();

        $response = $this->get(route('event-reminders.index'));

        $response->assertOk();
        $response->assertViewIs('eventReminder.index');
        $response->assertViewHas('eventReminders', $eventReminders);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('event-reminders.create'));

        $response->assertOk();
        $response->assertViewIs('eventReminder.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EventReminderController::class,
            'store',
            EventReminderStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $event = Event::factory()->create();
        $channel = fake()->randomElement(['email', 'whatsapp', 'sms', 'system']);
        $message = fake()->text();
        $sent_at = Carbon::parse(fake()->dateTime());
        $sent_by = Employee::factory()->create();

        $response = $this->post(route('event-reminders.store'), [
            'event_id' => $event->id,
            'sent_by' => $sent_by->id,
            'channel' => $channel,
            'message' => $message,
            'sent_at' => $sent_at->toDateTimeString(),
            'sent_by_id' => $sent_by->id,
        ]);

        $eventReminders = EventReminder::query()
            ->where('event_id', $event->id)
            ->where('sent_by', $sent_by->id)
            ->where('channel', $channel)
            ->where('message', $message)
            ->where('sent_at', $sent_at)
            ->where('sent_by_id', $sent_by->id)
            ->get();
        $this->assertCount(1, $eventReminders);
        $eventReminder = $eventReminders->first();

        $response->assertRedirect(route('event-reminders.index'));
        $response->assertSessionHas('eventReminder.id', $eventReminder->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $eventReminder = EventReminder::factory()->create();

        $response = $this->get(route('event-reminders.show', $eventReminder));

        $response->assertOk();
        $response->assertViewIs('eventReminder.show');
        $response->assertViewHas('eventReminder', $eventReminder);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $eventReminder = EventReminder::factory()->create();

        $response = $this->get(route('event-reminders.edit', $eventReminder));

        $response->assertOk();
        $response->assertViewIs('eventReminder.edit');
        $response->assertViewHas('eventReminder', $eventReminder);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EventReminderController::class,
            'update',
            EventReminderUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $eventReminder = EventReminder::factory()->create();
        $event = Event::factory()->create();
        $channel = fake()->randomElement(['email', 'whatsapp', 'sms', 'system']);
        $message = fake()->text();
        $sent_at = Carbon::parse(fake()->dateTime());
        $sent_by = Employee::factory()->create();

        $response = $this->put(route('event-reminders.update', $eventReminder), [
            'event_id' => $event->id,
            'sent_by' => $sent_by->id,
            'channel' => $channel,
            'message' => $message,
            'sent_at' => $sent_at->toDateTimeString(),
            'sent_by_id' => $sent_by->id,
        ]);

        $eventReminder->refresh();

        $response->assertRedirect(route('event-reminders.index'));
        $response->assertSessionHas('eventReminder.id', $eventReminder->id);

        $this->assertEquals($event->id, $eventReminder->event_id);
        $this->assertEquals($sent_by->id, $eventReminder->sent_by);
        $this->assertEquals($channel, $eventReminder->channel);
        $this->assertEquals($message, $eventReminder->message);
        $this->assertEquals($sent_at->timestamp, $eventReminder->sent_at);
        $this->assertEquals($sent_by->id, $eventReminder->sent_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $eventReminder = EventReminder::factory()->create();

        $response = $this->delete(route('event-reminders.destroy', $eventReminder));

        $response->assertRedirect(route('event-reminders.index'));

        $this->assertModelMissing($eventReminder);
    }
}
