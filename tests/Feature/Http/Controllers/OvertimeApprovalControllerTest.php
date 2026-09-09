<?php

use App\Models\Employee;
use App\Models\OvertimeRequest;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->employee = Employee::factory()->create(['id' => $this->user->id]);

    Permission::findOrCreate('overtime.approval', 'web');
});

test('guest cannot access overtime approvals', function () {
    $this->get(route('overtime-approvals.index'))
        ->assertRedirect(route('login'));
});

test('user without overtime.approval permission cannot access overtime approvals', function () {
    $unauthorizedUser = User::factory()->create();
    Employee::factory()->create(['id' => $unauthorizedUser->id]);

    $this->actingAs($unauthorizedUser)
        ->get(route('overtime-approvals.index'))
        ->assertForbidden();
});

test('user with overtime.approval permission but no employee profile gets forbidden', function () {
    $userWithoutEmployee = User::factory()->create();
    $userWithoutEmployee->givePermissionTo('overtime.approval');

    $this->actingAs($userWithoutEmployee)
        ->get(route('overtime-approvals.index'))
        ->assertForbidden();
});

test('authorized user can view overtime approvals index', function () {
    $this->user->givePermissionTo('overtime.approval');

    $overtimeRequest = OvertimeRequest::factory()->create([
        'status' => 'pending',
    ]);

    $this->actingAs($this->user)
        ->get(route('overtime-approvals.index'))
        ->assertSuccessful();
});

test('authorized user can view details of an overtime request', function () {
    $this->user->givePermissionTo('overtime.approval');

    $overtimeRequest = OvertimeRequest::factory()->create([
        'status' => 'pending',
    ]);

    $this->actingAs($this->user)
        ->get(route('overtime-approvals.show', $overtimeRequest->id))
        ->assertSuccessful();
});

test('authorized user can approve overtime request', function () {
    $this->user->givePermissionTo('overtime.approval');

    $overtimeRequest = OvertimeRequest::factory()->create([
        'status' => 'pending',
    ]);

    $data = [
        'notes' => 'Looking good',
    ];

    $this->actingAs($this->user)
        ->post(route('overtime-approvals.approve', $overtimeRequest->id), $data)
        ->assertRedirect(route('overtime-approvals.index'));

    $this->assertDatabaseHas('overtime_requests', [
        'id' => $overtimeRequest->id,
        'status' => 'approved',
        'approved_by' => $this->employee->id,
    ]);

    $this->assertDatabaseHas('overtime_approval_logs', [
        'overtime_request_id' => $overtimeRequest->id,
        'approver_id' => $this->employee->id,
        'status' => 'approved',
        'notes' => 'Looking good',
    ]);
});

test('authorized user can reject overtime request', function () {
    $this->user->givePermissionTo('overtime.approval');

    $overtimeRequest = OvertimeRequest::factory()->create([
        'status' => 'pending',
    ]);

    $data = [
        'notes' => 'Requires more details',
    ];

    $this->actingAs($this->user)
        ->post(route('overtime-approvals.reject', $overtimeRequest->id), $data)
        ->assertRedirect(route('overtime-approvals.index'));

    $this->assertDatabaseHas('overtime_requests', [
        'id' => $overtimeRequest->id,
        'status' => 'rejected',
    ]);

    $this->assertDatabaseHas('overtime_approval_logs', [
        'overtime_request_id' => $overtimeRequest->id,
        'approver_id' => $this->employee->id,
        'status' => 'rejected',
        'notes' => 'Requires more details',
    ]);
});
