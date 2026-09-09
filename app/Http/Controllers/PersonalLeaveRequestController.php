<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PersonalLeaveRequestController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:personal.manage');
    }

    public function index(): Response
    {
        $employee = auth()->user()->employee;

        if (! $employee) {
            abort(403, 'You do not have an employee profile associated with your user account.');
        }

        $leaveRequests = LeaveRequest::with(['leaveType', 'leaveApprovals.approver'])
            ->where('employee_id', $employee->id)
            ->latest()
            ->paginate(10);

        return Inertia::render('personal-leave-requests/index', [
            'leaveRequests' => $leaveRequests,
        ]);
    }

    public function create(): Response
    {
        $employee = auth()->user()->employee;

        if (! $employee) {
            abort(403, 'You do not have an employee profile associated with your user account.');
        }

        return Inertia::render('personal-leave-requests/create', [
            'leaveTypes' => LeaveType::all(),
            'employees' => Employee::where('id', '!=', $employee->id)->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $employee = auth()->user()->employee;

        if (! $employee) {
            abort(403, 'You do not have an employee profile associated with your user account.');
        }

        $validated = $request->validate([
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'total_days' => 'required|integer|min:1',
            'reason' => 'required|string',
            'address_leave' => 'nullable|string',
            'contact_leave' => 'nullable|string',
            'approver_level_1_id' => 'required|exists:employees,id|different:'.$employee->id,
            'approver_level_2_id' => 'required|exists:employees,id|different:'.$employee->id,
        ]);

        DB::transaction(function () use ($validated, $employee) {
            $leaveRequest = LeaveRequest::create([
                'employee_id' => $employee->id,
                'leave_type_id' => $validated['leave_type_id'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'total_days' => $validated['total_days'],
                'reason' => $validated['reason'],
                'address_leave' => $validated['address_leave'] ?? null,
                'contact_leave' => $validated['contact_leave'] ?? null,
                'status' => 'pending',
                'submitted_at' => now(),
            ]);

            // Level 1 Approval
            $leaveRequest->leaveApprovals()->create([
                'approver_id' => $validated['approver_level_1_id'],
                'level' => 1,
                'status' => 'pending',
            ]);

            // Level 2 Approval
            $leaveRequest->leaveApprovals()->create([
                'approver_id' => $validated['approver_level_2_id'],
                'level' => 2,
                'status' => 'pending',
            ]);
        });

        return redirect()->route('personal-leave-requests.index')
            ->with('success', 'Leave request submitted successfully.');
    }

    public function show(LeaveRequest $personalLeaveRequest): Response
    {
        $employee = auth()->user()->employee;

        if (! $employee || $personalLeaveRequest->employee_id !== $employee->id) {
            abort(403, 'You are not authorized to view this leave request.');
        }

        $personalLeaveRequest->load(['employee', 'leaveType', 'leaveApprovals.approver']);

        return Inertia::render('personal-leave-requests/show', [
            'leaveRequest' => $personalLeaveRequest,
        ]);
    }
}
