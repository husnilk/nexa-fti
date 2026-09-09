<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class LeaveRequestControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $user;

    protected Employee $employee;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->employee = Employee::factory()->create(['id' => $this->user->id]);

        Permission::findOrCreate('leave.view', 'web');
        Permission::findOrCreate('leave.manage', 'web');
    }

    public function test_index_displays_view(): void
    {
        $this->user->givePermissionTo('leave.view');
        $leaveRequests = LeaveRequest::factory()->count(3)->create();

        $response = $this->actingAs($this->user)
            ->get(route('leave-requests.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('leave-requests/index'));
    }

    public function test_create_displays_view(): void
    {
        $this->user->givePermissionTo('leave.manage');

        $response = $this->actingAs($this->user)
            ->get(route('leave-requests.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('leave-requests/create'));
    }

    public function test_store_saves_and_redirects(): void
    {
        $this->user->givePermissionTo('leave.manage');

        $employee = Employee::factory()->create();
        $leave_type = LeaveType::factory()->create();
        $approver1 = Employee::factory()->create();
        $approver2 = Employee::factory()->create();

        $response = $this->actingAs($this->user)
            ->post(route('leave-requests.store'), [
                'employee_id' => $employee->id,
                'leave_type_id' => $leave_type->id,
                'start_date' => now()->addDays(5)->format('Y-m-d'),
                'end_date' => now()->addDays(10)->format('Y-m-d'),
                'total_days' => 5,
                'reason' => 'Family event',
                'address_leave' => 'Some address',
                'contact_leave' => '123456789',
                'approver_level_1_id' => $approver1->id,
                'approver_level_2_id' => $approver2->id,
            ]);

        $response->assertRedirect(route('leave-requests.index'));

        $this->assertDatabaseHas('leave_requests', [
            'employee_id' => $employee->id,
            'leave_type_id' => $leave_type->id,
            'total_days' => 5,
            'reason' => 'Family event',
            'status' => 'pending',
        ]);

        $leaveRequest = LeaveRequest::where('employee_id', $employee->id)->first();
        $this->assertCount(2, $leaveRequest->leaveApprovals);
    }

    public function test_show_displays_view(): void
    {
        $this->user->givePermissionTo('leave.view');
        $leaveRequest = LeaveRequest::factory()->create();

        $response = $this->actingAs($this->user)
            ->get(route('leave-requests.show', $leaveRequest));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('leave-requests/show'));
    }

    public function test_approve_updates_approval_and_request_status(): void
    {
        $this->user->givePermissionTo('leave.manage');

        $leaveRequest = LeaveRequest::factory()->create(['status' => 'pending']);
        $approver1 = Employee::factory()->create();
        $approver2 = Employee::factory()->create();

        $approval1 = $leaveRequest->leaveApprovals()->create([
            'approver_id' => $approver1->id,
            'level' => 1,
            'status' => 'pending',
        ]);

        $approval2 = $leaveRequest->leaveApprovals()->create([
            'approver_id' => $approver2->id,
            'level' => 2,
            'status' => 'pending',
        ]);

        // First approval
        $response = $this->actingAs($this->user)
            ->post(route('leave-requests.approve', $leaveRequest), [
                'notes' => 'Looks good for level 1',
            ]);

        $response->assertRedirect();
        $this->assertEquals('approved', $approval1->refresh()->status);
        $this->assertEquals('pending', $leaveRequest->refresh()->status);

        // Second approval (final level)
        $response = $this->actingAs($this->user)
            ->post(route('leave-requests.approve', $leaveRequest), [
                'notes' => 'Approved level 2',
            ]);

        $response->assertRedirect();
        $this->assertEquals('approved', $approval2->refresh()->status);
        $this->assertEquals('approved', $leaveRequest->refresh()->status);
        $this->assertNotNull($leaveRequest->approved_at);
    }

    public function test_reject_updates_approval_and_request_status(): void
    {
        $this->user->givePermissionTo('leave.manage');

        $leaveRequest = LeaveRequest::factory()->create(['status' => 'pending']);
        $approver = Employee::factory()->create();

        $approval = $leaveRequest->leaveApprovals()->create([
            'approver_id' => $approver->id,
            'level' => 1,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->user)
            ->post(route('leave-requests.reject', $leaveRequest), [
                'notes' => 'Not allowed',
            ]);

        $response->assertRedirect();
        $this->assertEquals('rejected', $approval->refresh()->status);
        $this->assertEquals('rejected', $leaveRequest->refresh()->status);
    }

    public function test_destroy_deletes_and_redirects(): void
    {
        $this->user->givePermissionTo('leave.manage');
        $leaveRequest = LeaveRequest::factory()->create();

        $response = $this->actingAs($this->user)
            ->delete(route('leave-requests.destroy', $leaveRequest));

        $response->assertRedirect(route('leave-requests.index'));
        $this->assertModelMissing($leaveRequest);
    }
}
