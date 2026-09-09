<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EquipmentDistributionController;
use App\Http\Requests\EquipmentDistributionControllerStoreRequest;
use App\Http\Requests\EquipmentDistributionControllerUpdateRequest;
use App\Models\Equipment;
use App\Models\EquipmentDistribution;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EquipmentDistributionController
 */
final class EquipmentDistributionControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $equipmentDistributions = EquipmentDistribution::factory()->count(3)->create();

        $response = $this->get(route('equipment-distributions.index'));

        $response->assertOk();
        $response->assertViewIs('equipmentDistribution.index');
        $response->assertViewHas('equipmentDistributions', $equipmentDistributions);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('equipment-distributions.create'));

        $response->assertOk();
        $response->assertViewIs('equipmentDistribution.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentDistributionController::class,
            'store',
            EquipmentDistributionControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $equipment = Equipment::factory()->create();
        $assigned_date = Carbon::parse(fake()->date());
        $status = fake()->randomElement(/** enum_attributes **/);

        $response = $this->post(route('equipment-distributions.store'), [
            'equipment_id' => $equipment->id,
            'assigned_date' => $assigned_date->toDateString(),
            'status' => $status,
        ]);

        $equipmentDistributions = EquipmentDistribution::query()
            ->where('equipment_id', $equipment->id)
            ->where('assigned_date', $assigned_date)
            ->where('status', $status)
            ->get();
        $this->assertCount(1, $equipmentDistributions);
        $equipmentDistribution = $equipmentDistributions->first();

        $response->assertRedirect(route('equipmentDistributions.index'));
        $response->assertSessionHas('equipmentDistribution.id', $equipmentDistribution->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $equipmentDistribution = EquipmentDistribution::factory()->create();

        $response = $this->get(route('equipment-distributions.show', $equipmentDistribution));

        $response->assertOk();
        $response->assertViewIs('equipmentDistribution.show');
        $response->assertViewHas('equipmentDistribution', $equipmentDistribution);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $equipmentDistribution = EquipmentDistribution::factory()->create();

        $response = $this->get(route('equipment-distributions.edit', $equipmentDistribution));

        $response->assertOk();
        $response->assertViewIs('equipmentDistribution.edit');
        $response->assertViewHas('equipmentDistribution', $equipmentDistribution);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentDistributionController::class,
            'update',
            EquipmentDistributionControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $equipmentDistribution = EquipmentDistribution::factory()->create();
        $equipment = Equipment::factory()->create();
        $assigned_date = Carbon::parse(fake()->date());
        $status = fake()->randomElement(/** enum_attributes **/);

        $response = $this->put(route('equipment-distributions.update', $equipmentDistribution), [
            'equipment_id' => $equipment->id,
            'assigned_date' => $assigned_date->toDateString(),
            'status' => $status,
        ]);

        $equipmentDistribution->refresh();

        $response->assertRedirect(route('equipmentDistributions.index'));
        $response->assertSessionHas('equipmentDistribution.id', $equipmentDistribution->id);

        $this->assertEquals($equipment->id, $equipmentDistribution->equipment_id);
        $this->assertEquals($assigned_date, $equipmentDistribution->assigned_date);
        $this->assertEquals($status, $equipmentDistribution->status);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $equipmentDistribution = EquipmentDistribution::factory()->create();

        $response = $this->delete(route('equipment-distributions.destroy', $equipmentDistribution));

        $response->assertRedirect(route('equipmentDistributions.index'));

        $this->assertModelMissing($equipmentDistribution);
    }
}
