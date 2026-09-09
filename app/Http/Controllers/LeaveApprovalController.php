<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LeaveApprovalController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:leave.approval');
    }

    public function index(Request $request): Response
    {
        $employee = auth()->user()->employee;

        if (! $employee) {
            abort(403, 'You do not have an employee profile associated with your user account.');
        }

        $leaveRequests = LeaveRequest::whereHas('leaveApprovals', function ($query) use ($employee) {
            $query->where('approver_id', $employee->id);
        })
            ->with(['employee', 'leaveType', 'leaveApprovals.approver'])
            ->latest()
            ->paginate(10);

        return Inertia::render('leave-approvals/index', [
            'leaveRequests' => $leaveRequests,
        ]);
    }

    public function show(Request $request, LeaveRequest $leaveRequest): Response
    {
        $employee = auth()->user()->employee;

        if (! $employee) {
            abort(403, 'You do not have an employee profile associated with your user account.');
        }

        $isApprover = $leaveRequest->leaveApprovals()
            ->where('approver_id', $employee->id)
            ->exists();

        if (! $isApprover) {
            abort(403, 'You are not authorized to view this leave request.');
        }

        $leaveRequest->load(['employee', 'leaveType', 'leaveApprovals.approver']);

        return Inertia::render('leave-approvals/show', [
            'leaveRequest' => $leaveRequest,
        ]);
    }

    public function approve(Request $request, LeaveRequest $leaveRequest): RedirectResponse
    {
        $employee = auth()->user()->employee;

        if (! $employee) {
            abort(403, 'You do not have an employee profile associated with your user account.');
        }

        $validated = $request->validate([
            'notes' => 'nullable|string',
        ]);

        $currentApproval = $leaveRequest->leaveApprovals()
            ->where('status', 'pending')
            ->orderBy('level')
            ->first();

        if (! $currentApproval || $currentApproval->approver_id !== $employee->id) {
            abort(403, 'You are not authorized to approve this request at this stage.');
        }

        DB::transaction(function () use ($leaveRequest, $currentApproval, $validated) {
            $currentApproval->update([
                'status' => 'approved',
                'notes' => $validated['notes'] ?? null,
                'action_date' => now(),
            ]);

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

        return redirect()->route('leave-approvals.index')
            ->with('success', 'Leave request approved successfully.');
    }

    public function reject(Request $request, LeaveRequest $leaveRequest): RedirectResponse
    {
        $employee = auth()->user()->employee;

        if (! $employee) {
            abort(403, 'You do not have an employee profile associated with your user account.');
        }

        $validated = $request->validate([
            'notes' => 'required|string',
        ]);

        $currentApproval = $leaveRequest->leaveApprovals()
            ->where('status', 'pending')
            ->orderBy('level')
            ->first();

        if (! $currentApproval || $currentApproval->approver_id !== $employee->id) {
            abort(403, 'You are not authorized to reject this request at this stage.');
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
        });

        return redirect()->route('leave-approvals.index')
            ->with('success', 'Leave request rejected.');
    }
}
