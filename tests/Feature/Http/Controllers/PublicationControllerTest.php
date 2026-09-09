<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\PublicationController;
use App\Http\Requests\PublicationControllerStoreRequest;
use App\Http\Requests\PublicationControllerUpdateRequest;
use App\Models\Publication;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see PublicationController
 */
final class PublicationControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $publications = Publication::factory()->count(3)->create();

        $response = $this->get(route('publications.index'));

        $response->assertOk();
        $response->assertViewIs('publication.index');
        $response->assertViewHas('publications', $publications);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('publications.create'));

        $response->assertOk();
        $response->assertViewIs('publication.manage');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            PublicationController::class,
            'store',
            PublicationControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $title = fake()->sentence(4);
        $publication_date = Carbon::parse(fake()->date());

        $response = $this->post(route('publications.store'), [
            'title' => $title,
            'publication_date' => $publication_date->toDateString(),
        ]);

        $publications = Publication::query()
            ->where('title', $title)
            ->where('publication_date', $publication_date)
            ->get();
        $this->assertCount(1, $publications);
        $publication = $publications->first();

        $response->assertRedirect(route('publications.index'));
        $response->assertSessionHas('publication.id', $publication->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $publication = Publication::factory()->create();

        $response = $this->get(route('publications.show', $publication));

        $response->assertOk();
        $response->assertViewIs('publication.show');
        $response->assertViewHas('publication', $publication);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $publication = Publication::factory()->create();

        $response = $this->get(route('publications.edit', $publication));

        $response->assertOk();
        $response->assertViewIs('publication.edit');
        $response->assertViewHas('publication', $publication);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            PublicationController::class,
            'update',
            PublicationControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $publication = Publication::factory()->create();
        $title = fake()->sentence(4);
        $publication_date = Carbon::parse(fake()->date());

        $response = $this->put(route('publications.update', $publication), [
            'title' => $title,
            'publication_date' => $publication_date->toDateString(),
        ]);

        $publication->refresh();

        $response->assertRedirect(route('publications.index'));
        $response->assertSessionHas('publication.id', $publication->id);

        $this->assertEquals($title, $publication->title);
        $this->assertEquals($publication_date, $publication->publication_date);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $publication = Publication::factory()->create();

        $response = $this->delete(route('publications.destroy', $publication));

        $response->assertRedirect(route('publications.index'));

        $this->assertModelMissing($publication);
    }
}
