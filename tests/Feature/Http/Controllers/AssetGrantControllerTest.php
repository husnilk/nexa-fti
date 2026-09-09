<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\AssetGrantController;
use App\Http\Requests\AssetGrantControllerStoreRequest;
use App\Http\Requests\AssetGrantControllerUpdateRequest;
use App\Models\AssetGrant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see AssetGrantController
 */
final class AssetGrantControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $assetGrants = AssetGrant::factory()->count(3)->create();

        $response = $this->get(route('asset-grants.index'));

        $response->assertOk();
        $response->assertViewIs('assetGrant.index');
        $response->assertViewHas('assetGrants', $assetGrants);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('asset-grants.create'));

        $response->assertOk();
        $response->assertViewIs('assetGrant.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            AssetGrantController::class,
            'store',
            AssetGrantControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $name = fake()->name();
        $source = fake()->word();
        $grant_date = Carbon::parse(fake()->date());

        $response = $this->post(route('asset-grants.store'), [
            'name' => $name,
            'source' => $source,
            'grant_date' => $grant_date->toDateString(),
        ]);

        $assetGrants = AssetGrant::query()
            ->where('name', $name)
            ->where('source', $source)
            ->where('grant_date', $grant_date)
            ->get();
        $this->assertCount(1, $assetGrants);
        $assetGrant = $assetGrants->first();

        $response->assertRedirect(route('assetGrants.index'));
        $response->assertSessionHas('assetGrant.id', $assetGrant->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $assetGrant = AssetGrant::factory()->create();

        $response = $this->get(route('asset-grants.show', $assetGrant));

        $response->assertOk();
        $response->assertViewIs('assetGrant.show');
        $response->assertViewHas('assetGrant', $assetGrant);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $assetGrant = AssetGrant::factory()->create();

        $response = $this->get(route('asset-grants.edit', $assetGrant));

        $response->assertOk();
        $response->assertViewIs('assetGrant.edit');
        $response->assertViewHas('assetGrant', $assetGrant);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            AssetGrantController::class,
            'update',
            AssetGrantControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $assetGrant = AssetGrant::factory()->create();
        $name = fake()->name();
        $source = fake()->word();
        $grant_date = Carbon::parse(fake()->date());

        $response = $this->put(route('asset-grants.update', $assetGrant), [
            'name' => $name,
            'source' => $source,
            'grant_date' => $grant_date->toDateString(),
        ]);

        $assetGrant->refresh();

        $response->assertRedirect(route('assetGrants.index'));
        $response->assertSessionHas('assetGrant.id', $assetGrant->id);

        $this->assertEquals($name, $assetGrant->name);
        $this->assertEquals($source, $assetGrant->source);
        $this->assertEquals($grant_date, $assetGrant->grant_date);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $assetGrant = AssetGrant::factory()->create();

        $response = $this->delete(route('asset-grants.destroy', $assetGrant));

        $response->assertRedirect(route('assetGrants.index'));

        $this->assertModelMissing($assetGrant);
    }
}
