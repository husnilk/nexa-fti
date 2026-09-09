<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EquipmentMaintenanceActivityController;
use App\Http\Requests\EquipmentMaintenanceActivityControllerStoreRequest;
use App\Http\Requests\EquipmentMaintenanceActivityControllerUpdateRequest;
use App\Models\EquipmentMaintenanceActivity;
use App\Models\EquipmentMaintenanceRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EquipmentMaintenanceActivityController
 */
final class EquipmentMaintenanceActivityControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $equipmentMaintenanceActivities = EquipmentMaintenanceActivity::factory()->count(3)->create();

        $response = $this->get(route('equipment-maintenance-activities.index'));

        $response->assertOk();
        $response->assertViewIs('equipmentMaintenanceActivity.index');
        $response->assertViewHas('equipmentMaintenanceActivities', $equipmentMaintenanceActivities);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('equipment-maintenance-activities.create'));

        $response->assertOk();
        $response->assertViewIs('equipmentMaintenanceActivity.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentMaintenanceActivityController::class,
            'store',
            EquipmentMaintenanceActivityControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $equipment_maintenance_request = EquipmentMaintenanceRequest::factory()->create();
        $activity_date = Carbon::parse(fake()->dateTime());
        $description = fake()->text();
        $status = fake()->randomElement(/** enum_attributes **/);

        $response = $this->post(route('equipment-maintenance-activities.store'), [
            'equipment_maintenance_request_id' => $equipment_maintenance_request->id,
            'activity_date' => $activity_date->toDateTimeString(),
            'description' => $description,
            'status' => $status,
        ]);

        $equipmentMaintenanceActivities = EquipmentMaintenanceActivity::query()
            ->where('equipment_maintenance_request_id', $equipment_maintenance_request->id)
            ->where('activity_date', $activity_date)
            ->where('description', $description)
            ->where('status', $status)
            ->get();
        $this->assertCount(1, $equipmentMaintenanceActivities);
        $equipmentMaintenanceActivity = $equipmentMaintenanceActivities->first();

        $response->assertRedirect(route('equipmentMaintenanceActivities.index'));
        $response->assertSessionHas('equipmentMaintenanceActivity.id', $equipmentMaintenanceActivity->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $equipmentMaintenanceActivity = EquipmentMaintenanceActivity::factory()->create();

        $response = $this->get(route('equipment-maintenance-activities.show', $equipmentMaintenanceActivity));

        $response->assertOk();
        $response->assertViewIs('equipmentMaintenanceActivity.show');
        $response->assertViewHas('equipmentMaintenanceActivity', $equipmentMaintenanceActivity);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $equipmentMaintenanceActivity = EquipmentMaintenanceActivity::factory()->create();

        $response = $this->get(route('equipment-maintenance-activities.edit', $equipmentMaintenanceActivity));

        $response->assertOk();
        $response->assertViewIs('equipmentMaintenanceActivity.edit');
        $response->assertViewHas('equipmentMaintenanceActivity', $equipmentMaintenanceActivity);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentMaintenanceActivityController::class,
            'update',
            EquipmentMaintenanceActivityControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $equipmentMaintenanceActivity = EquipmentMaintenanceActivity::factory()->create();
        $equipment_maintenance_request = EquipmentMaintenanceRequest::factory()->create();
        $activity_date = Carbon::parse(fake()->dateTime());
        $description = fake()->text();
        $status = fake()->randomElement(/** enum_attributes **/);

        $response = $this->put(route('equipment-maintenance-activities.update', $equipmentMaintenanceActivity), [
            'equipment_maintenance_request_id' => $equipment_maintenance_request->id,
            'activity_date' => $activity_date->toDateTimeString(),
            'description' => $description,
            'status' => $status,
        ]);

        $equipmentMaintenanceActivity->refresh();

        $response->assertRedirect(route('equipmentMaintenanceActivities.index'));
        $response->assertSessionHas('equipmentMaintenanceActivity.id', $equipmentMaintenanceActivity->id);

        $this->assertEquals($equipment_maintenance_request->id, $equipmentMaintenanceActivity->equipment_maintenance_request_id);
        $this->assertEquals($activity_date, $equipmentMaintenanceActivity->activity_date);
        $this->assertEquals($description, $equipmentMaintenanceActivity->description);
        $this->assertEquals($status, $equipmentMaintenanceActivity->status);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $equipmentMaintenanceActivity = EquipmentMaintenanceActivity::factory()->create();

        $response = $this->delete(route('equipment-maintenance-activities.destroy', $equipmentMaintenanceActivity));

        $response->assertRedirect(route('equipmentMaintenanceActivities.index'));

        $this->assertModelMissing($equipmentMaintenanceActivity);
    }
}
