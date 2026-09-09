<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EquipmentCategoryController;
use App\Http\Requests\EquipmentCategoryControllerStoreRequest;
use App\Http\Requests\EquipmentCategoryControllerUpdateRequest;
use App\Models\EquipmentCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EquipmentCategoryController
 */
final class EquipmentCategoryControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $equipmentCategories = EquipmentCategory::factory()->count(3)->create();

        $response = $this->get(route('equipment-categories.index'));

        $response->assertOk();
        $response->assertViewIs('equipmentCategory.index');
        $response->assertViewHas('equipmentCategories', $equipmentCategories);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('equipment-categories.create'));

        $response->assertOk();
        $response->assertViewIs('equipmentCategory.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentCategoryController::class,
            'store',
            EquipmentCategoryControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $code = fake()->word();
        $name = fake()->name();

        $response = $this->post(route('equipment-categories.store'), [
            'code' => $code,
            'name' => $name,
        ]);

        $equipmentCategories = EquipmentCategory::query()
            ->where('code', $code)
            ->where('name', $name)
            ->get();
        $this->assertCount(1, $equipmentCategories);
        $equipmentCategory = $equipmentCategories->first();

        $response->assertRedirect(route('equipmentCategories.index'));
        $response->assertSessionHas('equipmentCategory.id', $equipmentCategory->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $equipmentCategory = EquipmentCategory::factory()->create();

        $response = $this->get(route('equipment-categories.show', $equipmentCategory));

        $response->assertOk();
        $response->assertViewIs('equipmentCategory.show');
        $response->assertViewHas('equipmentCategory', $equipmentCategory);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $equipmentCategory = EquipmentCategory::factory()->create();

        $response = $this->get(route('equipment-categories.edit', $equipmentCategory));

        $response->assertOk();
        $response->assertViewIs('equipmentCategory.edit');
        $response->assertViewHas('equipmentCategory', $equipmentCategory);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentCategoryController::class,
            'update',
            EquipmentCategoryControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $equipmentCategory = EquipmentCategory::factory()->create();
        $code = fake()->word();
        $name = fake()->name();

        $response = $this->put(route('equipment-categories.update', $equipmentCategory), [
            'code' => $code,
            'name' => $name,
        ]);

        $equipmentCategory->refresh();

        $response->assertRedirect(route('equipmentCategories.index'));
        $response->assertSessionHas('equipmentCategory.id', $equipmentCategory->id);

        $this->assertEquals($code, $equipmentCategory->code);
        $this->assertEquals($name, $equipmentCategory->name);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $equipmentCategory = EquipmentCategory::factory()->create();

        $response = $this->delete(route('equipment-categories.destroy', $equipmentCategory));

        $response->assertRedirect(route('equipmentCategories.index'));

        $this->assertModelMissing($equipmentCategory);
    }
}
