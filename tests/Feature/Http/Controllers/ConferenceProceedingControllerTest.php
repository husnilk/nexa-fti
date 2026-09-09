<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\ConferenceProceedingController;
use App\Http\Requests\ConferenceProceedingControllerStoreRequest;
use App\Http\Requests\ConferenceProceedingControllerUpdateRequest;
use App\Models\ConferenceProceeding;
use App\Models\Publication;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see ConferenceProceedingController
 */
final class ConferenceProceedingControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $conferenceProceedings = ConferenceProceeding::factory()->count(3)->create();

        $response = $this->get(route('conference-proceedings.index'));

        $response->assertOk();
        $response->assertViewIs('conferenceProceeding.index');
        $response->assertViewHas('conferenceProceedings', $conferenceProceedings);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('conference-proceedings.create'));

        $response->assertOk();
        $response->assertViewIs('conferenceProceeding.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            ConferenceProceedingController::class,
            'store',
            ConferenceProceedingControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $publication = Publication::factory()->create();
        $conference_name = fake()->word();

        $response = $this->post(route('conference-proceedings.store'), [
            'publication_id' => $publication->id,
            'conference_name' => $conference_name,
        ]);

        $conferenceProceedings = ConferenceProceeding::query()
            ->where('publication_id', $publication->id)
            ->where('conference_name', $conference_name)
            ->get();
        $this->assertCount(1, $conferenceProceedings);
        $conferenceProceeding = $conferenceProceedings->first();

        $response->assertRedirect(route('conferenceProceedings.index'));
        $response->assertSessionHas('conferenceProceeding.id', $conferenceProceeding->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $conferenceProceeding = ConferenceProceeding::factory()->create();

        $response = $this->get(route('conference-proceedings.show', $conferenceProceeding));

        $response->assertOk();
        $response->assertViewIs('conferenceProceeding.show');
        $response->assertViewHas('conferenceProceeding', $conferenceProceeding);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $conferenceProceeding = ConferenceProceeding::factory()->create();

        $response = $this->get(route('conference-proceedings.edit', $conferenceProceeding));

        $response->assertOk();
        $response->assertViewIs('conferenceProceeding.edit');
        $response->assertViewHas('conferenceProceeding', $conferenceProceeding);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            ConferenceProceedingController::class,
            'update',
            ConferenceProceedingControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $conferenceProceeding = ConferenceProceeding::factory()->create();
        $publication = Publication::factory()->create();
        $conference_name = fake()->word();

        $response = $this->put(route('conference-proceedings.update', $conferenceProceeding), [
            'publication_id' => $publication->id,
            'conference_name' => $conference_name,
        ]);

        $conferenceProceeding->refresh();

        $response->assertRedirect(route('conferenceProceedings.index'));
        $response->assertSessionHas('conferenceProceeding.id', $conferenceProceeding->id);

        $this->assertEquals($publication->id, $conferenceProceeding->publication_id);
        $this->assertEquals($conference_name, $conferenceProceeding->conference_name);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $conferenceProceeding = ConferenceProceeding::factory()->create();

        $response = $this->delete(route('conference-proceedings.destroy', $conferenceProceeding));

        $response->assertRedirect(route('conferenceProceedings.index'));

        $this->assertModelMissing($conferenceProceeding);
    }
}
