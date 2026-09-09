<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\PublicationAuthorController;
use App\Http\Requests\PublicationAuthorControllerStoreRequest;
use App\Http\Requests\PublicationAuthorControllerUpdateRequest;
use App\Models\Author;
use App\Models\Publication;
use App\Models\PublicationAuthor;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see PublicationAuthorController
 */
final class PublicationAuthorControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $publicationAuthors = PublicationAuthor::factory()->count(3)->create();

        $response = $this->get(route('publication-authors.index'));

        $response->assertOk();
        $response->assertViewIs('publicationAuthor.index');
        $response->assertViewHas('publicationAuthors', $publicationAuthors);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('publication-authors.create'));

        $response->assertOk();
        $response->assertViewIs('publicationAuthor.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            PublicationAuthorController::class,
            'store',
            PublicationAuthorControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $publication = Publication::factory()->create();
        $author = Author::factory()->create();
        $author_order = fake()->numberBetween(-10000, 10000);
        $is_corresponding = fake()->boolean();
        $user = User::factory()->create();

        $response = $this->post(route('publication-authors.store'), [
            'publication_id' => $publication->id,
            'author_id' => $author->id,
            'author_order' => $author_order,
            'is_corresponding' => $is_corresponding,
            'user_id' => $user->id,
        ]);

        $publicationAuthors = PublicationAuthor::query()
            ->where('publication_id', $publication->id)
            ->where('author_id', $author->id)
            ->where('author_order', $author_order)
            ->where('is_corresponding', $is_corresponding)
            ->where('user_id', $user->id)
            ->get();
        $this->assertCount(1, $publicationAuthors);
        $publicationAuthor = $publicationAuthors->first();

        $response->assertRedirect(route('publicationAuthors.index'));
        $response->assertSessionHas('publicationAuthor.id', $publicationAuthor->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $publicationAuthor = PublicationAuthor::factory()->create();

        $response = $this->get(route('publication-authors.show', $publicationAuthor));

        $response->assertOk();
        $response->assertViewIs('publicationAuthor.show');
        $response->assertViewHas('publicationAuthor', $publicationAuthor);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $publicationAuthor = PublicationAuthor::factory()->create();

        $response = $this->get(route('publication-authors.edit', $publicationAuthor));

        $response->assertOk();
        $response->assertViewIs('publicationAuthor.edit');
        $response->assertViewHas('publicationAuthor', $publicationAuthor);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            PublicationAuthorController::class,
            'update',
            PublicationAuthorControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $publicationAuthor = PublicationAuthor::factory()->create();
        $publication = Publication::factory()->create();
        $author = Author::factory()->create();
        $author_order = fake()->numberBetween(-10000, 10000);
        $is_corresponding = fake()->boolean();
        $user = User::factory()->create();

        $response = $this->put(route('publication-authors.update', $publicationAuthor), [
            'publication_id' => $publication->id,
            'author_id' => $author->id,
            'author_order' => $author_order,
            'is_corresponding' => $is_corresponding,
            'user_id' => $user->id,
        ]);

        $publicationAuthor->refresh();

        $response->assertRedirect(route('publicationAuthors.index'));
        $response->assertSessionHas('publicationAuthor.id', $publicationAuthor->id);

        $this->assertEquals($publication->id, $publicationAuthor->publication_id);
        $this->assertEquals($author->id, $publicationAuthor->author_id);
        $this->assertEquals($author_order, $publicationAuthor->author_order);
        $this->assertEquals($is_corresponding, $publicationAuthor->is_corresponding);
        $this->assertEquals($user->id, $publicationAuthor->user_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $publicationAuthor = PublicationAuthor::factory()->create();

        $response = $this->delete(route('publication-authors.destroy', $publicationAuthor));

        $response->assertRedirect(route('publicationAuthors.index'));

        $this->assertModelMissing($publicationAuthor);
    }
}
