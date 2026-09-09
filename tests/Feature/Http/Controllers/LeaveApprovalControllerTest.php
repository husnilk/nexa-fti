<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);

    // Create an employee and associate it with a user
    $this->employee = Employee::factory()->create();
    $this->user = User::find($this->employee->id);

    Permission::findOrCreate('leave.approval', 'web');
    $this->user->givePermissionTo('leave.approval');

    $this->requester = Employee::factory()->create();
    $this->leaveType = LeaveType::factory()->create();
});

test('guest users cannot access approvals index', function () {
    $response = $this->get(route('leave-approvals.index'));
    $response->assertRedirect(route('login'));
});

test('users without leave.approval permission cannot access approvals index', function () {
    $nonApproverEmployee = Employee::factory()->create();
    $nonApproverUser = User::find($nonApproverEmployee->id);

    $response = $this->actingAs($nonApproverUser)->get(route('leave-approvals.index'));
    $response->assertStatus(403);
});

test('users with leave.approval permission can access approvals index and see assigned requests', function () {
    // Leave request where user is approver
    $assignedRequest = LeaveRequest::create([
        'employee_id' => $this->requester->id,
        'leave_type_id' => $this->leaveType->id,
        'start_date' => now()->addDay(),
        'end_date' => now()->addDays(3),
        'total_days' => 3,
        'reason' => 'Vacation',
        'status' => 'pending',
    ]);
    $assignedRequest->leaveApprovals()->create([
        'approver_id' => $this->employee->id,
        'level' => 1,
        'status' => 'pending',
    ]);

    // Leave request where user is NOT approver
    $anotherApprover = Employee::factory()->create();
    $unassignedRequest = LeaveRequest::create([
        'employee_id' => $this->requester->id,
        'leave_type_id' => $this->leaveType->id,
        'start_date' => now()->addDay(),
        'end_date' => now()->addDays(3),
        'total_days' => 3,
        'reason' => 'Sick',
        'status' => 'pending',
    ]);
    $unassignedRequest->leaveApprovals()->create([
        'approver_id' => $anotherApprover->id,
        'level' => 1,
        'status' => 'pending',
    ]);

    $response = $this->actingAs($this->user)->get(route('leave-approvals.index'));
    $response->assertOk();

    $response->assertInertia(function ($page) use ($assignedRequest, $unassignedRequest) {
        $requests = $page->toArray()['props']['leaveRequests']['data'];
        $ids = collect($requests)->pluck('id')->all();
        expect($ids)->toContain($assignedRequest->id);
        expect($ids)->not->toContain($unassignedRequest->id);
    });
});

test('users can view detail of a leave request they are assigned to', function () {
    $leaveRequest = LeaveRequest::create([
        'employee_id' => $this->requester->id,
        'leave_type_id' => $this->leaveType->id,
        'start_date' => now()->addDay(),
        'end_date' => now()->addDays(3),
        'total_days' => 3,
        'reason' => 'Vacation',
        'status' => 'pending',
    ]);
    $leaveRequest->leaveApprovals()->create([
        'approver_id' => $this->employee->id,
        'level' => 1,
        'status' => 'pending',
    ]);

    $response = $this->actingAs($this->user)->get(route('leave-approvals.show', $leaveRequest));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('leave-approvals/show'));
});

test('users cannot view detail of a leave request they are not assigned to', function () {
    $anotherApprover = Employee::factory()->create();
    $leaveRequest = LeaveRequest::create([
        'employee_id' => $this->requester->id,
        'leave_type_id' => $this->leaveType->id,
        'start_date' => now()->addDay(),
        'end_date' => now()->addDays(3),
        'total_days' => 3,
        'reason' => 'Vacation',
        'status' => 'pending',
    ]);
    $leaveRequest->leaveApprovals()->create([
        'approver_id' => $anotherApprover->id,
        'level' => 1,
        'status' => 'pending',
    ]);

    $response = $this->actingAs($this->user)->get(route('leave-approvals.show', $leaveRequest));
    $response->assertStatus(403);
});

