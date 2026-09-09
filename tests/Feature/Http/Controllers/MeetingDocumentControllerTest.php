<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\MeetingDocumentController;
use App\Http\Requests\MeetingDocumentStoreRequest;
use App\Http\Requests\MeetingDocumentUpdateRequest;
use App\Models\Employee;
use App\Models\Meeting;
use App\Models\MeetingDocument;
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
 * @see MeetingDocumentController
 */
final class MeetingDocumentControllerTest extends TestCase
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
        $meetingDocuments = MeetingDocument::factory()->count(3)->create();

        $response = $this->get(route('meeting-documents.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/documents/index'));

    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('meeting-documents.create'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/documents/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            MeetingDocumentController::class,
            'store',
            MeetingDocumentStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $meeting = Meeting::factory()->create();
        $title = fake()->sentence(4);
        $document_type = fake()->randomElement(['photo', 'minutes', 'presentation', 'recording', 'attendance', 'other']);
        $file_path = fake()->word();

        $uploaded_at = Carbon::parse(fake()->dateTime());
        $uploaded_by = Employee::factory()->create();

        $response = $this->post(route('meeting-documents.store'), [
            'meeting_id' => $meeting->id,
            'title' => $title,
            'document_type' => $document_type,
            'file_path' => $file_path,
            'uploaded_by' => $uploaded_by->id,
            'uploaded_at' => $uploaded_at->toDateTimeString(),
            'uploaded_by_id' => $uploaded_by->id,
        ]);

        $meetingDocuments = MeetingDocument::query()->where('title', $title)->get();
        $this->assertCount(1, $meetingDocuments);
        $meetingDocument = $meetingDocuments->first();

        $response->assertRedirect(route('meeting-documents.index'));
        $response->assertSessionHas('meetingDocument.id', $meetingDocument->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $meetingDocument = MeetingDocument::factory()->create();

        $response = $this->get(route('meeting-documents.show', $meetingDocument));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/documents/show'));

    }

    #[Test]
    public function edit_displays_view(): void
    {
        $meetingDocument = MeetingDocument::factory()->create();

        $response = $this->get(route('meeting-documents.edit', $meetingDocument));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('meetings/documents/edit'));

    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            MeetingDocumentController::class,
            'update',
            MeetingDocumentUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $meetingDocument = MeetingDocument::factory()->create();
        $meeting = Meeting::factory()->create();
        $title = fake()->sentence(4);
        $document_type = fake()->randomElement(['photo', 'minutes', 'presentation', 'recording', 'attendance', 'other']);
        $file_path = fake()->word();

        $uploaded_at = Carbon::parse(fake()->dateTime());
        $uploaded_by = Employee::factory()->create();

        $response = $this->put(route('meeting-documents.update', $meetingDocument), [
            'meeting_id' => $meeting->id,
            'title' => $title,
            'document_type' => $document_type,
            'file_path' => $file_path,
            'uploaded_by' => $uploaded_by->id,
            'uploaded_at' => $uploaded_at->toDateTimeString(),
            'uploaded_by_id' => $uploaded_by->id,
        ]);

        $meetingDocument->refresh();

        $response->assertRedirect(route('meeting-documents.index'));
        $response->assertSessionHas('meetingDocument.id', $meetingDocument->id);

        $this->assertEquals($meeting->id, $meetingDocument->meeting_id);
        $this->assertEquals($title, $meetingDocument->title);
        $this->assertEquals($document_type, $meetingDocument->document_type);
        $this->assertEquals($file_path, $meetingDocument->file_path);
        $this->assertEquals($uploaded_by->id, $meetingDocument->uploaded_by);
        $this->assertEquals($uploaded_at->timestamp, $meetingDocument->uploaded_at);
        $this->assertEquals($uploaded_by->id, $meetingDocument->uploaded_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $meetingDocument = MeetingDocument::factory()->create();

        $response = $this->delete(route('meeting-documents.destroy', $meetingDocument));

        $response->assertRedirect(route('meeting-documents.index'));

        $this->assertModelMissing($meetingDocument);
    }
}
