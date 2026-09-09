<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LeaveRequestController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:leave.view')->only(['index', 'show']);
        $this->middleware('permission:leave.manage')->only(['create', 'store', 'edit', 'update', 'approve', 'reject', 'destroy']);
    }

    public function index(): Response
    {
        $leaveRequests = LeaveRequest::with(['employee', 'leaveType', 'leaveApprovals.approver'])
            ->latest()
            ->paginate(10);

        return Inertia::render('leave-requests/index', [
            'leaveRequests' => $leaveRequests,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('leave-requests/create', [
            'leaveTypes' => LeaveType::all(),
            'employees' => Employee::all(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'total_days' => 'required|integer|min:1',
            'reason' => 'required|string',
            'address_leave' => 'nullable|string',
            'contact_leave' => 'nullable|string',
            'approver_level_1_id' => 'required|exists:employees,id',
            'approver_level_2_id' => 'required|exists:employees,id',
        ]);

        DB::transaction(function () use ($validated) {
            $leaveRequest = LeaveRequest::create([
                'employee_id' => $validated['employee_id'],
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

        return redirect()->route('leave-requests.index')
            ->with('success', 'Leave request submitted successfully.');
    }

    public function show(LeaveRequest $leaveRequest): Response
    {
        $leaveRequest->load(['employee', 'leaveType', 'leaveApprovals.approver']);

        return Inertia::render('leave-requests/show', [
            'leaveRequest' => $leaveRequest,
        ]);
    }

    public function approve(Request $request, LeaveRequest $leaveRequest): RedirectResponse
    {
        $validated = $request->validate([
            'notes' => 'nullable|string',
        ]);

        // In a real app, we'd check if the current user is the actual approver for the current level
        // For now, we'll assume the managing user is acting on behalf of the approver or is an admin

        $currentApproval = $leaveRequest->leaveApprovals()
            ->where('status', 'pending')
            ->orderBy('level')
            ->first();

        if (! $currentApproval) {
            return back()->with('error', 'No pending approval found.');
        }

        DB::transaction(function () use ($leaveRequest, $currentApproval, $validated) {
            $currentApproval->update([
                'status' => 'approved',
                'notes' => $validated['notes'],
                'action_date' => now(),
            ]);

            // If it's the last level, mark the request as approved
            $nextApproval = $leaveRequest->leaveApprovals()
                ->where('status', 'pending')
                ->where('level', '>', $currentApproval->level)
                ->first();

            if (! $nextApproval) {
                $leaveRequest->update([
                    'status' => 'approved',
                    'approved_at' => now(),
                ]);
            }
        });

        return back()->with('success', 'Leave request approved for level '.$currentApproval->level);
    }

    public function reject(Request $request, LeaveRequest $leaveRequest): RedirectResponse
    {
        $validated = $request->validate([
            'notes' => 'required|string',
        ]);

        $currentApproval = $leaveRequest->leaveApprovals()
            ->where('status', 'pending')
            ->orderBy('level')
            ->first();

        if (! $currentApproval) {
            return back()->with('error', 'No pending approval found.');
        }

        DB::transaction(function () use ($leaveRequest, $currentApproval, $validated) {
            $currentApproval->update([
                'status' => 'rejected',
                'notes' => $validated['notes'],
                'action_date' => now(),
            ]);

            $leaveRequest->update([
                'status' => 'rejected',
            ]);

            // Any remaining levels are also marked as rejected (implicit) or stayed pending
        });

        return back()->with('success', 'Leave request rejected.');
    }

    public function destroy(LeaveRequest $leaveRequest): RedirectResponse
    {
        $leaveRequest->delete();

        return redirect()->route('leave-requests.index')
            ->with('success', 'Leave request deleted.');
    }
}