test('level 1 approver can approve the request sequentially', function () {
    $anotherApprover = Employee::factory()->create();
    $leaveRequest = LeaveRequest::create([
        'employee_id' => $this->requester->id,
        'leave_type_id' => $this->leaveType->id,
        'start_date' => now()->addDay(),
        'end_date' => now()->addDays(3),
        'total_days' => 3,
        'reason' => 'Vacation',
        'status' => 'pending',
    ]);
    $leaveRequest->leaveApprovals()->createMany([
        ['approver_id' => $this->employee->id, 'level' => 1, 'status' => 'pending'],
        ['approver_id' => $anotherApprover->id, 'level' => 2, 'status' => 'pending'],
    ]);

    $response = $this->actingAs($this->user)->post(route('leave-approvals.approve', $leaveRequest), [
        'notes' => 'L1 looks good',
    ]);

    $response->assertRedirect(route('leave-approvals.index'));

    $approval1 = $leaveRequest->leaveApprovals()->where('level', 1)->first();
    expect($approval1->status)->toBe('approved');
    expect($approval1->notes)->toBe('L1 looks good');

    $leaveRequest->refresh();
    expect($leaveRequest->status)->toBe('pending'); // Still pending because level 2 is pending
});

test('level 2 approver can approve to finalize the request', function () {
    $anotherApprover = Employee::factory()->create();
    $leaveRequest = LeaveRequest::create([
        'employee_id' => $this->requester->id,
        'leave_type_id' => $this->leaveType->id,
        'start_date' => now()->addDay(),
        'end_date' => now()->addDays(3),
        'total_days' => 3,
        'reason' => 'Vacation',
        'status' => 'pending',
    ]);
    $leaveRequest->leaveApprovals()->createMany([
        ['approver_id' => $anotherApprover->id, 'level' => 1, 'status' => 'approved', 'action_date' => now()],
        ['approver_id' => $this->employee->id, 'level' => 2, 'status' => 'pending'],
    ]);

    $response = $this->actingAs($this->user)->post(route('leave-approvals.approve', $leaveRequest), [
        'notes' => 'L2 finalized',
    ]);

    $response->assertRedirect(route('leave-approvals.index'));

    $approval2 = $leaveRequest->leaveApprovals()->where('level', 2)->first();
    expect($approval2->status)->toBe('approved');
    expect($approval2->notes)->toBe('L2 finalized');

    $leaveRequest->refresh();
    expect($leaveRequest->status)->toBe('approved'); // All levels approved
    expect($leaveRequest->approved_at)->not->toBeNull();
});

test('level 2 approver cannot approve while level 1 is pending', function () {
    $anotherApprover = Employee::factory()->create();
    $leaveRequest = LeaveRequest::create([
        'employee_id' => $this->requester->id,
        'leave_type_id' => $this->leaveType->id,
        'start_date' => now()->addDay(),
        'end_date' => now()->addDays(3),
        'total_days' => 3,
        'reason' => 'Vacation',
        'status' => 'pending',
    ]);
    $leaveRequest->leaveApprovals()->createMany([
        ['approver_id' => $anotherApprover->id, 'level' => 1, 'status' => 'pending'],
        ['approver_id' => $this->employee->id, 'level' => 2, 'status' => 'pending'],
    ]);

    $response = $this->actingAs($this->user)->post(route('leave-approvals.approve', $leaveRequest), [
        'notes' => 'Trying to skip order',
    ]);

    $response->assertStatus(403);
});

test('approver can reject the request', function () {
    $leaveRequest = LeaveRequest::create([
        'employee_id' => $this->requester->id,
        'leave_type_id' => $this->leaveType->id,
        'start_date' => now()->addDay(),
        'end_date' => now()->addDays(3),
        'total_days' => 3,
        'reason' => 'Vacation',
        'status' => 'pending',
    ]);
    $leaveRequest->leaveApprovals()->create([
        'approver_id' => $this->employee->id,
        'level' => 1,
        'status' => 'pending',
    ]);

    $response = $this->actingAs($this->user)->post(route('leave-approvals.reject', $leaveRequest), [
        'notes' => 'Rejected reason',
    ]);

    $response->assertRedirect(route('leave-approvals.index'));

    $approval1 = $leaveRequest->leaveApprovals()->where('level', 1)->first();
    expect($approval1->status)->toBe('rejected');
    expect($approval1->notes)->toBe('Rejected reason');

    $leaveRequest->refresh();
    expect($leaveRequest->status)->toBe('rejected');
});
