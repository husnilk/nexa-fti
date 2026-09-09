<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EquipmentAuditController;
use App\Http\Requests\EquipmentAuditControllerStoreRequest;
use App\Http\Requests\EquipmentAuditControllerUpdateRequest;
use App\Models\ConductedBy;
use App\Models\Employee;
use App\Models\EquipmentAudit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EquipmentAuditController
 */
final class EquipmentAuditControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $equipmentAudits = EquipmentAudit::factory()->count(3)->create();

        $response = $this->get(route('equipment-audits.index'));

        $response->assertOk();
        $response->assertViewIs('equipmentAudit.index');
        $response->assertViewHas('equipmentAudits', $equipmentAudits);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('equipment-audits.create'));

        $response->assertOk();
        $response->assertViewIs('equipmentAudit.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentAuditController::class,
            'store',
            EquipmentAuditControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $audit_number = fake()->word();
        $audit_date = Carbon::parse(fake()->date());
        $conducted_by = ConductedBy::factory()->create();
        $conducted_by = Employee::factory()->create();

        $response = $this->post(route('equipment-audits.store'), [
            'audit_number' => $audit_number,
            'audit_date' => $audit_date->toDateString(),
            'conducted_by' => $conducted_by->id,
            'conducted_by_id' => $conducted_by->id,
        ]);

        $equipmentAudits = EquipmentAudit::query()
            ->where('audit_number', $audit_number)
            ->where('audit_date', $audit_date)
            ->where('conducted_by', $conducted_by->id)
            ->where('conducted_by_id', $conducted_by->id)
            ->get();
        $this->assertCount(1, $equipmentAudits);
        $equipmentAudit = $equipmentAudits->first();

        $response->assertRedirect(route('equipmentAudits.index'));
        $response->assertSessionHas('equipmentAudit.id', $equipmentAudit->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $equipmentAudit = EquipmentAudit::factory()->create();

        $response = $this->get(route('equipment-audits.show', $equipmentAudit));

        $response->assertOk();
        $response->assertViewIs('equipmentAudit.show');
        $response->assertViewHas('equipmentAudit', $equipmentAudit);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $equipmentAudit = EquipmentAudit::factory()->create();

        $response = $this->get(route('equipment-audits.edit', $equipmentAudit));

        $response->assertOk();
        $response->assertViewIs('equipmentAudit.edit');
        $response->assertViewHas('equipmentAudit', $equipmentAudit);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentAuditController::class,
            'update',
            EquipmentAuditControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $equipmentAudit = EquipmentAudit::factory()->create();
        $audit_number = fake()->word();
        $audit_date = Carbon::parse(fake()->date());
        $conducted_by = ConductedBy::factory()->create();
        $conducted_by = Employee::factory()->create();

        $response = $this->put(route('equipment-audits.update', $equipmentAudit), [
            'audit_number' => $audit_number,
            'audit_date' => $audit_date->toDateString(),
            'conducted_by' => $conducted_by->id,
            'conducted_by_id' => $conducted_by->id,
        ]);

        $equipmentAudit->refresh();

        $response->assertRedirect(route('equipmentAudits.index'));
        $response->assertSessionHas('equipmentAudit.id', $equipmentAudit->id);

        $this->assertEquals($audit_number, $equipmentAudit->audit_number);
        $this->assertEquals($audit_date, $equipmentAudit->audit_date);
        $this->assertEquals($conducted_by->id, $equipmentAudit->conducted_by);
        $this->assertEquals($conducted_by->id, $equipmentAudit->conducted_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $equipmentAudit = EquipmentAudit::factory()->create();

        $response = $this->delete(route('equipment-audits.destroy', $equipmentAudit));

        $response->assertRedirect(route('equipmentAudits.index'));

        $this->assertModelMissing($equipmentAudit);
    }
}
