<?php

use App\Models\Employee;
use App\Models\OvertimeRequest;
use App\Models\OvertimeRequestMember;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->employee = Employee::factory()->create(['id' => $this->user->id]);

    Permission::findOrCreate('personal.manage', 'web');
});

test('guest cannot access personal overtime requests', function () {
    $this->get(route('personal-overtime-requests.index'))
        ->assertRedirect(route('login'));
});

test('user without personal.manage permission cannot access personal overtime requests', function () {
    $unauthorizedUser = User::factory()->create();
    Employee::factory()->create(['id' => $unauthorizedUser->id]);

    $this->actingAs($unauthorizedUser)
        ->get(route('personal-overtime-requests.index'))
        ->assertForbidden();
});

test('user with personal.manage permission but no employee profile gets forbidden', function () {
    $userWithoutEmployee = User::factory()->create();
    $userWithoutEmployee->givePermissionTo('personal.manage');

    $this->actingAs($userWithoutEmployee)
        ->get(route('personal-overtime-requests.index'))
        ->assertForbidden();
});

test('authorized user can view personal overtime requests index', function () {
    $this->user->givePermissionTo('personal.manage');

    $request = OvertimeRequest::factory()->create([
        'submitted_by' => $this->employee->id,
        'status' => 'pending',
    ]);

    $this->actingAs($this->user)
        ->get(route('personal-overtime-requests.index'))
        ->assertSuccessful();
});

test('authorized user can view create personal overtime request page', function () {
    $this->user->givePermissionTo('personal.manage');

    $this->actingAs($this->user)
        ->get(route('personal-overtime-requests.create'))
        ->assertSuccessful();
});

test('authorized user can submit new personal overtime request', function () {
    $this->user->givePermissionTo('personal.manage');

    $memberEmployee = Employee::factory()->create();

    $data = [
        'title' => 'Migration Work',
        'description' => 'Upgrading database servers',
        'request_date' => now()->format('Y-m-d'),
        'planned_start_time' => now()->addHours(2)->format('Y-m-d H:i:s'),
        'planned_end_time' => now()->addHours(6)->format('Y-m-d H:i:s'),
        'members' => [
            [
                'employee_id' => $this->employee->id,
                'role' => 'Lead',
                'job_desc' => 'Perform backup and migration script',
                'planned_hours' => 4,
            ],
            [
                'employee_id' => $memberEmployee->id,
                'role' => 'Support',
                'job_desc' => 'Verify frontend connectivity',
                'planned_hours' => 4,
            ],
        ],
    ];

    $this->actingAs($this->user)
        ->post(route('personal-overtime-requests.store'), $data)
        ->assertRedirect(route('personal-overtime-requests.index'));

    $this->assertDatabaseHas('overtime_requests', [
        'submitted_by' => $this->employee->id,
        'title' => 'Migration Work',
        'status' => 'pending',
    ]);

    $overtimeRequest = OvertimeRequest::where('submitted_by', $this->employee->id)->first();
    $this->assertCount(2, $overtimeRequest->members);
    $this->assertDatabaseHas('overtime_request_members', [
        'overtime_request_id' => $overtimeRequest->id,
        'employee_id' => $this->employee->id,
        'role' => 'Lead',
        'planned_hours' => 4,
    ]);
    $this->assertDatabaseHas('overtime_request_members', [
        'overtime_request_id' => $overtimeRequest->id,
        'employee_id' => $memberEmployee->id,
        'role' => 'Support',
        'planned_hours' => 4,
    ]);
});

test('authorized user can view details of their own overtime request', function () {
    $this->user->givePermissionTo('personal.manage');

    $overtimeRequest = OvertimeRequest::factory()->create([
        'submitted_by' => $this->employee->id,
    ]);

    $this->actingAs($this->user)
        ->get(route('personal-overtime-requests.show', $overtimeRequest->id))
        ->assertSuccessful();
});

test('authorized user can view details if they are a member of the overtime request', function () {
    $this->user->givePermissionTo('personal.manage');

    $otherUser = User::factory()->create();
    $otherEmployee = Employee::factory()->create(['id' => $otherUser->id]);

    $overtimeRequest = OvertimeRequest::factory()->create([
        'submitted_by' => $otherEmployee->id,
    ]);

    OvertimeRequestMember::factory()->create([
        'overtime_request_id' => $overtimeRequest->id,
        'employee_id' => $this->employee->id,
    ]);

    $this->actingAs($this->user)
        ->get(route('personal-overtime-requests.show', $overtimeRequest->id))
        ->assertSuccessful();
});

test('authorized user cannot view other overtime requests they are not involved in', function () {
    $this->user->givePermissionTo('personal.manage');

    $otherEmployee = Employee::factory()->create();
    $overtimeRequest = OvertimeRequest::factory()->create([
        'submitted_by' => $otherEmployee->id,
    ]);

    $this->actingAs($this->user)
        ->get(route('personal-overtime-requests.show', $overtimeRequest->id))
        ->assertForbidden();
});

test('authorized user can edit/modify their pending request', function () {
    $this->user->givePermissionTo('personal.manage');

    $overtimeRequest = OvertimeRequest::factory()->create([
        'submitted_by' => $this->employee->id,
        'status' => 'pending',
    ]);

    $this->actingAs($this->user)
        ->get(route('personal-overtime-requests.edit', $overtimeRequest->id))
        ->assertSuccessful();
});

test('authorized user cannot edit/modify their request if not pending', function () {
    $this->user->givePermissionTo('personal.manage');

    $overtimeRequest = OvertimeRequest::factory()->create([
        'submitted_by' => $this->employee->id,
        'status' => 'approved',
    ]);

    $this->actingAs($this->user)
        ->get(route('personal-overtime-requests.edit', $overtimeRequest->id))
        ->assertStatus(400); // 400 Bad Request
});

