<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EventDocumentController;
use App\Http\Requests\EventDocumentStoreRequest;
use App\Http\Requests\EventDocumentUpdateRequest;
use App\Models\Employee;
use App\Models\Event;
use App\Models\EventDocument;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EventDocumentController
 */
final class EventDocumentControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $eventDocuments = EventDocument::factory()->count(3)->create();

        $response = $this->get(route('event-documents.index'));

        $response->assertOk();
        $response->assertViewIs('eventDocument.index');
        $response->assertViewHas('eventDocuments', $eventDocuments);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('event-documents.create'));

        $response->assertOk();
        $response->assertViewIs('eventDocument.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EventDocumentController::class,
            'store',
            EventDocumentStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $event = Event::factory()->create();
        $title = fake()->sentence(4);
        $document_type = fake()->randomElement(['report', 'photo', 'proposal', 'minutes', 'attendance', 'other']);
        $file_path = fake()->word();
        $uploaded_by = Employee::factory()->create();
        $uploaded_at = Carbon::parse(fake()->dateTime());
        $u = Employee::factory()->create();

        $response = $this->post(route('event-documents.store'), [
            'event_id' => $event->id,
            'title' => $title,
            'document_type' => $document_type,
            'file_path' => $file_path,
            'uploaded_by' => $uploaded_by->id,
            'uploaded_at' => $uploaded_at->toDateTimeString(),
            'u_id' => $u->id,
        ]);

        $eventDocuments = EventDocument::query()
            ->where('event_id', $event->id)
            ->where('title', $title)
            ->where('document_type', $document_type)
            ->where('file_path', $file_path)
            ->where('uploaded_by', $uploaded_by->id)
            ->where('uploaded_at', $uploaded_at)
            ->where('u_id', $u->id)
            ->get();
        $this->assertCount(1, $eventDocuments);
        $eventDocument = $eventDocuments->first();

        $response->assertRedirect(route('event-documents.index'));
        $response->assertSessionHas('eventDocument.id', $eventDocument->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $eventDocument = EventDocument::factory()->create();

        $response = $this->get(route('event-documents.show', $eventDocument));

        $response->assertOk();
        $response->assertViewIs('eventDocument.show');
        $response->assertViewHas('eventDocument', $eventDocument);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $eventDocument = EventDocument::factory()->create();

        $response = $this->get(route('event-documents.edit', $eventDocument));

        $response->assertOk();
        $response->assertViewIs('eventDocument.edit');
        $response->assertViewHas('eventDocument', $eventDocument);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EventDocumentController::class,
            'update',
            EventDocumentUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $eventDocument = EventDocument::factory()->create();
        $event = Event::factory()->create();
        $title = fake()->sentence(4);
        $document_type = fake()->randomElement(['report', 'photo', 'proposal', 'minutes', 'attendance', 'other']);
        $file_path = fake()->word();
        $uploaded_by = Employee::factory()->create();
        $uploaded_at = Carbon::parse(fake()->dateTime());
        $u = Employee::factory()->create();

        $response = $this->put(route('event-documents.update', $eventDocument), [
            'event_id' => $event->id,
            'title' => $title,
            'document_type' => $document_type,
            'file_path' => $file_path,
            'uploaded_by' => $uploaded_by->id,
            'uploaded_at' => $uploaded_at->toDateTimeString(),
            'u_id' => $u->id,
        ]);

        $eventDocument->refresh();

        $response->assertRedirect(route('event-documents.index'));
        $response->assertSessionHas('eventDocument.id', $eventDocument->id);

        $this->assertEquals($event->id, $eventDocument->event_id);
        $this->assertEquals($title, $eventDocument->title);
        $this->assertEquals($document_type, $eventDocument->document_type);
        $this->assertEquals($file_path, $eventDocument->file_path);
        $this->assertEquals($uploaded_by->id, $eventDocument->uploaded_by);
        $this->assertEquals($uploaded_at->timestamp, $eventDocument->uploaded_at);
        $this->assertEquals($u->id, $eventDocument->u_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $eventDocument = EventDocument::factory()->create();

        $response = $this->delete(route('event-documents.destroy', $eventDocument));

        $response->assertRedirect(route('event-documents.index'));

        $this->assertModelMissing($eventDocument);
    }
}
