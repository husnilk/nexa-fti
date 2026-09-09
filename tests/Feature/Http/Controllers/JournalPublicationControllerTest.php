<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\JournalPublicationController;
use App\Http\Requests\JournalPublicationControllerStoreRequest;
use App\Http\Requests\JournalPublicationControllerUpdateRequest;
use App\Models\JournalPublication;
use App\Models\Publication;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see JournalPublicationController
 */
final class JournalPublicationControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $journalPublications = JournalPublication::factory()->count(3)->create();

        $response = $this->get(route('journal-publications.index'));

        $response->assertOk();
        $response->assertViewIs('journalPublication.index');
        $response->assertViewHas('journalPublications', $journalPublications);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('journal-publications.create'));

        $response->assertOk();
        $response->assertViewIs('journalPublication.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            JournalPublicationController::class,
            'store',
            JournalPublicationControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $publication = Publication::factory()->create();
        $journal_name = fake()->word();

        $response = $this->post(route('journal-publications.store'), [
            'publication_id' => $publication->id,
            'journal_name' => $journal_name,
        ]);

        $journalPublications = JournalPublication::query()
            ->where('publication_id', $publication->id)
            ->where('journal_name', $journal_name)
            ->get();
        $this->assertCount(1, $journalPublications);
        $journalPublication = $journalPublications->first();

        $response->assertRedirect(route('journalPublications.index'));
        $response->assertSessionHas('journalPublication.id', $journalPublication->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $journalPublication = JournalPublication::factory()->create();

        $response = $this->get(route('journal-publications.show', $journalPublication));

        $response->assertOk();
        $response->assertViewIs('journalPublication.show');
        $response->assertViewHas('journalPublication', $journalPublication);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $journalPublication = JournalPublication::factory()->create();

        $response = $this->get(route('journal-publications.edit', $journalPublication));

        $response->assertOk();
        $response->assertViewIs('journalPublication.edit');
        $response->assertViewHas('journalPublication', $journalPublication);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            JournalPublicationController::class,
            'update',
            JournalPublicationControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $journalPublication = JournalPublication::factory()->create();
        $publication = Publication::factory()->create();
        $journal_name = fake()->word();

        $response = $this->put(route('journal-publications.update', $journalPublication), [
            'publication_id' => $publication->id,
            'journal_name' => $journal_name,
        ]);

        $journalPublication->refresh();

        $response->assertRedirect(route('journalPublications.index'));
        $response->assertSessionHas('journalPublication.id', $journalPublication->id);

        $this->assertEquals($publication->id, $journalPublication->publication_id);
        $this->assertEquals($journal_name, $journalPublication->journal_name);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $journalPublication = JournalPublication::factory()->create();

        $response = $this->delete(route('journal-publications.destroy', $journalPublication));

        $response->assertRedirect(route('journalPublications.index'));

        $this->assertModelMissing($journalPublication);
    }
}
