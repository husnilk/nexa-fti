<?php

use App\Models\Book;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Spatie\Permission\PermissionRegistrar;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    Permission::findOrCreate('book.view', 'web');
    Permission::findOrCreate('book.manage', 'web');

    $this->admin = User::factory()->create();
    $this->admin->assignRole(Role::findOrCreate('super-admin', 'web'));

    $this->authorizedUser = User::factory()->create();

    $this->unauthorizedUser = User::factory()->create();
});

test('authorized user can view books list', function () {
    $book = Book::factory()->create([
        'title' => 'Test Laravel Book',
    ]);
    $book->authors()->attach($this->authorizedUser);

    $this->authorizedUser->givePermissionTo('book.view');

    actingAs($this->authorizedUser)
        ->get(route('books.index'))
        ->assertOk();
});

test('unauthorized user cannot view books list', function () {
    actingAs($this->unauthorizedUser)
        ->get(route('books.index'))
        ->assertForbidden();
});

test('authorized user can create a book', function () {
    $author1 = User::factory()->create();
    $author2 = User::factory()->create();

    $this->authorizedUser->givePermissionTo('book.manage');

    actingAs($this->authorizedUser)
        ->postJson(route('books.store'), [
            'title' => 'Building Awesome Apps',
            'type' => 'Textbook',
            'publisher' => 'O Reilly',
            'publication_year' => 2026,
            'isbn' => '978-1-2345-6789-0',
            'description' => 'A great book about building apps.',
            'authors' => [$author1->id, $author2->id],
        ])
        ->assertRedirect(route('books.index'));

    $this->assertDatabaseHas('books', [
        'title' => 'Building Awesome Apps',
        'type' => 'Textbook',
        'publisher' => 'O Reilly',
        'publication_year' => 2026,
    ]);

    $book = Book::where('title', 'Building Awesome Apps')->first();
    expect($book->authors)->toHaveCount(2);
});

test('unauthorized user cannot create a book', function () {
    actingAs($this->unauthorizedUser)
        ->postJson(route('books.store'), [
            'title' => 'Unauthorized Book',
            'type' => 'Reference Book',
            'authors' => [User::factory()->create()->id],
        ])
        ->assertForbidden();
});

test('authorized user can update a book and sync authors', function () {
    $book = Book::factory()->create([
        'title' => 'Original Title',
    ]);
    $author1 = User::factory()->create();
    $author2 = User::factory()->create();
    $book->authors()->attach($author1);

    $this->authorizedUser->givePermissionTo('book.manage');

    actingAs($this->authorizedUser)
        ->putJson(route('books.update', $book), [
            'title' => 'Updated Title',
            'type' => 'Monograph',
            'publisher' => 'New Publisher',
            'publication_year' => 2027,
            'authors' => [$author2->id], // syncs to only author 2
        ])
        ->assertRedirect(route('books.index'));

    $this->assertDatabaseHas('books', [
        'id' => $book->id,
        'title' => 'Updated Title',
        'type' => 'Monograph',
    ]);

    $book->refresh();
    expect($book->authors)->toHaveCount(1);
    expect($book->authors->first()->id)->toBe($author2->id);
});

test('unauthorized user cannot update a book', function () {
    $book = Book::factory()->create();

    actingAs($this->unauthorizedUser)
        ->putJson(route('books.update', $book), [
            'title' => 'Hack Book',
            'type' => 'Hack',
            'authors' => [User::factory()->create()->id],
        ])
        ->assertForbidden();
});

test('authorized user can delete a book', function () {
    $book = Book::factory()->create();
    $book->authors()->attach($this->authorizedUser);

    $this->authorizedUser->givePermissionTo('book.manage');

    actingAs($this->authorizedUser)
        ->delete(route('books.destroy', $book))
        ->assertRedirect(route('books.index'));

    $this->assertDatabaseMissing('books', [
        'id' => $book->id,
    ]);
});

test('unauthorized user cannot delete a book', function () {
    $book = Book::factory()->create();

    actingAs($this->unauthorizedUser)
        ->delete(route('books.destroy', $book))
        ->assertForbidden();
});