test('authorized user can update their pending request', function () {
    $this->user->givePermissionTo('personal.manage');

    $overtimeRequest = OvertimeRequest::factory()->create([
        'submitted_by' => $this->employee->id,
        'status' => 'pending',
    ]);

    $data = [
        'title' => 'Updated Title',
        'description' => 'Updated Desc',
        'request_date' => now()->format('Y-m-d'),
        'planned_start_time' => now()->addHours(2)->format('Y-m-d H:i:s'),
        'planned_end_time' => now()->addHours(6)->format('Y-m-d H:i:s'),
        'members' => [
            [
                'employee_id' => $this->employee->id,
                'role' => 'Updated Lead',
                'job_desc' => 'Updated Task',
                'planned_hours' => 3,
            ],
        ],
    ];

    $this->actingAs($this->user)
        ->put(route('personal-overtime-requests.update', $overtimeRequest->id), $data)
        ->assertRedirect(route('personal-overtime-requests.show', $overtimeRequest->id));

    $this->assertDatabaseHas('overtime_requests', [
        'id' => $overtimeRequest->id,
        'title' => 'Updated Title',
    ]);
});

test('authorized user can delete/cancel their pending request', function () {
    $this->user->givePermissionTo('personal.manage');

    $overtimeRequest = OvertimeRequest::factory()->create([
        'submitted_by' => $this->employee->id,
        'status' => 'pending',
    ]);

    $this->actingAs($this->user)
        ->delete(route('personal-overtime-requests.destroy', $overtimeRequest->id))
        ->assertRedirect(route('personal-overtime-requests.index'));

    $this->assertDatabaseMissing('overtime_requests', [
        'id' => $overtimeRequest->id,
    ]);
});

test('authorized user can view report page for their approved request redirects to show', function () {
    $this->user->givePermissionTo('personal.manage');

    $overtimeRequest = OvertimeRequest::factory()->create([
        'submitted_by' => $this->employee->id,
        'status' => 'approved',
    ]);

    $this->actingAs($this->user)
        ->get(route('personal-overtime-requests.report', $overtimeRequest->id))
        ->assertRedirect(route('personal-overtime-requests.show', $overtimeRequest->id));
});

test('authorized user submitting completion report redirects to show without action', function () {
    $this->user->givePermissionTo('personal.manage');

    $overtimeRequest = OvertimeRequest::factory()->create([
        'submitted_by' => $this->employee->id,
        'status' => 'approved',
    ]);

    $member = OvertimeRequestMember::factory()->create([
        'overtime_request_id' => $overtimeRequest->id,
        'employee_id' => $this->employee->id,
        'planned_hours' => 4,
    ]);

    $data = [
        'members' => [
            [
                'id' => $member->id,
                'actual_start_time' => now()->format('Y-m-d H:i:s'),
                'actual_end_time' => now()->addHours(5)->format('Y-m-d H:i:s'),
                'actual_hours' => 5,
            ],
        ],
    ];

    $this->actingAs($this->user)
        ->post(route('personal-overtime-requests.complete', $overtimeRequest->id), $data)
        ->assertRedirect(route('personal-overtime-requests.show', $overtimeRequest->id));

    $this->assertDatabaseHas('overtime_requests', [
        'id' => $overtimeRequest->id,
        'status' => 'approved',
    ]);

    $this->assertDatabaseHas('overtime_request_members', [
        'id' => $member->id,
        'actual_hours' => null,
    ]);
});

test('member of overtime request can view report page for approved request', function () {
    $this->user->givePermissionTo('personal.manage');

    $overtimeRequest = OvertimeRequest::factory()->create([
        'status' => 'approved',
    ]);

    $member = OvertimeRequestMember::factory()->create([
        'overtime_request_id' => $overtimeRequest->id,
        'employee_id' => $this->employee->id,
    ]);

    $this->actingAs($this->user)
        ->get(route('personal-overtime-requests.my-report', $overtimeRequest->id))
        ->assertRedirect(route('personal-overtime-requests.show', $overtimeRequest->id));
});

test('member of overtime request can submit their overtime report', function () {
    $this->user->givePermissionTo('personal.manage');

    $overtimeRequest = OvertimeRequest::factory()->create([
        'status' => 'approved',
    ]);

    $member = OvertimeRequestMember::factory()->create([
        'overtime_request_id' => $overtimeRequest->id,
        'employee_id' => $this->employee->id,
        'planned_hours' => 4,
    ]);

    $data = [
        'actual_start_time' => now()->format('Y-m-d H:i:s'),
        'actual_end_time' => now()->addHours(5)->format('Y-m-d H:i:s'),
        'actual_hours' => 5,
        'activity' => 'Finished migration and ran verification tests',
        'outcome' => 'All systems functional and verified',
    ];

    $this->actingAs($this->user)
        ->post(route('personal-overtime-requests.store-my-report', $overtimeRequest->id), $data)
        ->assertRedirect(route('personal-overtime-requests.show', $overtimeRequest->id));

    $this->assertDatabaseHas('overtime_request_members', [
        'id' => $member->id,
        'actual_hours' => 5,
        'activity' => 'Finished migration and ran verification tests',
        'outcome' => 'All systems functional and verified',
    ]);

    // Since this is the only member and has reported, request status should automatically become completed
    $this->assertDatabaseHas('overtime_requests', [
        'id' => $overtimeRequest->id,
        'status' => 'completed',
    ]);
});
