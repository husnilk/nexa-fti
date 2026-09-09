<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EquipmentMaintenanceRequestController;
use App\Http\Requests\EquipmentMaintenanceRequestControllerStoreRequest;
use App\Http\Requests\EquipmentMaintenanceRequestControllerUpdateRequest;
use App\Models\Employee;
use App\Models\Equipment;
use App\Models\EquipmentMaintenanceRequest;
use App\Models\ReportedBy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EquipmentMaintenanceRequestController
 */
final class EquipmentMaintenanceRequestControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $equipmentMaintenanceRequests = EquipmentMaintenanceRequest::factory()->count(3)->create();

        $response = $this->get(route('equipment-maintenance-requests.index'));

        $response->assertOk();
        $response->assertViewIs('equipmentMaintenanceRequest.index');
        $response->assertViewHas('equipmentMaintenanceRequests', $equipmentMaintenanceRequests);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('equipment-maintenance-requests.create'));

        $response->assertOk();
        $response->assertViewIs('equipmentMaintenanceRequest.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentMaintenanceRequestController::class,
            'store',
            EquipmentMaintenanceRequestControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $equipment = Equipment::factory()->create();
        $reported_by = ReportedBy::factory()->create();
        $report_date = Carbon::parse(fake()->date());
        $problem_description = fake()->text();
        $priority = fake()->randomElement(/** enum_attributes **/);
        $status = fake()->randomElement(/** enum_attributes **/);
        $reported_by = Employee::factory()->create();

        $response = $this->post(route('equipment-maintenance-requests.store'), [
            'equipment_id' => $equipment->id,
            'reported_by' => $reported_by->id,
            'report_date' => $report_date->toDateString(),
            'problem_description' => $problem_description,
            'priority' => $priority,
            'status' => $status,
            'reported_by_id' => $reported_by->id,
        ]);

        $equipmentMaintenanceRequests = EquipmentMaintenanceRequest::query()
            ->where('equipment_id', $equipment->id)
            ->where('reported_by', $reported_by->id)
            ->where('report_date', $report_date)
            ->where('problem_description', $problem_description)
            ->where('priority', $priority)
            ->where('status', $status)
            ->where('reported_by_id', $reported_by->id)
            ->get();
        $this->assertCount(1, $equipmentMaintenanceRequests);
        $equipmentMaintenanceRequest = $equipmentMaintenanceRequests->first();

        $response->assertRedirect(route('equipmentMaintenanceRequests.index'));
        $response->assertSessionHas('equipmentMaintenanceRequest.id', $equipmentMaintenanceRequest->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $equipmentMaintenanceRequest = EquipmentMaintenanceRequest::factory()->create();

        $response = $this->get(route('equipment-maintenance-requests.show', $equipmentMaintenanceRequest));

        $response->assertOk();
        $response->assertViewIs('equipmentMaintenanceRequest.show');
        $response->assertViewHas('equipmentMaintenanceRequest', $equipmentMaintenanceRequest);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $equipmentMaintenanceRequest = EquipmentMaintenanceRequest::factory()->create();

        $response = $this->get(route('equipment-maintenance-requests.edit', $equipmentMaintenanceRequest));

        $response->assertOk();
        $response->assertViewIs('equipmentMaintenanceRequest.edit');
        $response->assertViewHas('equipmentMaintenanceRequest', $equipmentMaintenanceRequest);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentMaintenanceRequestController::class,
            'update',
            EquipmentMaintenanceRequestControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $equipmentMaintenanceRequest = EquipmentMaintenanceRequest::factory()->create();
        $equipment = Equipment::factory()->create();
        $reported_by = ReportedBy::factory()->create();
        $report_date = Carbon::parse(fake()->date());
        $problem_description = fake()->text();
        $priority = fake()->randomElement(/** enum_attributes **/);
        $status = fake()->randomElement(/** enum_attributes **/);
        $reported_by = Employee::factory()->create();

        $response = $this->put(route('equipment-maintenance-requests.update', $equipmentMaintenanceRequest), [
            'equipment_id' => $equipment->id,
            'reported_by' => $reported_by->id,
            'report_date' => $report_date->toDateString(),
            'problem_description' => $problem_description,
            'priority' => $priority,
            'status' => $status,
            'reported_by_id' => $reported_by->id,
        ]);

        $equipmentMaintenanceRequest->refresh();

        $response->assertRedirect(route('equipmentMaintenanceRequests.index'));
        $response->assertSessionHas('equipmentMaintenanceRequest.id', $equipmentMaintenanceRequest->id);

        $this->assertEquals($equipment->id, $equipmentMaintenanceRequest->equipment_id);
        $this->assertEquals($reported_by->id, $equipmentMaintenanceRequest->reported_by);
        $this->assertEquals($report_date, $equipmentMaintenanceRequest->report_date);
        $this->assertEquals($problem_description, $equipmentMaintenanceRequest->problem_description);
        $this->assertEquals($priority, $equipmentMaintenanceRequest->priority);
        $this->assertEquals($status, $equipmentMaintenanceRequest->status);
        $this->assertEquals($reported_by->id, $equipmentMaintenanceRequest->reported_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $equipmentMaintenanceRequest = EquipmentMaintenanceRequest::factory()->create();

        $response = $this->delete(route('equipment-maintenance-requests.destroy', $equipmentMaintenanceRequest));

        $response->assertRedirect(route('equipmentMaintenanceRequests.index'));

        $this->assertModelMissing($equipmentMaintenanceRequest);
    }
}
