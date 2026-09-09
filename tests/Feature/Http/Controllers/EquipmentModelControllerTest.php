<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EquipmentModelController;
use App\Http\Requests\EquipmentModelControllerStoreRequest;
use App\Http\Requests\EquipmentModelControllerUpdateRequest;
use App\Models\EquipmentCategory;
use App\Models\EquipmentModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EquipmentModelController
 */
final class EquipmentModelControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $equipmentModels = EquipmentModel::factory()->count(3)->create();

        $response = $this->get(route('equipment-models.index'));

        $response->assertOk();
        $response->assertViewIs('equipmentModel.index');
        $response->assertViewHas('equipmentModels', $equipmentModels);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('equipment-models.create'));

        $response->assertOk();
        $response->assertViewIs('equipmentModel.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentModelController::class,
            'store',
            EquipmentModelControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $equipment_category = EquipmentCategory::factory()->create();
        $model_name = fake()->word();

        $response = $this->post(route('equipment-models.store'), [
            'equipment_category_id' => $equipment_category->id,
            'model_name' => $model_name,
        ]);

        $equipmentModels = EquipmentModel::query()
            ->where('equipment_category_id', $equipment_category->id)
            ->where('model_name', $model_name)
            ->get();
        $this->assertCount(1, $equipmentModels);
        $equipmentModel = $equipmentModels->first();

        $response->assertRedirect(route('equipmentModels.index'));
        $response->assertSessionHas('equipmentModel.id', $equipmentModel->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $equipmentModel = EquipmentModel::factory()->create();

        $response = $this->get(route('equipment-models.show', $equipmentModel));

        $response->assertOk();
        $response->assertViewIs('equipmentModel.show');
        $response->assertViewHas('equipmentModel', $equipmentModel);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $equipmentModel = EquipmentModel::factory()->create();

        $response = $this->get(route('equipment-models.edit', $equipmentModel));

        $response->assertOk();
        $response->assertViewIs('equipmentModel.edit');
        $response->assertViewHas('equipmentModel', $equipmentModel);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentModelController::class,
            'update',
            EquipmentModelControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $equipmentModel = EquipmentModel::factory()->create();
        $equipment_category = EquipmentCategory::factory()->create();
        $model_name = fake()->word();

        $response = $this->put(route('equipment-models.update', $equipmentModel), [
            'equipment_category_id' => $equipment_category->id,
            'model_name' => $model_name,
        ]);

        $equipmentModel->refresh();

        $response->assertRedirect(route('equipmentModels.index'));
        $response->assertSessionHas('equipmentModel.id', $equipmentModel->id);

        $this->assertEquals($equipment_category->id, $equipmentModel->equipment_category_id);
        $this->assertEquals($model_name, $equipmentModel->model_name);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $equipmentModel = EquipmentModel::factory()->create();

        $response = $this->delete(route('equipment-models.destroy', $equipmentModel));

        $response->assertRedirect(route('equipmentModels.index'));

        $this->assertModelMissing($equipmentModel);
    }
}
