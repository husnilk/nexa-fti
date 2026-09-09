<?php

namespace Tests\Feature\Hr;

use App\Models\Employee;
use App\Models\OvertimeRequest;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    $this->user = User::factory()->create();
    Permission::findOrCreate('overtime.view', 'web');
    Permission::findOrCreate('overtime.manage', 'web');
    Permission::findOrCreate('overtime.manage', 'web');
    $this->user->givePermissionTo(['overtime.view', 'overtime.manage', 'overtime.manage']);

    $this->employee1 = Employee::factory()->create();
    $this->employee2 = Employee::factory()->create();
    $this->approver = Employee::factory()->create();
});

test('can submit an overtime request with multiple members', function () {
    $response = $this->actingAs($this->user)
        ->post(route('overtime-requests.store'), [
            'request_number' => 'OT-001',
            'title' => 'Urgent Project',
            'description' => 'Working late for project deadline',
            'request_date' => now()->format('Y-m-d'),
            'planned_start_time' => now()->addHours(1)->format('Y-m-d H:i:s'),
            'planned_end_time' => now()->addHours(4)->format('Y-m-d H:i:s'),
            'submitted_by' => $this->employee1->id,
            'members' => [
                [
                    'employee_id' => $this->employee1->id,
                    'role' => 'Developer',
                    'job_desc' => 'Coding',
                    'planned_hours' => 3,
                ],
                [
                    'employee_id' => $this->employee2->id,
                    'role' => 'QA',
                    'job_desc' => 'Testing',
                    'planned_hours' => 3,
                ],
            ],
        ]);

    $response->assertRedirect(route('overtime-requests.index'));

    $overtimeRequest = OvertimeRequest::first();
    expect($overtimeRequest->status)->toBe('pending');
    expect($overtimeRequest->members)->toHaveCount(2);
    expect($overtimeRequest->members->pluck('employee_id')->toArray())->toContain($this->employee1->id, $this->employee2->id);
});

test('can approve an overtime request', function () {
    $overtimeRequest = OvertimeRequest::factory()->create([
        'status' => 'pending',
    ]);

    $response = $this->actingAs($this->user)
        ->post(route('overtime-requests.approve', $overtimeRequest), [
            'approver_id' => $this->approver->id,
            'notes' => 'Approved for overtime',
        ]);

    $response->assertRedirect();

    $overtimeRequest->refresh();
    expect($overtimeRequest->status)->toBe('approved');
    expect($overtimeRequest->approved_by)->toBe($this->approver->id);
    expect($overtimeRequest->approvalLogs)->toHaveCount(1);
    expect($overtimeRequest->approvalLogs->first()->status)->toBe('approved');
});

test('can reject an overtime request', function () {
    $overtimeRequest = OvertimeRequest::factory()->create([
        'status' => 'pending',
    ]);

    $response = $this->actingAs($this->user)
        ->post(route('overtime-requests.reject', $overtimeRequest), [
            'approver_id' => $this->approver->id,
            'notes' => 'No budget for overtime',
        ]);

    $response->assertRedirect();

    $overtimeRequest->refresh();
    expect($overtimeRequest->status)->toBe('rejected');
    expect($overtimeRequest->approvalLogs)->toHaveCount(1);
    expect($overtimeRequest->approvalLogs->first()->status)->toBe('rejected');
    expect($overtimeRequest->approvalLogs->first()->notes)->toBe('No budget for overtime');
});
