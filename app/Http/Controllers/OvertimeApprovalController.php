<?php

namespace App\Http\Controllers;

use App\Models\OvertimeRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OvertimeApprovalController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:overtime.approval');
    }

    public function index(Request $request): Response
    {
        $employee = auth()->user()->employee;

        if (! $employee) {
            abort(403, 'You do not have an employee profile associated with your user account.');
        }

        $overtimeRequests = OvertimeRequest::with(['requester', 'approver', 'approvalLogs.approver'])
            ->withCount('members')
            ->latest()
            ->paginate(10);

        return Inertia::render('overtime-approvals/index', [
            'overtimeRequests' => $overtimeRequests,
        ]);
    }

    public function show(Request $request, OvertimeRequest $overtimeRequest): Response
    {
        $employee = auth()->user()->employee;

        if (! $employee) {
            abort(403, 'You do not have an employee profile associated with your user account.');
        }

        $overtimeRequest->load(['requester', 'approver', 'members.employee', 'approvalLogs.approver']);

        return Inertia::render('overtime-approvals/show', [
            'overtimeRequest' => $overtimeRequest,
        ]);
    }

    public function approve(Request $request, OvertimeRequest $overtimeRequest): RedirectResponse
    {
        $employee = auth()->user()->employee;

        if (! $employee) {
            abort(403, 'You do not have an employee profile associated with your user account.');
        }

        if ($overtimeRequest->status !== 'pending') {
            abort(400, 'This request is not pending approval.');
        }

        $validated = $request->validate([
            'notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($overtimeRequest, $employee, $validated) {
            $overtimeRequest->approvalLogs()->create([
                'approver_id' => $employee->id,
                'status' => 'approved',
                'notes' => $validated['notes'] ?? null,
                'action_date' => now(),
            ]);

            $overtimeRequest->update([
                'status' => 'approved',
                'approved_by' => $employee->id,
                'approved_at' => now(),
            ]);
        });

        return redirect()->route('overtime-approvals.index')
            ->with('success', 'Overtime request approved successfully.');
    }

    public function reject(Request $request, OvertimeRequest $overtimeRequest): RedirectResponse
    {
        $employee = auth()->user()->employee;

        if (! $employee) {
            abort(403, 'You do not have an employee profile associated with your user account.');
        }

        if ($overtimeRequest->status !== 'pending') {
            abort(400, 'This request is not pending approval.');
        }

        $validated = $request->validate([
            'notes' => 'required|string',
        ]);

        DB::transaction(function () use ($overtimeRequest, $employee, $validated) {
            $overtimeRequest->approvalLogs()->create([
                'approver_id' => $employee->id,
                'status' => 'rejected',
                'notes' => $validated['notes'],
                'action_date' => now(),
            ]);

            $overtimeRequest->update([
                'status' => 'rejected',
            ]);
        });

        return redirect()->route('overtime-approvals.index')
            ->with('success', 'Overtime request rejected.');
    }
}
