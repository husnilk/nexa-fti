<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\OvertimeApprovalLogController;
use App\Http\Requests\OvertimeApprovalLogControllerStoreRequest;
use App\Http\Requests\OvertimeApprovalLogControllerUpdateRequest;
use App\Models\Approver;
use App\Models\Employee;
use App\Models\OvertimeApprovalLog;
use App\Models\OvertimeRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see OvertimeApprovalLogController
 */
final class OvertimeApprovalLogControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $overtimeApprovalLogs = OvertimeApprovalLog::factory()->count(3)->create();

        $response = $this->get(route('overtime-approval-logs.index'));

        $response->assertOk();
        $response->assertViewIs('overtimeApprovalLog.index');
        $response->assertViewHas('overtimeApprovalLogs', $overtimeApprovalLogs);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('overtime-approval-logs.create'));

        $response->assertOk();
        $response->assertViewIs('overtimeApprovalLog.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            OvertimeApprovalLogController::class,
            'store',
            OvertimeApprovalLogControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $overtime_request = OvertimeRequest::factory()->create();
        $approver = Approver::factory()->create();
        $status = fake()->randomElement(/** enum_attributes **/);
        $action_date = Carbon::parse(fake()->dateTime());
        $employee = Employee::factory()->create();

        $response = $this->post(route('overtime-approval-logs.store'), [
            'overtime_request_id' => $overtime_request->id,
            'approver_id' => $approver->id,
            'status' => $status,
            'action_date' => $action_date->toDateTimeString(),
            'employee_id' => $employee->id,
        ]);

        $overtimeApprovalLogs = OvertimeApprovalLog::query()
            ->where('overtime_request_id', $overtime_request->id)
            ->where('approver_id', $approver->id)
            ->where('status', $status)
            ->where('action_date', $action_date)
            ->where('employee_id', $employee->id)
            ->get();
        $this->assertCount(1, $overtimeApprovalLogs);
        $overtimeApprovalLog = $overtimeApprovalLogs->first();

        $response->assertRedirect(route('overtimeApprovalLogs.index'));
        $response->assertSessionHas('overtimeApprovalLog.id', $overtimeApprovalLog->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $overtimeApprovalLog = OvertimeApprovalLog::factory()->create();

        $response = $this->get(route('overtime-approval-logs.show', $overtimeApprovalLog));

        $response->assertOk();
        $response->assertViewIs('overtimeApprovalLog.show');
        $response->assertViewHas('overtimeApprovalLog', $overtimeApprovalLog);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $overtimeApprovalLog = OvertimeApprovalLog::factory()->create();

        $response = $this->get(route('overtime-approval-logs.edit', $overtimeApprovalLog));

        $response->assertOk();
        $response->assertViewIs('overtimeApprovalLog.edit');
        $response->assertViewHas('overtimeApprovalLog', $overtimeApprovalLog);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            OvertimeApprovalLogController::class,
            'update',
            OvertimeApprovalLogControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $overtimeApprovalLog = OvertimeApprovalLog::factory()->create();
        $overtime_request = OvertimeRequest::factory()->create();
        $approver = Approver::factory()->create();
        $status = fake()->randomElement(/** enum_attributes **/);
        $action_date = Carbon::parse(fake()->dateTime());
        $employee = Employee::factory()->create();

        $response = $this->put(route('overtime-approval-logs.update', $overtimeApprovalLog), [
            'overtime_request_id' => $overtime_request->id,
            'approver_id' => $approver->id,
            'status' => $status,
            'action_date' => $action_date->toDateTimeString(),
            'employee_id' => $employee->id,
        ]);

        $overtimeApprovalLog->refresh();

        $response->assertRedirect(route('overtimeApprovalLogs.index'));
        $response->assertSessionHas('overtimeApprovalLog.id', $overtimeApprovalLog->id);

        $this->assertEquals($overtime_request->id, $overtimeApprovalLog->overtime_request_id);
        $this->assertEquals($approver->id, $overtimeApprovalLog->approver_id);
        $this->assertEquals($status, $overtimeApprovalLog->status);
        $this->assertEquals($action_date->timestamp, $overtimeApprovalLog->action_date);
        $this->assertEquals($employee->id, $overtimeApprovalLog->employee_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $overtimeApprovalLog = OvertimeApprovalLog::factory()->create();

        $response = $this->delete(route('overtime-approval-logs.destroy', $overtimeApprovalLog));

        $response->assertRedirect(route('overtimeApprovalLogs.index'));

        $this->assertModelMissing($overtimeApprovalLog);
    }
}
