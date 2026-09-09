<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EquipmentDepreciationController;
use App\Http\Requests\EquipmentDepreciationControllerStoreRequest;
use App\Http\Requests\EquipmentDepreciationControllerUpdateRequest;
use App\Models\Equipment;
use App\Models\EquipmentDepreciation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EquipmentDepreciationController
 */
final class EquipmentDepreciationControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $equipmentDepreciations = EquipmentDepreciation::factory()->count(3)->create();

        $response = $this->get(route('equipment-depreciations.index'));

        $response->assertOk();
        $response->assertViewIs('equipmentDepreciation.index');
        $response->assertViewHas('equipmentDepreciations', $equipmentDepreciations);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('equipment-depreciations.create'));

        $response->assertOk();
        $response->assertViewIs('equipmentDepreciation.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentDepreciationController::class,
            'store',
            EquipmentDepreciationControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $equipment = Equipment::factory()->create();
        $depreciation_date = Carbon::parse(fake()->date());
        $acquisition_cost = fake()->randomFloat(/** decimal_attributes **/);
        $depreciation_amount = fake()->randomFloat(/** decimal_attributes **/);
        $book_value = fake()->randomFloat(/** decimal_attributes **/);

        $response = $this->post(route('equipment-depreciations.store'), [
            'equipment_id' => $equipment->id,
            'depreciation_date' => $depreciation_date->toDateString(),
            'acquisition_cost' => $acquisition_cost,
            'depreciation_amount' => $depreciation_amount,
            'book_value' => $book_value,
        ]);

        $equipmentDepreciations = EquipmentDepreciation::query()
            ->where('equipment_id', $equipment->id)
            ->where('depreciation_date', $depreciation_date)
            ->where('acquisition_cost', $acquisition_cost)
            ->where('depreciation_amount', $depreciation_amount)
            ->where('book_value', $book_value)
            ->get();
        $this->assertCount(1, $equipmentDepreciations);
        $equipmentDepreciation = $equipmentDepreciations->first();

        $response->assertRedirect(route('equipmentDepreciations.index'));
        $response->assertSessionHas('equipmentDepreciation.id', $equipmentDepreciation->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $equipmentDepreciation = EquipmentDepreciation::factory()->create();

        $response = $this->get(route('equipment-depreciations.show', $equipmentDepreciation));

        $response->assertOk();
        $response->assertViewIs('equipmentDepreciation.show');
        $response->assertViewHas('equipmentDepreciation', $equipmentDepreciation);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $equipmentDepreciation = EquipmentDepreciation::factory()->create();

        $response = $this->get(route('equipment-depreciations.edit', $equipmentDepreciation));

        $response->assertOk();
        $response->assertViewIs('equipmentDepreciation.edit');
        $response->assertViewHas('equipmentDepreciation', $equipmentDepreciation);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentDepreciationController::class,
            'update',
            EquipmentDepreciationControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $equipmentDepreciation = EquipmentDepreciation::factory()->create();
        $equipment = Equipment::factory()->create();
        $depreciation_date = Carbon::parse(fake()->date());
        $acquisition_cost = fake()->randomFloat(/** decimal_attributes **/);
        $depreciation_amount = fake()->randomFloat(/** decimal_attributes **/);
        $book_value = fake()->randomFloat(/** decimal_attributes **/);

        $response = $this->put(route('equipment-depreciations.update', $equipmentDepreciation), [
            'equipment_id' => $equipment->id,
            'depreciation_date' => $depreciation_date->toDateString(),
            'acquisition_cost' => $acquisition_cost,
            'depreciation_amount' => $depreciation_amount,
            'book_value' => $book_value,
        ]);

        $equipmentDepreciation->refresh();

        $response->assertRedirect(route('equipmentDepreciations.index'));
        $response->assertSessionHas('equipmentDepreciation.id', $equipmentDepreciation->id);

        $this->assertEquals($equipment->id, $equipmentDepreciation->equipment_id);
        $this->assertEquals($depreciation_date, $equipmentDepreciation->depreciation_date);
        $this->assertEquals($acquisition_cost, $equipmentDepreciation->acquisition_cost);
        $this->assertEquals($depreciation_amount, $equipmentDepreciation->depreciation_amount);
        $this->assertEquals($book_value, $equipmentDepreciation->book_value);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $equipmentDepreciation = EquipmentDepreciation::factory()->create();

        $response = $this->delete(route('equipment-depreciations.destroy', $equipmentDepreciation));

        $response->assertRedirect(route('equipmentDepreciations.index'));

        $this->assertModelMissing($equipmentDepreciation);
    }
}
