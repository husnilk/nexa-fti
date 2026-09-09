<?php

use App\Models\DocumentType;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    Permission::findOrCreate('document.view', 'web');
    Permission::findOrCreate('document.manage', 'web');
    $this->user->givePermissionTo(['document.view', 'document.manage']);
});

test('index displays document types for authorized user', function () {
    $documentTypes = DocumentType::factory()->count(3)->create();

    $response = $this->actingAs($this->user)
        ->get(route('document-types.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('document-types/index')
        ->has('documentTypes', 3)
    );
});

test('create displays view for authorized user', function () {
    $response = $this->actingAs($this->user)
        ->get(route('document-types.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('document-types/create'));
});

test('store saves document type and redirects', function () {
    $name = fake()->name();
    $description = fake()->sentence();

    $response = $this->actingAs($this->user)
        ->post(route('document-types.store'), [
            'name' => $name,
            'description' => $description,
        ]);

    $response->assertRedirect(route('document-types.index'));
    $this->assertDatabaseHas('document_types', [
        'name' => $name,
        'description' => $description,
    ]);
});

test('show displays details for authorized user', function () {
    $documentType = DocumentType::factory()->create();

    $response = $this->actingAs($this->user)
        ->get(route('document-types.show', $documentType));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('document-types/show')
        ->has('documentType')
    );
});

test('edit displays form for authorized user', function () {
    $documentType = DocumentType::factory()->create();

    $response = $this->actingAs($this->user)
        ->get(route('document-types.edit', $documentType));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('document-types/edit')
        ->has('documentType')
    );
});

test('update modifies document type and redirects', function () {
    $documentType = DocumentType::factory()->create();
    $newName = fake()->name();
    $newDescription = fake()->sentence();

    $response = $this->actingAs($this->user)
        ->put(route('document-types.update', $documentType), [
            'name' => $newName,
            'description' => $newDescription,
        ]);

    $response->assertRedirect(route('document-types.index'));
    $this->assertDatabaseHas('document_types', [
        'id' => $documentType->id,
        'name' => $newName,
        'description' => $newDescription,
    ]);
});

test('destroy deletes document type and redirects', function () {
    $documentType = DocumentType::factory()->create();

    $response = $this->actingAs($this->user)
        ->delete(route('document-types.destroy', $documentType));

    $response->assertRedirect(route('document-types.index'));
    $this->assertModelMissing($documentType);
});

test('guest cannot manage document types', function () {
    $documentType = DocumentType::factory()->create();

    $this->get(route('document-types.index'))->assertRedirect('/login');
    $this->post(route('document-types.store'), ['name' => 'Test'])->assertRedirect('/login');
    $this->delete(route('document-types.destroy', $documentType))->assertRedirect('/login');
});

test('unauthorized user cannot manage document types', function () {
    $unauthorizedUser = User::factory()->create();
    $documentType = DocumentType::factory()->create();

    $this->actingAs($unauthorizedUser)->get(route('document-types.index'))->assertStatus(403);
    $this->actingAs($unauthorizedUser)->post(route('document-types.store'), ['name' => 'Test'])->assertStatus(403);
    $this->actingAs($unauthorizedUser)->delete(route('document-types.destroy', $documentType))->assertStatus(403);
});
