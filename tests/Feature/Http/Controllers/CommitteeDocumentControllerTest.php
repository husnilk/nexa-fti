<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\CommitteeDocumentController;
use App\Http\Requests\CommitteeDocumentStoreRequest;
use App\Http\Requests\CommitteeDocumentUpdateRequest;
use App\Models\Committee;
use App\Models\CommitteeDocument;
use App\Models\Employee;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see CommitteeDocumentController
 */
final class CommitteeDocumentControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        Permission::findOrCreate('committee.view', 'web');
        Permission::findOrCreate('committee.manage', 'web');
        $this->user->givePermissionTo(['committee.view', 'committee.manage']);
        $this->actingAs($this->user);
    }

    #[Test]
    public function index_displays_view(): void
    {
        $committeeDocuments = CommitteeDocument::factory()->count(3)->create();

        $response = $this->get(route('committee-documents.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/documents/index'));

    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('committee-documents.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/documents/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommitteeDocumentController::class,
            'store',
            CommitteeDocumentStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $committee = Committee::factory()->create();
        $title = fake()->sentence(4);
        $document_type = fake()->randomElement(['proposal', 'tor', 'budget', 'report', 'photo', 'certificate', 'other']);
        $file_path = fake()->word();
        $uploaded_at = Carbon::parse(fake()->dateTime());
        $uploaded_by = Employee::factory()->create();

        $response = $this->post(route('committee-documents.store'), [
            'committee_id' => $committee->id,
            'title' => $title,
            'document_type' => $document_type,
            'file_path' => $file_path,
            'uploaded_by' => $uploaded_by->id,
            'uploaded_at' => $uploaded_at->toDateTimeString(),
            'uploaded_by_id' => $uploaded_by->id,
        ]);

        $committeeDocuments = CommitteeDocument::query()
            ->where('committee_id', $committee->id)
            ->where('title', $title)
            ->where('document_type', $document_type)
            ->where('file_path', $file_path)
            ->where('uploaded_by', $uploaded_by->id)
            ->where('uploaded_at', $uploaded_at)
            ->where('uploaded_by_id', $uploaded_by->id)
            ->get();
        $this->assertCount(1, $committeeDocuments);
        $committeeDocument = $committeeDocuments->first();

        $response->assertRedirect(route('committee-documents.index'));
        $response->assertSessionHas('committeeDocument.id', $committeeDocument->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $committeeDocument = CommitteeDocument::factory()->create();

        $response = $this->get(route('committee-documents.show', $committeeDocument));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/documents/show'));

    }

    #[Test]
    public function edit_displays_view(): void
    {
        $committeeDocument = CommitteeDocument::factory()->create();

        $response = $this->get(route('committee-documents.edit', $committeeDocument));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/documents/edit'));

    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommitteeDocumentController::class,
            'update',
            CommitteeDocumentUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $committeeDocument = CommitteeDocument::factory()->create();
        $committee = Committee::factory()->create();
        $title = fake()->sentence(4);
        $document_type = fake()->randomElement(['proposal', 'tor', 'budget', 'report', 'photo', 'certificate', 'other']);
        $file_path = fake()->word();
        $uploaded_at = Carbon::parse(fake()->dateTime());
        $uploaded_by = Employee::factory()->create();

        $response = $this->put(route('committee-documents.update', $committeeDocument), [
            'committee_id' => $committee->id,
            'title' => $title,
            'document_type' => $document_type,
            'file_path' => $file_path,
            'uploaded_by' => $uploaded_by->id,
            'uploaded_at' => $uploaded_at->toDateTimeString(),
            'uploaded_by_id' => $uploaded_by->id,
        ]);

        $committeeDocument->refresh();

        $response->assertRedirect(route('committee-documents.index'));
        $response->assertSessionHas('committeeDocument.id', $committeeDocument->id);

        $this->assertEquals($committee->id, $committeeDocument->committee_id);
        $this->assertEquals($title, $committeeDocument->title);
        $this->assertEquals($document_type, $committeeDocument->document_type);
        $this->assertEquals($file_path, $committeeDocument->file_path);
        $this->assertEquals($uploaded_by->id, $committeeDocument->uploaded_by);
        $this->assertEquals($uploaded_at->timestamp, $committeeDocument->uploaded_at);
        $this->assertEquals($uploaded_by->id, $committeeDocument->uploaded_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $committeeDocument = CommitteeDocument::factory()->create();

        $response = $this->delete(route('committee-documents.destroy', $committeeDocument));

        $response->assertRedirect(route('committee-documents.index'));

        $this->assertModelMissing($committeeDocument);
    }
}
