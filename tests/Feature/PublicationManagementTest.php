<?php

use App\Models\Permission;
use App\Models\Publication;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    $this->user = User::factory()->create();

    Permission::findOrCreate('publication.view', 'web');
    Permission::findOrCreate('publication.manage', 'web');
    Permission::findOrCreate('publication.manage', 'web');
    Permission::findOrCreate('publication.manage', 'web');
});

test('user without publication permission cannot view publication index', function () {
    $this->actingAs($this->user)
        ->get(route('publications.index'))
        ->assertForbidden();
});

test('user with publication permission can view publication index', function () {
    $this->user->givePermissionTo('publication.view');

    $this->actingAs($this->user)
        ->get(route('publications.index'))
        ->assertSuccessful();
});

test('user can create journal publication', function () {
    $this->withoutExceptionHandling();
    $this->user->givePermissionTo('publication.manage');

    $this->actingAs($this->user)
        ->postJson(route('publications.store'), [
            'type' => 'journal',
            'title' => 'New Journal Publication',
            'publication_date' => now()->toDateString(),
            'journal_name' => 'Tech Journal',
        ])
        ->assertRedirect(route('publications.index'));

    $this->assertDatabaseHas('publications', [
        'title' => 'New Journal Publication',
    ]);

    $publication = Publication::where('title', 'New Journal Publication')->first();

    $this->assertDatabaseHas('journal_publications', [
        'id' => $publication->id,
        'journal_name' => 'Tech Journal',
    ]);
});

test('user can create conference publication', function () {
    $this->user->givePermissionTo('publication.manage');

    $this->actingAs($this->user)
        ->postJson(route('publications.store'), [
            'type' => 'conference',
            'title' => 'New Conference Publication',
            'publication_date' => now()->toDateString(),
            'conference_name' => 'Tech Conference 2026',
        ])
        ->assertRedirect(route('publications.index'));

    $this->assertDatabaseHas('publications', [
        'title' => 'New Conference Publication',
    ]);

    $publication = Publication::where('title', 'New Conference Publication')->first();

    $this->assertDatabaseHas('conference_proceedings', [
        'id' => $publication->id,
        'conference_name' => 'Tech Conference 2026',
    ]);
});

test('user can update publication type from journal to conference', function () {
    $this->user->givePermissionTo('publication.manage');
    $this->user->givePermissionTo('publication.manage');

    $this->actingAs($this->user)
        ->postJson(route('publications.store'), [
            'type' => 'journal',
            'title' => 'Old Journal',
            'publication_date' => now()->toDateString(),
            'journal_name' => 'Old Tech Journal',
        ]);

    $publication = Publication::where('title', 'Old Journal')->first();

    $this->actingAs($this->user)
        ->patchJson(route('publications.update', $publication), [
            'type' => 'conference',
            'title' => 'Updated Conference',
            'publication_date' => now()->toDateString(),
            'conference_name' => 'New Conference',
        ])
        ->assertRedirect(route('publications.index'));

    $this->assertDatabaseHas('publications', [
        'id' => $publication->id,
        'title' => 'Updated Conference',
    ]);

    $this->assertDatabaseHas('conference_proceedings', [
        'id' => $publication->id,
        'conference_name' => 'New Conference',
    ]);

    $this->assertDatabaseMissing('journal_publications', [
        'id' => $publication->id,
    ]);
});

test('user can add author to publication', function () {
    $this->user->givePermissionTo('publication.manage');
    $this->user->givePermissionTo('publication.manage');

    $this->actingAs($this->user)
        ->postJson(route('publications.store'), [
            'type' => 'journal',
            'title' => 'Authored Journal',
            'publication_date' => now()->toDateString(),
            'journal_name' => 'Author Journal',
        ]);

    $publication = Publication::where('title', 'Authored Journal')->first();
    $authorUser = User::factory()->create();

    $this->actingAs($this->user)
        ->postJson(route('publication-authors.store'), [
            'publication_id' => $publication->id,
            'author_id' => $authorUser->id,
            'user_id' => $authorUser->id,
            'author_order' => 1,
            'is_corresponding' => true,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('publication_authors', [
        'publication_id' => $publication->id,
        'author_id' => $authorUser->id,
        'user_id' => $authorUser->id,
        'author_order' => 1,
        'is_corresponding' => 1, // true in SQLite
    ]);
});
