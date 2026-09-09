<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EquipmentUsageController;
use App\Http\Requests\EquipmentUsageStoreRequest;
use App\Http\Requests\EquipmentUsageUpdateRequest;
use App\Models\Employee;
use App\Models\Equipment;
use App\Models\EquipmentUsage;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use Inertia\Testing\AssertableInertia as Assert;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EquipmentUsageController
 */
final class EquipmentUsageControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        Employee::factory()->create(['id' => $this->user->id]);

        Permission::findOrCreate('equipment.borrow', 'web');
        Permission::findOrCreate('equipment.manage', 'web');

        $this->user->givePermissionTo(['equipment.borrow', 'equipment.manage']);
    }

    #[Test]
    public function index_displays_view(): void
    {
        $equipment = Equipment::factory()->create();
        $equipmentUsages = EquipmentUsage::factory()->count(3)->create([
            'equipment_id' => $equipment->id,
            'borrower_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)->get(route('equipment-usages.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('equipment/usages/index'));
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->actingAs($this->user)->get(route('equipment-usages.create'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('equipment/usages/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentUsageController::class,
            'store',
            EquipmentUsageStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $this->withoutExceptionHandling();
        $equipment = Equipment::factory()->create(['status' => 'available']);
        $planned_start_date = Carbon::now()->addDay();
        $planned_return_date = Carbon::now()->addDays(3);
        $purpose = fake()->sentence();

        $response = $this->actingAs($this->user)->post(route('equipment-usages.store'), [
            'equipment_id' => $equipment->id,
            'planned_start_date' => $planned_start_date->toDateTimeString(),
            'planned_return_date' => $planned_return_date->toDateTimeString(),
            'purpose' => $purpose,
        ]);

        $equipmentUsages = EquipmentUsage::query()
            ->where('equipment_id', $equipment->id)
            ->where('purpose', $purpose)
            ->get();
        $this->assertCount(1, $equipmentUsages);
        $equipmentUsage = $equipmentUsages->first();

        $response->assertRedirect(route('equipment-usages.index'));
    }

    #[Test]
    public function show_displays_view(): void
    {
        $equipment = Equipment::factory()->create();
        $equipmentUsage = EquipmentUsage::factory()->create([
            'equipment_id' => $equipment->id,
            'borrower_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)->get(route('equipment-usages.show', $equipmentUsage));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('equipment/usages/show'));
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $equipment = Equipment::factory()->create();
        $equipmentUsage = EquipmentUsage::factory()->create([
            'equipment_id' => $equipment->id,
            'borrower_id' => $this->user->id,
            'status' => 'requested',
        ]);

        $response = $this->actingAs($this->user)->get(route('equipment-usages.edit', $equipmentUsage));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('equipment/usages/edit'));
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentUsageController::class,
            'update',
            EquipmentUsageUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $this->withoutExceptionHandling();
        $equipment = Equipment::factory()->create();
        $equipmentUsage = EquipmentUsage::factory()->create([
            'equipment_id' => $equipment->id,
            'borrower_id' => $this->user->id,
            'status' => 'requested',
        ]);

        $newEquipment = Equipment::factory()->create();
        $planned_start_date = Carbon::now()->addDay();
        $planned_return_date = Carbon::now()->addDays(3);
        $purpose = fake()->sentence();

        $response = $this->actingAs($this->user)->put(route('equipment-usages.update', $equipmentUsage), [
            'equipment_id' => $newEquipment->id,
            'planned_start_date' => $planned_start_date->toDateTimeString(),
            'planned_return_date' => $planned_return_date->toDateTimeString(),
            'purpose' => $purpose,
        ]);

        $equipmentUsage->refresh();

        $response->assertRedirect(route('equipment-usages.index'));

        $this->assertEquals($newEquipment->id, $equipmentUsage->equipment_id);
        $this->assertEquals($planned_start_date->toDateTimeString(), $equipmentUsage->planned_start_date->toDateTimeString());
        $this->assertEquals($planned_return_date->toDateTimeString(), $equipmentUsage->planned_return_date->toDateTimeString());
        $this->assertEquals($purpose, $equipmentUsage->purpose);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $equipment = Equipment::factory()->create();
        $equipmentUsage = EquipmentUsage::factory()->create([
            'equipment_id' => $equipment->id,
            'borrower_id' => $this->user->id,
            'status' => 'requested',
        ]);

        $response = $this->actingAs($this->user)->delete(route('equipment-usages.destroy', $equipmentUsage));

        $response->assertRedirect(route('equipment-usages.index'));

        $this->assertModelMissing($equipmentUsage);
    }
}
