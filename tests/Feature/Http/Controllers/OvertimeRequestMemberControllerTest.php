<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\OvertimeRequestMemberController;
use App\Http\Requests\OvertimeRequestMemberControllerStoreRequest;
use App\Http\Requests\OvertimeRequestMemberControllerUpdateRequest;
use App\Models\Employee;
use App\Models\OvertimeRequest;
use App\Models\OvertimeRequestMember;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see OvertimeRequestMemberController
 */
final class OvertimeRequestMemberControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $overtimeRequestMembers = OvertimeRequestMember::factory()->count(3)->create();

        $response = $this->get(route('overtime-request-members.index'));

        $response->assertOk();
        $response->assertViewIs('overtimeRequestMember.index');
        $response->assertViewHas('overtimeRequestMembers', $overtimeRequestMembers);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('overtime-request-members.create'));

        $response->assertOk();
        $response->assertViewIs('overtimeRequestMember.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            OvertimeRequestMemberController::class,
            'store',
            OvertimeRequestMemberControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $overtime_request = OvertimeRequest::factory()->create();
        $employee = Employee::factory()->create();
        $planned_hours = fake()->randomFloat(/** decimal_attributes **/);
        $actual_start_time = Carbon::parse(fake()->dateTime());
        $actual_end_time = Carbon::parse(fake()->dateTime());
        $actual_hours = fake()->randomFloat(/** decimal_attributes **/);

        $response = $this->post(route('overtime-request-members.store'), [
            'overtime_request_id' => $overtime_request->id,
            'employee_id' => $employee->id,
            'planned_hours' => $planned_hours,
            'actual_start_time' => $actual_start_time->toDateTimeString(),
            'actual_end_time' => $actual_end_time->toDateTimeString(),
            'actual_hours' => $actual_hours,
        ]);

        $overtimeRequestMembers = OvertimeRequestMember::query()
            ->where('overtime_request_id', $overtime_request->id)
            ->where('employee_id', $employee->id)
            ->where('planned_hours', $planned_hours)
            ->where('actual_start_time', $actual_start_time)
            ->where('actual_end_time', $actual_end_time)
            ->where('actual_hours', $actual_hours)
            ->get();
        $this->assertCount(1, $overtimeRequestMembers);
        $overtimeRequestMember = $overtimeRequestMembers->first();

        $response->assertRedirect(route('overtimeRequestMembers.index'));
        $response->assertSessionHas('overtimeRequestMember.id', $overtimeRequestMember->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $overtimeRequestMember = OvertimeRequestMember::factory()->create();

        $response = $this->get(route('overtime-request-members.show', $overtimeRequestMember));

        $response->assertOk();
        $response->assertViewIs('overtimeRequestMember.show');
        $response->assertViewHas('overtimeRequestMember', $overtimeRequestMember);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $overtimeRequestMember = OvertimeRequestMember::factory()->create();

        $response = $this->get(route('overtime-request-members.edit', $overtimeRequestMember));

        $response->assertOk();
        $response->assertViewIs('overtimeRequestMember.edit');
        $response->assertViewHas('overtimeRequestMember', $overtimeRequestMember);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            OvertimeRequestMemberController::class,
            'update',
            OvertimeRequestMemberControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $overtimeRequestMember = OvertimeRequestMember::factory()->create();
        $overtime_request = OvertimeRequest::factory()->create();
        $employee = Employee::factory()->create();
        $planned_hours = fake()->randomFloat(/** decimal_attributes **/);
        $actual_start_time = Carbon::parse(fake()->dateTime());
        $actual_end_time = Carbon::parse(fake()->dateTime());
        $actual_hours = fake()->randomFloat(/** decimal_attributes **/);

        $response = $this->put(route('overtime-request-members.update', $overtimeRequestMember), [
            'overtime_request_id' => $overtime_request->id,
            'employee_id' => $employee->id,
            'planned_hours' => $planned_hours,
            'actual_start_time' => $actual_start_time->toDateTimeString(),
            'actual_end_time' => $actual_end_time->toDateTimeString(),
            'actual_hours' => $actual_hours,
        ]);

        $overtimeRequestMember->refresh();

        $response->assertRedirect(route('overtimeRequestMembers.index'));
        $response->assertSessionHas('overtimeRequestMember.id', $overtimeRequestMember->id);

        $this->assertEquals($overtime_request->id, $overtimeRequestMember->overtime_request_id);
        $this->assertEquals($employee->id, $overtimeRequestMember->employee_id);
        $this->assertEquals($planned_hours, $overtimeRequestMember->planned_hours);
        $this->assertEquals($actual_start_time, $overtimeRequestMember->actual_start_time);
        $this->assertEquals($actual_end_time, $overtimeRequestMember->actual_end_time);
        $this->assertEquals($actual_hours, $overtimeRequestMember->actual_hours);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $overtimeRequestMember = OvertimeRequestMember::factory()->create();

        $response = $this->delete(route('overtime-request-members.destroy', $overtimeRequestMember));

        $response->assertRedirect(route('overtimeRequestMembers.index'));

        $this->assertModelMissing($overtimeRequestMember);
    }
}
