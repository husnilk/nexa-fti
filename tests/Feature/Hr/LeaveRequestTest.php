<?php

namespace Tests\Feature\Hr;

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
    $this->user = User::factory()->create();
    Permission::findOrCreate('leave.view', 'web');
    Permission::findOrCreate('leave.manage', 'web');
    Permission::findOrCreate('leave.manage', 'web');
    $this->user->givePermissionTo(['leave.view', 'leave.manage', 'leave.manage']);

    $this->employee = Employee::factory()->create();
    $this->approver1 = Employee::factory()->create();
    $this->approver2 = Employee::factory()->create();
    $this->leaveType = LeaveType::factory()->create();
});

test('can submit a leave request with two levels of approval', function () {
    $response = $this->actingAs($this->user)
        ->post(route('leave-requests.store'), [
            'employee_id' => $this->employee->id,
            'leave_type_id' => $this->leaveType->id,
            'start_date' => now()->addDay()->format('Y-m-d'),
            'end_date' => now()->addDays(3)->format('Y-m-d'),
            'total_days' => 3,
            'reason' => 'Vacation',
            'approver_level_1_id' => $this->approver1->id,
            'approver_level_2_id' => $this->approver2->id,
        ]);

    $response->assertRedirect(route('leave-requests.index'));

    $leaveRequest = LeaveRequest::first();
    expect($leaveRequest->status)->toBe('pending');
    expect($leaveRequest->leaveApprovals)->toHaveCount(2);
    expect($leaveRequest->leaveApprovals->where('level', 1)->first()->approver_id)->toBe($this->approver1->id);
    expect($leaveRequest->leaveApprovals->where('level', 2)->first()->approver_id)->toBe($this->approver2->id);
});

test('can approve a leave request level 1', function () {
    $leaveRequest = LeaveRequest::create([
        'employee_id' => $this->employee->id,
        'leave_type_id' => $this->leaveType->id,
        'start_date' => now()->addDay(),
        'end_date' => now()->addDays(3),
        'total_days' => 3,
        'reason' => 'Vacation',
        'status' => 'pending',
    ]);

    $leaveRequest->leaveApprovals()->createMany([
        ['approver_id' => $this->approver1->id, 'level' => 1, 'status' => 'pending'],
        ['approver_id' => $this->approver2->id, 'level' => 2, 'status' => 'pending'],
    ]);

    $response = $this->actingAs($this->user)
        ->post(route('leave-requests.approve', $leaveRequest), [
            'notes' => 'Level 1 approved',
        ]);

    $response->assertRedirect();

    $approval1 = $leaveRequest->leaveApprovals()->where('level', 1)->first();
    expect($approval1->status)->toBe('approved');
    expect($approval1->notes)->toBe('Level 1 approved');

    $leaveRequest->refresh();
    expect($leaveRequest->status)->toBe('pending'); // Still pending until level 2
});

test('can approve a leave request level 2 and finalize', function () {
    $leaveRequest = LeaveRequest::create([
        'employee_id' => $this->employee->id,
        'leave_type_id' => $this->leaveType->id,
        'start_date' => now()->addDay(),
        'end_date' => now()->addDays(3),
        'total_days' => 3,
        'reason' => 'Vacation',
        'status' => 'pending',
    ]);

    $leaveRequest->leaveApprovals()->createMany([
        ['approver_id' => $this->approver1->id, 'level' => 1, 'status' => 'approved', 'action_date' => now()],
        ['approver_id' => $this->approver2->id, 'level' => 2, 'status' => 'pending'],
    ]);

    $response = $this->actingAs($this->user)
        ->post(route('leave-requests.approve', $leaveRequest), [
            'notes' => 'Level 2 approved',
        ]);

    $response->assertRedirect();

    $approval2 = $leaveRequest->leaveApprovals()->where('level', 2)->first();
    expect($approval2->status)->toBe('approved');

    $leaveRequest->refresh();
    expect($leaveRequest->status)->toBe('approved');
    expect($leaveRequest->approved_at)->not->toBeNull();
});

test('can reject a leave request', function () {
    $leaveRequest = LeaveRequest::create([
        'employee_id' => $this->employee->id,
        'leave_type_id' => $this->leaveType->id,
        'start_date' => now()->addDay(),
        'end_date' => now()->addDays(3),
        'total_days' => 3,
        'reason' => 'Vacation',
        'status' => 'pending',
    ]);

    $leaveRequest->leaveApprovals()->create([
        'approver_id' => $this->approver1->id, 'level' => 1, 'status' => 'pending',
    ]);

    $response = $this->actingAs($this->user)
        ->post(route('leave-requests.reject', $leaveRequest), [
            'notes' => 'Rejected reason',
        ]);

    $response->assertRedirect();

    $leaveRequest->refresh();
    expect($leaveRequest->status)->toBe('rejected');
    expect($leaveRequest->leaveApprovals()->first()->status)->toBe('rejected');
});
