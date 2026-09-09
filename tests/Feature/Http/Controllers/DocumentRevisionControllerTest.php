<?php

use App\Models\Document;
use App\Models\DocumentRevision;
use App\Models\Employee;
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
    Permission::findOrCreate('document.manage', 'web');
    $this->user->givePermissionTo('document.manage');
});

test('store uploads revision, deactivates old active, and increments revision number', function () {
    $document = Document::factory()->create();

    // Create initial revision
    $firstRevision = DocumentRevision::create([
        'document_id' => $document->id,
        'revision_no' => 1,
        'revision_date' => now()->subDays(5)->toDateString(),
        'file_path' => 'documents/old.pdf',
        'uploaded_by' => $this->user->id,
        'uploaded_by_id' => $this->user->id,
        'uploaded_at' => now(),
        'active' => true,
    ]);

    $file = UploadedFile::fake()->create('revision2.pdf', 200);

    $response = $this->actingAs($this->user)
        ->from(route('documents.show', $document))
        ->post(route('document-revisions.store'), [
            'document_id' => $document->id,
            'revision_date' => now()->toDateString(),
            'doc_date' => 15,
            'doc_month' => 6,
            'doc_year' => 2026,
            'file' => $file,
        ]);

    $response->assertRedirect(route('documents.show', $document));

    $firstRevision->refresh();
    expect($firstRevision->active)->toBeFalse();

    $this->assertDatabaseHas('document_revisions', [
        'document_id' => $document->id,
        'revision_no' => 2,
        'active' => true,
        'doc_date' => 15,
        'doc_month' => 6,
        'doc_year' => 2026,
    ]);

    $newRevision = DocumentRevision::where('document_id', $document->id)->where('revision_no', 2)->first();
    Storage::disk('public')->assertExists($newRevision->file_path);
});

test('update modifies revision details and handles new file upload', function () {
    $document = Document::factory()->create();
    $revision = DocumentRevision::create([
        'document_id' => $document->id,
        'revision_no' => 1,
        'revision_date' => now()->toDateString(),
        'file_path' => 'documents/original.pdf',
        'uploaded_by' => $this->user->id,
        'uploaded_by_id' => $this->user->id,
        'uploaded_at' => now(),
        'active' => true,
    ]);

    $file = UploadedFile::fake()->create('updated.pdf', 300);

    $response = $this->actingAs($this->user)
        ->from(route('documents.show', $document))
        ->put(route('document-revisions.update', $revision), [
            'document_id' => $document->id,
            'revision_date' => '2026-06-15',
            'doc_date' => 20,
            'doc_month' => 6,
            'doc_year' => 2026,
            'file' => $file,
        ]);

    $response->assertRedirect(route('documents.show', $document));

    $revision->refresh();
    expect($revision->revision_date->toDateString())->toBe('2026-06-15');
    expect($revision->doc_date)->toBe(20);
    expect($revision->file_path)->not->toBe('documents/original.pdf');
    Storage::disk('public')->assertExists($revision->file_path);
});

test('destroy deletes revision and activates previous latest revision if active was deleted', function () {
    $document = Document::factory()->create();

    $rev1 = DocumentRevision::create([
        'document_id' => $document->id,
        'revision_no' => 1,
        'revision_date' => now()->subDays(5)->toDateString(),
        'file_path' => 'documents/1.pdf',
        'uploaded_by' => $this->user->id,
        'uploaded_by_id' => $this->user->id,
        'uploaded_at' => now(),
        'active' => false,
    ]);

    $rev2 = DocumentRevision::create([
        'document_id' => $document->id,
        'revision_no' => 2,
        'revision_date' => now()->toDateString(),
        'file_path' => 'documents/2.pdf',
        'uploaded_by' => $this->user->id,
        'uploaded_by_id' => $this->user->id,
        'uploaded_at' => now(),
        'active' => true,
    ]);

    $response = $this->actingAs($this->user)
        ->from(route('documents.show', $document))
        ->delete(route('document-revisions.destroy', $rev2));

    $response->assertRedirect(route('documents.show', $document));

    $this->assertModelMissing($rev2);

    // Rev1 should become active
    $rev1->refresh();
    expect($rev1->active)->toBeTrue();
});
