<?php

use App\Models\Document;
use App\Models\DocumentType;
use App\Models\Employee;
use App\Models\Organization;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    Storage::fake('public');
    $this->user = User::factory()->create();
    Employee::factory()->create([
        'id' => $this->user->id,
        'email' => $this->user->email,
        'name' => $this->user->name,
    ]);
    Permission::findOrCreate('document.view', 'web');
    Permission::findOrCreate('document.manage', 'web');
    $this->user->givePermissionTo(['document.view', 'document.manage']);
});

test('index displays documents for authorized user with search & filters', function () {
    $type = DocumentType::factory()->create(['name' => 'SOP']);
    $otherType = DocumentType::factory()->create(['name' => 'Report']);

    $doc1 = Document::factory()->create([
        'title' => 'Academic Guidelines',
        'document_type_id' => $type->id,
        'publish_status' => 'published',
    ]);
    $doc2 = Document::factory()->create([
        'title' => 'Finance Report',
        'document_type_id' => $otherType->id,
        'publish_status' => 'draft',
    ]);

    // Test simple list
    $response = $this->actingAs($this->user)
        ->get(route('documents.index'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('documents/index')->has('documents', 2));

    // Test search filter
    $responseSearch = $this->actingAs($this->user)
        ->get(route('documents.index', ['search' => 'Academic']));
    $responseSearch->assertOk();
    $responseSearch->assertInertia(fn ($page) => $page->component('documents/index')->has('documents', 1));

    // Test status filter
    $responseStatus = $this->actingAs($this->user)
        ->get(route('documents.index', ['status' => 'draft']));
    $responseStatus->assertOk();
    $responseStatus->assertInertia(fn ($page) => $page->component('documents/index')->has('documents', 1));

    // Test type filter
    $responseType = $this->actingAs($this->user)
        ->get(route('documents.index', ['type' => $type->id]));
    $responseType->assertOk();
    $responseType->assertInertia(fn ($page) => $page->component('documents/index')->has('documents', 1));
});

test('create displays view for authorized user with types and organizations', function () {
    $type = DocumentType::factory()->create();
    $org = Organization::factory()->create();

    $response = $this->actingAs($this->user)
        ->get(route('documents.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('documents/create')
        ->has('documentTypes')
        ->has('organizations')
    );
});

test('store saves document and creates initial revision', function () {
    $type = DocumentType::factory()->create();
    $org = Organization::factory()->create();
    $file = UploadedFile::fake()->create('manual.pdf', 100);

    $title = 'Safety Procedures';
    $docNo = 'DOC-1234';

    $response = $this->actingAs($this->user)
        ->post(route('documents.store'), [
            'title' => $title,
            'document_no' => $docNo,
            'document_type_id' => $type->id,
            'organisation_id' => $org->id,
            'publish_status' => 'draft',
            'file' => $file,
            'revision_date' => now()->toDateString(),
            'doc_date' => 11,
            'doc_month' => 6,
            'doc_year' => 2026,
        ]);

    $response->assertRedirect(route('documents.index'));

    $document = Document::where('title', $title)->first();
    expect($document)->not->toBeNull();
    expect($document->document_no)->toBe($docNo);

    // Verify revision is created
    $this->assertDatabaseHas('document_revisions', [
        'document_id' => $document->id,
        'revision_no' => 1,
        'doc_date' => 11,
        'doc_month' => 6,
        'doc_year' => 2026,
        'active' => true,
    ]);

    // Verify file is stored
    $revision = $document->documentRevisions->first();
    Storage::disk('public')->assertExists($revision->file_path);
});

test('show displays details for authorized user', function () {
    $document = Document::factory()->create();

    $response = $this->actingAs($this->user)
        ->get(route('documents.show', $document));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('documents/show')
        ->has('document')
    );
});

test('edit displays form for authorized user', function () {
    $document = Document::factory()->create();

    $response = $this->actingAs($this->user)
        ->get(route('documents.edit', $document));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('documents/edit')
        ->has('document')
    );
});

test('update modifies document metadata and redirects', function () {
    $document = Document::factory()->create();
    $newName = 'Updated Title';

    $response = $this->actingAs($this->user)
        ->put(route('documents.update', $document), [
            'title' => $newName,
            'document_type_id' => $document->document_type_id,
            'organisation_id' => $document->organisation_id,
            'publish_status' => 'draft',
        ]);

    $response->assertRedirect(route('documents.index'));
    $this->assertDatabaseHas('documents', [
        'id' => $document->id,
        'title' => $newName,
    ]);
});

test('destroy deletes document and files from storage', function () {
    $document = Document::factory()->create();
    $file = UploadedFile::fake()->create('manual.pdf', 100);

    // Create a revision with file
    $path = $file->store('documents', 'public');
    $revision = $document->documentRevisions()->create([
        'revision_no' => 1,
        'revision_date' => now()->toDateString(),
        'file_path' => $path,
        'uploaded_by' => $this->user->id,
        'uploaded_by_id' => $this->user->id,
        'uploaded_at' => now(),
    ]);

    Storage::disk('public')->assertExists($path);

    $response = $this->actingAs($this->user)
        ->delete(route('documents.destroy', $document));

    $response->assertRedirect(route('documents.index'));
    $this->assertModelMissing($document);
    $this->assertModelMissing($revision);

    // File must be deleted from storage
    Storage::disk('public')->assertMissing($path);
});

test('publish modifies publish status', function () {
    $document = Document::factory()->create(['publish_status' => 'draft']);

    $response = $this->actingAs($this->user)
        ->post(route('documents.publish', $document));

    $response->assertRedirect();
    $document->refresh();
    expect($document->publish_status)->toBe('published');
    expect($document->published_by)->toBe($this->user->id);
});

test('archive modifies publish status', function () {
    $document = Document::factory()->create(['publish_status' => 'published']);

    $response = $this->actingAs($this->user)
        ->post(route('documents.archive', $document));

    $response->assertRedirect();
    $document->refresh();
    expect($document->publish_status)->toBe('archived');
    expect($document->archived_by)->toBe($this->user->id);
});

test('guest/unauthorized user cannot manage documents', function () {
    $document = Document::factory()->create();

    $this->get(route('documents.index'))->assertRedirect('/login');

    $unauthorizedUser = User::factory()->create();
    $this->actingAs($unauthorizedUser)->get(route('documents.index'))->assertStatus(403);
});
