<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EquipmentController;
use App\Http\Requests\EquipmentControllerStoreRequest;
use App\Http\Requests\EquipmentControllerUpdateRequest;
use App\Models\Equipment;
use App\Models\EquipmentModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EquipmentController
 */
final class EquipmentControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $equipment = Equipment::factory()->count(3)->create();

        $response = $this->get(route('equipment.index'));

        $response->assertOk();
        $response->assertViewIs('equipment.index');
        $response->assertViewHas('equipment', $equipment);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('equipment.create'));

        $response->assertOk();
        $response->assertViewIs('equipment.manage');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentController::class,
            'store',
            EquipmentControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $equipment_model = EquipmentModel::factory()->create();
        $equipment_number = fake()->word();
        $condition = fake()->randomElement(/** enum_attributes **/);
        $status = fake()->randomElement(/** enum_attributes **/);

        $response = $this->post(route('equipment.store'), [
            'equipment_model_id' => $equipment_model->id,
            'equipment_number' => $equipment_number,
            'condition' => $condition,
            'status' => $status,
        ]);

        $equipment = Equipment::query()
            ->where('equipment_model_id', $equipment_model->id)
            ->where('equipment_number', $equipment_number)
            ->where('condition', $condition)
            ->where('status', $status)
            ->get();
        $this->assertCount(1, $equipment);
        $equipment = $equipment->first();

        $response->assertRedirect(route('equipment.index'));
        $response->assertSessionHas('equipment.id', $equipment->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $equipment = Equipment::factory()->create();

        $response = $this->get(route('equipment.show', $equipment));

        $response->assertOk();
        $response->assertViewIs('equipment.show');
        $response->assertViewHas('equipment', $equipment);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $equipment = Equipment::factory()->create();

        $response = $this->get(route('equipment.edit', $equipment));

        $response->assertOk();
        $response->assertViewIs('equipment.edit');
        $response->assertViewHas('equipment', $equipment);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentController::class,
            'update',
            EquipmentControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $equipment = Equipment::factory()->create();
        $equipment_model = EquipmentModel::factory()->create();
        $equipment_number = fake()->word();
        $condition = fake()->randomElement(/** enum_attributes **/);
        $status = fake()->randomElement(/** enum_attributes **/);

        $response = $this->put(route('equipment.update', $equipment), [
            'equipment_model_id' => $equipment_model->id,
            'equipment_number' => $equipment_number,
            'condition' => $condition,
            'status' => $status,
        ]);

        $equipment->refresh();

        $response->assertRedirect(route('equipment.index'));
        $response->assertSessionHas('equipment.id', $equipment->id);

        $this->assertEquals($equipment_model->id, $equipment->equipment_model_id);
        $this->assertEquals($equipment_number, $equipment->equipment_number);
        $this->assertEquals($condition, $equipment->condition);
        $this->assertEquals($status, $equipment->status);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $equipment = Equipment::factory()->create();

        $response = $this->delete(route('equipment.destroy', $equipment));

        $response->assertRedirect(route('equipment.index'));

        $this->assertModelMissing($equipment);
    }
}
