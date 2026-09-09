<?php

use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->employee = Employee::factory()->create(['id' => $this->user->id]);

    Permission::findOrCreate('personal.manage', 'web');
});

test('guest cannot access personal leave requests', function () {
    $this->get(route('personal-leave-requests.index'))
        ->assertRedirect(route('login'));
});

test('user without personal.manage permission cannot access personal leave requests', function () {
    $unauthorizedUser = User::factory()->create();
    Employee::factory()->create(['id' => $unauthorizedUser->id]);

    $this->actingAs($unauthorizedUser)
        ->get(route('personal-leave-requests.index'))
        ->assertForbidden();
});

test('user with personal.manage permission but no employee profile gets forbidden', function () {
    $userWithoutEmployee = User::factory()->create();
    $userWithoutEmployee->givePermissionTo('personal.manage');

    $this->actingAs($userWithoutEmployee)
        ->get(route('personal-leave-requests.index'))
        ->assertForbidden();
});

test('authorized user can view personal leave requests index', function () {
    $this->user->givePermissionTo('personal.manage');

    $leaveType = LeaveType::factory()->create();
    $leaveRequest = LeaveRequest::factory()->create([
        'employee_id' => $this->employee->id,
        'leave_type_id' => $leaveType->id,
    ]);

    $this->actingAs($this->user)
        ->get(route('personal-leave-requests.index'))
        ->assertSuccessful();
});

test('authorized user can view create personal leave request page', function () {
    $this->user->givePermissionTo('personal.manage');

    $this->actingAs($this->user)
        ->get(route('personal-leave-requests.create'))
        ->assertSuccessful();
});

test('authorized user can submit new personal leave request', function () {
    $this->user->givePermissionTo('personal.manage');

    $leaveType = LeaveType::factory()->create();
    $approver1 = Employee::factory()->create();
    $approver2 = Employee::factory()->create();

    $data = [
        'leave_type_id' => $leaveType->id,
        'start_date' => now()->addDays(5)->format('Y-m-d'),
        'end_date' => now()->addDays(10)->format('Y-m-d'),
        'total_days' => 5,
        'reason' => 'Annual vacation',
        'address_leave' => '123 Beach Rd',
        'contact_leave' => '555-0199',
        'approver_level_1_id' => $approver1->id,
        'approver_level_2_id' => $approver2->id,
    ];

    $this->actingAs($this->user)
        ->post(route('personal-leave-requests.store'), $data)
        ->assertRedirect(route('personal-leave-requests.index'));

    $this->assertDatabaseHas('leave_requests', [
        'employee_id' => $this->employee->id,
        'leave_type_id' => $leaveType->id,
        'total_days' => 5,
        'reason' => 'Annual vacation',
        'status' => 'pending',
    ]);

    $leaveRequest = LeaveRequest::where('employee_id', $this->employee->id)->first();
    $this->assertCount(2, $leaveRequest->leaveApprovals);
    $this->assertDatabaseHas('leave_approvals', [
        'leave_request_id' => $leaveRequest->id,
        'approver_id' => $approver1->id,
        'level' => 1,
        'status' => 'pending',
    ]);
    $this->assertDatabaseHas('leave_approvals', [
        'leave_request_id' => $leaveRequest->id,
        'approver_id' => $approver2->id,
        'level' => 2,
        'status' => 'pending',
    ]);
});

test('authorized user can view details of their own leave request', function () {
    $this->user->givePermissionTo('personal.manage');

    $leaveType = LeaveType::factory()->create();
    $leaveRequest = LeaveRequest::factory()->create([
        'employee_id' => $this->employee->id,
        'leave_type_id' => $leaveType->id,
    ]);

    $this->actingAs($this->user)
        ->get(route('personal-leave-requests.show', $leaveRequest->id))
        ->assertSuccessful();
});

test('authorized user cannot view other employees leave requests', function () {
    $this->user->givePermissionTo('personal.manage');

    $otherEmployee = Employee::factory()->create();
    $leaveType = LeaveType::factory()->create();
    $otherRequest = LeaveRequest::factory()->create([
        'employee_id' => $otherEmployee->id,
        'leave_type_id' => $leaveType->id,
    ]);

    $this->actingAs($this->user)
        ->get(route('personal-leave-requests.show', $otherRequest->id))
        ->assertForbidden();
});
