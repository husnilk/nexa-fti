<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\AssetController;
use App\Http\Requests\AssetControllerStoreRequest;
use App\Http\Requests\AssetControllerUpdateRequest;
use App\Models\Asset;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see AssetController
 */
final class AssetControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $assets = Asset::factory()->count(3)->create();

        $response = $this->get(route('assets.index'));

        $response->assertOk();
        $response->assertViewIs('asset.index');
        $response->assertViewHas('assets', $assets);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('assets.create'));

        $response->assertOk();
        $response->assertViewIs('asset.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            AssetController::class,
            'store',
            AssetControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $name = fake()->name();
        $code = fake()->word();
        $type = fake()->randomElement(/** enum_attributes **/);
        $acquisition_type = fake()->randomElement(/** enum_attributes **/);
        $acquisition_date = Carbon::parse(fake()->date());
        $condition = fake()->randomElement(/** enum_attributes **/);
        $status = fake()->randomElement(/** enum_attributes **/);

        $response = $this->post(route('assets.store'), [
            'name' => $name,
            'code' => $code,
            'type' => $type,
            'acquisition_type' => $acquisition_type,
            'acquisition_date' => $acquisition_date->toDateString(),
            'condition' => $condition,
            'status' => $status,
        ]);

        $assets = Asset::query()
            ->where('name', $name)
            ->where('code', $code)
            ->where('type', $type)
            ->where('acquisition_type', $acquisition_type)
            ->where('acquisition_date', $acquisition_date)
            ->where('condition', $condition)
            ->where('status', $status)
            ->get();
        $this->assertCount(1, $assets);
        $asset = $assets->first();

        $response->assertRedirect(route('assets.index'));
        $response->assertSessionHas('asset.id', $asset->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $asset = Asset::factory()->create();

        $response = $this->get(route('assets.show', $asset));

        $response->assertOk();
        $response->assertViewIs('asset.show');
        $response->assertViewHas('asset', $asset);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $asset = Asset::factory()->create();

        $response = $this->get(route('assets.edit', $asset));

        $response->assertOk();
        $response->assertViewIs('asset.edit');
        $response->assertViewHas('asset', $asset);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            AssetController::class,
            'update',
            AssetControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $asset = Asset::factory()->create();
        $name = fake()->name();
        $code = fake()->word();
        $type = fake()->randomElement(/** enum_attributes **/);
        $acquisition_type = fake()->randomElement(/** enum_attributes **/);
        $acquisition_date = Carbon::parse(fake()->date());
        $condition = fake()->randomElement(/** enum_attributes **/);
        $status = fake()->randomElement(/** enum_attributes **/);

        $response = $this->put(route('assets.update', $asset), [
            'name' => $name,
            'code' => $code,
            'type' => $type,
            'acquisition_type' => $acquisition_type,
            'acquisition_date' => $acquisition_date->toDateString(),
            'condition' => $condition,
            'status' => $status,
        ]);

        $asset->refresh();

        $response->assertRedirect(route('assets.index'));
        $response->assertSessionHas('asset.id', $asset->id);

        $this->assertEquals($name, $asset->name);
        $this->assertEquals($code, $asset->code);
        $this->assertEquals($type, $asset->type);
        $this->assertEquals($acquisition_type, $asset->acquisition_type);
        $this->assertEquals($acquisition_date, $asset->acquisition_date);
        $this->assertEquals($condition, $asset->condition);
        $this->assertEquals($status, $asset->status);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $asset = Asset::factory()->create();

        $response = $this->delete(route('assets.destroy', $asset));

        $response->assertRedirect(route('assets.index'));

        $this->assertModelMissing($asset);
    }
}
