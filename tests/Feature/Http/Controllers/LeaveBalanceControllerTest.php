<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\LeaveBalanceController;
use App\Http\Requests\LeaveBalanceControllerStoreRequest;
use App\Http\Requests\LeaveBalanceControllerUpdateRequest;
use App\Models\Employee;
use App\Models\LeaveBalance;
use App\Models\LeaveType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see LeaveBalanceController
 */
final class LeaveBalanceControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $leaveBalances = LeaveBalance::factory()->count(3)->create();

        $response = $this->get(route('leave-balances.index'));

        $response->assertOk();
        $response->assertViewIs('leaveBalance.index');
        $response->assertViewHas('leaveBalances', $leaveBalances);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('leave-balances.create'));

        $response->assertOk();
        $response->assertViewIs('leaveBalance.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            LeaveBalanceController::class,
            'store',
            LeaveBalanceControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $employee = Employee::factory()->create();
        $leave_type = LeaveType::factory()->create();
        $year = fake()->year();
        $quota = fake()->numberBetween(-10000, 10000);
        $used = fake()->numberBetween(-10000, 10000);
        $remaining = fake()->numberBetween(-10000, 10000);

        $response = $this->post(route('leave-balances.store'), [
            'employee_id' => $employee->id,
            'leave_type_id' => $leave_type->id,
            'year' => $year,
            'quota' => $quota,
            'used' => $used,
            'remaining' => $remaining,
        ]);

        $leaveBalances = LeaveBalance::query()
            ->where('employee_id', $employee->id)
            ->where('leave_type_id', $leave_type->id)
            ->where('year', $year)
            ->where('quota', $quota)
            ->where('used', $used)
            ->where('remaining', $remaining)
            ->get();
        $this->assertCount(1, $leaveBalances);
        $leaveBalance = $leaveBalances->first();

        $response->assertRedirect(route('leaveBalances.index'));
        $response->assertSessionHas('leaveBalance.id', $leaveBalance->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $leaveBalance = LeaveBalance::factory()->create();

        $response = $this->get(route('leave-balances.show', $leaveBalance));

        $response->assertOk();
        $response->assertViewIs('leaveBalance.show');
        $response->assertViewHas('leaveBalance', $leaveBalance);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $leaveBalance = LeaveBalance::factory()->create();

        $response = $this->get(route('leave-balances.edit', $leaveBalance));

        $response->assertOk();
        $response->assertViewIs('leaveBalance.edit');
        $response->assertViewHas('leaveBalance', $leaveBalance);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            LeaveBalanceController::class,
            'update',
            LeaveBalanceControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $leaveBalance = LeaveBalance::factory()->create();
        $employee = Employee::factory()->create();
        $leave_type = LeaveType::factory()->create();
        $year = fake()->year();
        $quota = fake()->numberBetween(-10000, 10000);
        $used = fake()->numberBetween(-10000, 10000);
        $remaining = fake()->numberBetween(-10000, 10000);

        $response = $this->put(route('leave-balances.update', $leaveBalance), [
            'employee_id' => $employee->id,
            'leave_type_id' => $leave_type->id,
            'year' => $year,
            'quota' => $quota,
            'used' => $used,
            'remaining' => $remaining,
        ]);

        $leaveBalance->refresh();

        $response->assertRedirect(route('leaveBalances.index'));
        $response->assertSessionHas('leaveBalance.id', $leaveBalance->id);

        $this->assertEquals($employee->id, $leaveBalance->employee_id);
        $this->assertEquals($leave_type->id, $leaveBalance->leave_type_id);
        $this->assertEquals($year, $leaveBalance->year);
        $this->assertEquals($quota, $leaveBalance->quota);
        $this->assertEquals($used, $leaveBalance->used);
        $this->assertEquals($remaining, $leaveBalance->remaining);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $leaveBalance = LeaveBalance::factory()->create();

        $response = $this->delete(route('leave-balances.destroy', $leaveBalance));

        $response->assertRedirect(route('leaveBalances.index'));

        $this->assertModelMissing($leaveBalance);
    }
}
