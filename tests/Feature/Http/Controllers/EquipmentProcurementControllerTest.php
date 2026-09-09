<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EquipmentProcurementController;
use App\Http\Requests\EquipmentProcurementControllerStoreRequest;
use App\Http\Requests\EquipmentProcurementControllerUpdateRequest;
use App\Models\Employee;
use App\Models\EquipmentProcurement;
use App\Models\RequestedBy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EquipmentProcurementController
 */
final class EquipmentProcurementControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $equipmentProcurements = EquipmentProcurement::factory()->count(3)->create();

        $response = $this->get(route('equipment-procurements.index'));

        $response->assertOk();
        $response->assertViewIs('equipmentProcurement.index');
        $response->assertViewHas('equipmentProcurements', $equipmentProcurements);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('equipment-procurements.create'));

        $response->assertOk();
        $response->assertViewIs('equipmentProcurement.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentProcurementController::class,
            'store',
            EquipmentProcurementControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $procurement_number = fake()->word();
        $title = fake()->sentence(4);
        $requested_by = RequestedBy::factory()->create();
        $request_date = Carbon::parse(fake()->date());
        $status = fake()->randomElement(/** enum_attributes **/);
        $requested_by = Employee::factory()->create();
        $approved_by = Employee::factory()->create();

        $response = $this->post(route('equipment-procurements.store'), [
            'procurement_number' => $procurement_number,
            'title' => $title,
            'requested_by' => $requested_by->id,
            'request_date' => $request_date->toDateString(),
            'status' => $status,
            'requested_by_id' => $requested_by->id,
            'approved_by_id' => $approved_by->id,
        ]);

        $equipmentProcurements = EquipmentProcurement::query()
            ->where('procurement_number', $procurement_number)
            ->where('title', $title)
            ->where('requested_by', $requested_by->id)
            ->where('request_date', $request_date)
            ->where('status', $status)
            ->where('requested_by_id', $requested_by->id)
            ->where('approved_by_id', $approved_by->id)
            ->get();
        $this->assertCount(1, $equipmentProcurements);
        $equipmentProcurement = $equipmentProcurements->first();

        $response->assertRedirect(route('equipmentProcurements.index'));
        $response->assertSessionHas('equipmentProcurement.id', $equipmentProcurement->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $equipmentProcurement = EquipmentProcurement::factory()->create();

        $response = $this->get(route('equipment-procurements.show', $equipmentProcurement));

        $response->assertOk();
        $response->assertViewIs('equipmentProcurement.show');
        $response->assertViewHas('equipmentProcurement', $equipmentProcurement);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $equipmentProcurement = EquipmentProcurement::factory()->create();

        $response = $this->get(route('equipment-procurements.edit', $equipmentProcurement));

        $response->assertOk();
        $response->assertViewIs('equipmentProcurement.edit');
        $response->assertViewHas('equipmentProcurement', $equipmentProcurement);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentProcurementController::class,
            'update',
            EquipmentProcurementControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $equipmentProcurement = EquipmentProcurement::factory()->create();
        $procurement_number = fake()->word();
        $title = fake()->sentence(4);
        $requested_by = RequestedBy::factory()->create();
        $request_date = Carbon::parse(fake()->date());
        $status = fake()->randomElement(/** enum_attributes **/);
        $requested_by = Employee::factory()->create();
        $approved_by = Employee::factory()->create();

        $response = $this->put(route('equipment-procurements.update', $equipmentProcurement), [
            'procurement_number' => $procurement_number,
            'title' => $title,
            'requested_by' => $requested_by->id,
            'request_date' => $request_date->toDateString(),
            'status' => $status,
            'requested_by_id' => $requested_by->id,
            'approved_by_id' => $approved_by->id,
        ]);

        $equipmentProcurement->refresh();

        $response->assertRedirect(route('equipmentProcurements.index'));
        $response->assertSessionHas('equipmentProcurement.id', $equipmentProcurement->id);

        $this->assertEquals($procurement_number, $equipmentProcurement->procurement_number);
        $this->assertEquals($title, $equipmentProcurement->title);
        $this->assertEquals($requested_by->id, $equipmentProcurement->requested_by);
        $this->assertEquals($request_date, $equipmentProcurement->request_date);
        $this->assertEquals($status, $equipmentProcurement->status);
        $this->assertEquals($requested_by->id, $equipmentProcurement->requested_by_id);
        $this->assertEquals($approved_by->id, $equipmentProcurement->approved_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $equipmentProcurement = EquipmentProcurement::factory()->create();

        $response = $this->delete(route('equipment-procurements.destroy', $equipmentProcurement));

        $response->assertRedirect(route('equipmentProcurements.index'));

        $this->assertModelMissing($equipmentProcurement);
    }
}
