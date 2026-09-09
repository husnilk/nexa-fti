<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\CommunityServiceController;
use App\Http\Requests\CommunityServiceControllerStoreRequest;
use App\Http\Requests\CommunityServiceControllerUpdateRequest;
use App\Models\CommunityService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see CommunityServiceController
 */
final class CommunityServiceControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $communityServices = CommunityService::factory()->count(3)->create();

        $response = $this->get(route('community-services.index'));

        $response->assertOk();
        $response->assertViewIs('communityService.index');
        $response->assertViewHas('communityServices', $communityServices);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('community-services.create'));

        $response->assertOk();
        $response->assertViewIs('communityService.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommunityServiceController::class,
            'store',
            CommunityServiceControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $title = fake()->sentence(4);
        $location = fake()->word();
        $start_date = Carbon::parse(fake()->date());
        $status = fake()->randomElement(/** enum_attributes **/);

        $response = $this->post(route('community-services.store'), [
            'title' => $title,
            'location' => $location,
            'start_date' => $start_date->toDateString(),
            'status' => $status,
        ]);

        $communityServices = CommunityService::query()
            ->where('title', $title)
            ->where('location', $location)
            ->where('start_date', $start_date)
            ->where('status', $status)
            ->get();
        $this->assertCount(1, $communityServices);
        $communityService = $communityServices->first();

        $response->assertRedirect(route('communityServices.index'));
        $response->assertSessionHas('communityService.id', $communityService->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $communityService = CommunityService::factory()->create();

        $response = $this->get(route('community-services.show', $communityService));

        $response->assertOk();
        $response->assertViewIs('communityService.show');
        $response->assertViewHas('communityService', $communityService);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $communityService = CommunityService::factory()->create();

        $response = $this->get(route('community-services.edit', $communityService));

        $response->assertOk();
        $response->assertViewIs('communityService.edit');
        $response->assertViewHas('communityService', $communityService);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommunityServiceController::class,
            'update',
            CommunityServiceControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $communityService = CommunityService::factory()->create();
        $title = fake()->sentence(4);
        $location = fake()->word();
        $start_date = Carbon::parse(fake()->date());
        $status = fake()->randomElement(/** enum_attributes **/);

        $response = $this->put(route('community-services.update', $communityService), [
            'title' => $title,
            'location' => $location,
            'start_date' => $start_date->toDateString(),
            'status' => $status,
        ]);

        $communityService->refresh();

        $response->assertRedirect(route('communityServices.index'));
        $response->assertSessionHas('communityService.id', $communityService->id);

        $this->assertEquals($title, $communityService->title);
        $this->assertEquals($location, $communityService->location);
        $this->assertEquals($start_date, $communityService->start_date);
        $this->assertEquals($status, $communityService->status);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $communityService = CommunityService::factory()->create();

        $response = $this->delete(route('community-services.destroy', $communityService));

        $response->assertRedirect(route('communityServices.index'));

        $this->assertModelMissing($communityService);
    }
}
