<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\OvertimeRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OvertimeRequestController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:overtime.view')->only(['index', 'show']);
        $this->middleware('permission:overtime.manage')->only(['create', 'store', 'edit', 'update', 'approve', 'reject', 'destroy']);
    }

    public function index(): Response
    {
        $overtimeRequests = OvertimeRequest::with(['requester', 'approver'])
            ->withCount('members')
            ->latest()
            ->paginate(10);

        return Inertia::render('overtime-requests/index', [
            'overtimeRequests' => $overtimeRequests,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('overtime-requests/create', [
            'employees' => Employee::all(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'request_number' => 'required|string|unique:overtime_requests,request_number',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'request_date' => 'required|date',
            'planned_start_time' => 'required|date',
            'planned_end_time' => 'required|date|after:planned_start_time',
            'submitted_by' => 'required|exists:employees,id',
            'members' => 'required|array|min:1',
            'members.*.employee_id' => 'required|exists:employees,id',
            'members.*.role' => 'nullable|string|max:255',
            'members.*.job_desc' => 'nullable|string',
            'members.*.planned_hours' => 'required|numeric|min:0.5',
        ]);

        DB::transaction(function () use ($validated) {
            $overtimeRequest = OvertimeRequest::create([
                'request_number' => $validated['request_number'],
                'title' => $validated['title'],
                'description' => $validated['description'],
                'request_date' => $validated['request_date'],
                'planned_start_time' => $validated['planned_start_time'],
                'planned_end_time' => $validated['planned_end_time'],
                'submitted_by' => $validated['submitted_by'],
                'status' => 'pending',
                'submitted_at' => now(),
            ]);

            foreach ($validated['members'] as $memberData) {
                $overtimeRequest->members()->create($memberData);
            }
        });

        return redirect()->route('overtime-requests.index')
            ->with('success', 'Overtime request submitted successfully.');
    }

    public function show(OvertimeRequest $overtimeRequest): Response
    {
        $overtimeRequest->load(['requester', 'approver', 'members.employee', 'approvalLogs.approver']);

        return Inertia::render('overtime-requests/show', [
            'overtimeRequest' => $overtimeRequest,
        ]);
    }

    public function approve(Request $request, OvertimeRequest $overtimeRequest): RedirectResponse
    {
        $validated = $request->validate([
            'approver_id' => 'required|exists:employees,id',
            'notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($overtimeRequest, $validated) {
            $overtimeRequest->approvalLogs()->create([
                'approver_id' => $validated['approver_id'],
                'status' => 'approved',
                'notes' => $validated['notes'],
                'action_date' => now(),
            ]);

            $overtimeRequest->update([
                'status' => 'approved',
                'approved_by' => $validated['approver_id'],
                'approved_at' => now(),
            ]);
        });

        return back()->with('success', 'Overtime request approved.');
    }

    public function reject(Request $request, OvertimeRequest $overtimeRequest): RedirectResponse
    {
        $validated = $request->validate([
            'approver_id' => 'required|exists:employees,id',
            'notes' => 'required|string',
        ]);

        DB::transaction(function () use ($overtimeRequest, $validated) {
            $overtimeRequest->approvalLogs()->create([
                'approver_id' => $validated['approver_id'],
                'status' => 'rejected',
                'notes' => $validated['notes'],
                'action_date' => now(),
            ]);

            $overtimeRequest->update([
                'status' => 'rejected',
            ]);
        });

        return back()->with('success', 'Overtime request rejected.');
    }

    public function destroy(OvertimeRequest $overtimeRequest): RedirectResponse
    {
        $overtimeRequest->delete();

        return redirect()->route('overtime-requests.index')
            ->with('success', 'Overtime request deleted.');
    }
}
