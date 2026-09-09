<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\ResearchController;
use App\Http\Requests\ResearchControllerStoreRequest;
use App\Http\Requests\ResearchControllerUpdateRequest;
use App\Models\Research;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see ResearchController
 */
final class ResearchControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $research = Research::factory()->count(3)->create();

        $response = $this->get(route('research.index'));

        $response->assertOk();
        $response->assertViewIs('research.index');
        $response->assertViewHas('research', $research);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('research.create'));

        $response->assertOk();
        $response->assertViewIs('research.manage');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            ResearchController::class,
            'store',
            ResearchControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $title = fake()->sentence(4);
        $start_date = Carbon::parse(fake()->date());
        $status = fake()->randomElement(/** enum_attributes **/);

        $response = $this->post(route('research.store'), [
            'title' => $title,
            'start_date' => $start_date->toDateString(),
            'status' => $status,
        ]);

        $research = Research::query()
            ->where('title', $title)
            ->where('start_date', $start_date)
            ->where('status', $status)
            ->get();
        $this->assertCount(1, $research);
        $research = $research->first();

        $response->assertRedirect(route('research.index'));
        $response->assertSessionHas('research.id', $research->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $research = Research::factory()->create();

        $response = $this->get(route('research.show', $research));

        $response->assertOk();
        $response->assertViewIs('research.show');
        $response->assertViewHas('research', $research);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $research = Research::factory()->create();

        $response = $this->get(route('research.edit', $research));

        $response->assertOk();
        $response->assertViewIs('research.edit');
        $response->assertViewHas('research', $research);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            ResearchController::class,
            'update',
            ResearchControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $research = Research::factory()->create();
        $title = fake()->sentence(4);
        $start_date = Carbon::parse(fake()->date());
        $status = fake()->randomElement(/** enum_attributes **/);

        $response = $this->put(route('research.update', $research), [
            'title' => $title,
            'start_date' => $start_date->toDateString(),
            'status' => $status,
        ]);

        $research->refresh();

        $response->assertRedirect(route('research.index'));
        $response->assertSessionHas('research.id', $research->id);

        $this->assertEquals($title, $research->title);
        $this->assertEquals($start_date, $research->start_date);
        $this->assertEquals($status, $research->status);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $research = Research::factory()->create();

        $response = $this->delete(route('research.destroy', $research));

        $response->assertRedirect(route('research.index'));

        $this->assertModelMissing($research);
    }
}
