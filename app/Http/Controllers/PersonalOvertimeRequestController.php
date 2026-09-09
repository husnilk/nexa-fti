<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\OvertimeRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PersonalOvertimeRequestController extends Controller
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

        $overtimeRequests = OvertimeRequest::with(['requester', 'approver'])
            ->withCount('members')
            ->where(function ($query) use ($employee) {
                $query->where('submitted_by', $employee->id)
                    ->orWhereHas('members', function ($q) use ($employee) {
                        $q->where('employee_id', $employee->id);
                    });
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('personal-overtime-requests/index', [
            'overtimeRequests' => $overtimeRequests,
        ]);
    }

    public function create(): Response
    {
        $employee = auth()->user()->employee;

        if (! $employee) {
            abort(403, 'You do not have an employee profile associated with your user account.');
        }

        return Inertia::render('personal-overtime-requests/create', [
            'employees' => Employee::all(['id', 'name']),
            'currentEmployeeId' => $employee->id,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $employee = auth()->user()->employee;

        if (! $employee) {
            abort(403, 'You do not have an employee profile associated with your user account.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'request_date' => 'required|date',
            'planned_start_time' => 'required|date',
            'planned_end_time' => 'required|date|after:planned_start_time',
            'members' => 'required|array|min:1',
            'members.*.employee_id' => 'required|exists:employees,id',
            'members.*.role' => 'nullable|string|max:255',
            'members.*.job_desc' => 'nullable|string',
            'members.*.planned_hours' => 'required|numeric|min:0.5',
        ]);

        $requestNumber = 'OT-'.date('Ymd').'-'.strtoupper(bin2hex(random_bytes(2)));

        DB::transaction(function () use ($validated, $employee, $requestNumber) {
            $overtimeRequest = OvertimeRequest::create([
                'request_number' => $requestNumber,
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'request_date' => $validated['request_date'],
                'planned_start_time' => $validated['planned_start_time'],
                'planned_end_time' => $validated['planned_end_time'],
                'submitted_by' => $employee->id,
                'status' => 'pending',
                'submitted_at' => now(),
            ]);

            foreach ($validated['members'] as $memberData) {
                $overtimeRequest->members()->create([
                    'employee_id' => $memberData['employee_id'],
                    'role' => $memberData['role'] ?? null,
                    'job_desc' => $memberData['job_desc'] ?? null,
                    'planned_hours' => $memberData['planned_hours'],
                ]);
            }
        });

        return redirect()->route('personal-overtime-requests.index')
            ->with('success', 'Overtime request submitted successfully.');
    }

    public function show(OvertimeRequest $personalOvertimeRequest): Response
    {
        $employee = auth()->user()->employee;

        if (! $employee) {
            abort(403, 'You do not have an employee profile associated with your user account.');
        }

        $isMember = $personalOvertimeRequest->members()->where('employee_id', $employee->id)->exists();
        $isSubmitter = $personalOvertimeRequest->submitted_by === $employee->id;

        if (! $isSubmitter && ! $isMember) {
            abort(403, 'You are not authorized to view this overtime request.');
        }

        $personalOvertimeRequest->load(['requester', 'approver', 'members.employee', 'approvalLogs.approver']);

        return Inertia::render('personal-overtime-requests/show', [
            'overtimeRequest' => $personalOvertimeRequest,
            'currentEmployeeId' => $employee->id,
        ]);
    }

    public function edit(OvertimeRequest $personalOvertimeRequest): Response
    {
        $employee = auth()->user()->employee;

        if (! $employee) {
            abort(403, 'You do not have an employee profile associated with your user account.');
        }

        if ($personalOvertimeRequest->submitted_by !== $employee->id) {
            abort(403, 'You are not authorized to edit this overtime request.');
        }

        if ($personalOvertimeRequest->status !== 'pending') {
            abort(400, 'Only pending overtime requests can be modified.');
        }

        $personalOvertimeRequest->load('members');

        return Inertia::render('personal-overtime-requests/edit', [
            'overtimeRequest' => $personalOvertimeRequest,
            'employees' => Employee::all(['id', 'name']),
            'currentEmployeeId' => $employee->id,
        ]);
    }

    public function update(Request $request, OvertimeRequest $personalOvertimeRequest): RedirectResponse
    {
        $employee = auth()->user()->employee;

        if (! $employee) {
            abort(403, 'You do not have an employee profile associated with your user account.');
        }

        if ($personalOvertimeRequest->submitted_by !== $employee->id) {
            abort(403, 'You are not authorized to update this overtime request.');
        }

        if ($personalOvertimeRequest->status !== 'pending') {
            abort(400, 'Only pending overtime requests can be modified.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'request_date' => 'required|date',
            'planned_start_time' => 'required|date',
            'planned_end_time' => 'required|date|after:planned_start_time',
            'members' => 'required|array|min:1',
            'members.*.employee_id' => 'required|exists:employees,id',
            'members.*.role' => 'nullable|string|max:255',
            'members.*.job_desc' => 'nullable|string',
            'members.*.planned_hours' => 'required|numeric|min:0.5',
        ]);

        DB::transaction(function () use ($validated, $personalOvertimeRequest) {
            $personalOvertimeRequest->update([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'request_date' => $validated['request_date'],
                'planned_start_time' => $validated['planned_start_time'],
                'planned_end_time' => $validated['planned_end_time'],
            ]);

            $personalOvertimeRequest->members()->delete();

            foreach ($validated['members'] as $memberData) {
                $personalOvertimeRequest->members()->create([
                    'employee_id' => $memberData['employee_id'],
                    'role' => $memberData['role'] ?? null,
                    'job_desc' => $memberData['job_desc'] ?? null,
                    'planned_hours' => $memberData['planned_hours'],
                ]);
            }
        });

        return redirect()->route('personal-overtime-requests.show', $personalOvertimeRequest->id)
            ->with('success', 'Overtime request updated successfully.');
    }

    public function destroy(OvertimeRequest $personalOvertimeRequest): RedirectResponse
    {
        $employee = auth()->user()->employee;

        if (! $employee) {
            abort(403, 'You do not have an employee profile associated with your user account.');
        }

        if ($personalOvertimeRequest->submitted_by !== $employee->id) {
            abort(403, 'You are not authorized to delete this overtime request.');
        }

        if ($personalOvertimeRequest->status !== 'pending') {
            abort(400, 'Only pending overtime requests can be deleted.');
        }

        $personalOvertimeRequest->delete();

        return redirect()->route('personal-overtime-requests.index')
            ->with('success', 'Overtime request cancelled and deleted successfully.');
    }

    public function report(OvertimeRequest $personalOvertimeRequest): RedirectResponse
    {
        return redirect()->route('personal-overtime-requests.show', $personalOvertimeRequest->id);
    }

    public function complete(Request $request, OvertimeRequest $personalOvertimeRequest): RedirectResponse
    {
        return redirect()->route('personal-overtime-requests.show', $personalOvertimeRequest->id);
    }

    public function myReport(OvertimeRequest $personalOvertimeRequest): RedirectResponse
    {
        return redirect()->route('personal-overtime-requests.show', $personalOvertimeRequest->id);
    }

    public function storeMyReport(Request $request, OvertimeRequest $personalOvertimeRequest): RedirectResponse
    {
        $employee = auth()->user()->employee;

        if (! $employee) {
            abort(403, 'You do not have an employee profile associated with your user account.');
        }

        $member = $personalOvertimeRequest->members()->where('employee_id', $employee->id)->first();

        if (! $member) {
            abort(403, 'You are not a member of this overtime request.');
        }

        if ($personalOvertimeRequest->status !== 'approved') {
            abort(400, 'Overtime report can only be submitted for approved requests.');
        }

        $validated = $request->validate([
            'actual_start_time' => 'required|date',
            'actual_end_time' => 'required|date|after:actual_start_time',
            'actual_hours' => 'required|numeric|min:0.5',
            'activity' => 'required|string',
            'outcome' => 'required|string',
        ]);

        DB::transaction(function () use ($personalOvertimeRequest, $member, $validated) {
            $member->update([
                'actual_start_time' => $validated['actual_start_time'],
                'actual_end_time' => $validated['actual_end_time'],
                'actual_hours' => $validated['actual_hours'],
                'activity' => $validated['activity'],
                'outcome' => $validated['outcome'],
            ]);

            // Check if all members have reported their actual hours
            $allReported = ! $personalOvertimeRequest->members()
                ->whereNull('actual_hours')
                ->exists();

            if ($allReported) {
                $personalOvertimeRequest->update([
                    'status' => 'completed',
                ]);
            }
        });

        return redirect()->route('personal-overtime-requests.show', $personalOvertimeRequest->id)
            ->with('success', 'Your overtime report submitted successfully.');
    }
}
