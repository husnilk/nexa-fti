<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\AssignmentProgressStoreRequest;
use App\Http\Requests\AssignmentProgressUpdateRequest;
use App\Models\Assignment;
use App\Models\AssignmentProgress;
use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssignmentProgressController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:assignment.view|assignment.manage');
    }

    public function index(Request $request): Response
    {
        $assignmentId = $request->query('assignment_id');

        $assignmentProgresses = AssignmentProgress::with(['assignment', 'employee'])
            ->when($assignmentId, function ($query, $assignmentId) {
                $query->where('assignment_id', $assignmentId);
            })
            ->latest()
            ->get();

        return Inertia::render('assignment-progresses/index', [
            'assignmentProgresses' => $assignmentProgresses,
            'filters' => [
                'assignment_id' => $assignmentId ?? '',
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        $assignmentId = $request->query('assignment_id');
        $assignments = Assignment::select('id', 'title')->get();
        $employees = Employee::select('id', 'name')->get();

        return Inertia::render('assignment-progresses/create', [
            'assignments' => $assignments,
            'employees' => $employees,
            'selected_assignment_id' => $assignmentId ? (int) $assignmentId : null,
        ]);
    }

    public function store(AssignmentProgressStoreRequest $request): RedirectResponse
    {
        $assignmentProgress = AssignmentProgress::create($request->validated());

        if ($assignmentProgress->status === 'completed') {
            $assignmentProgress->assignment->update(['status' => 'completed']);
        } else {
            $assignmentProgress->assignment->update(['status' => 'in_progress']);
        }

        return redirect()->route('assignment-progresses.index', ['assignment_id' => $assignmentProgress->assignment_id])
            ->with('success', 'Assignment progress updated successfully.');
    }

    public function show(Request $request, AssignmentProgress $assignmentProgress): Response
    {
        $assignmentProgress->load(['assignment', 'employee']);

        return Inertia::render('assignment-progresses/show', [
            'assignmentProgress' => $assignmentProgress,
        ]);
    }

    public function edit(Request $request, AssignmentProgress $assignmentProgress): Response
    {
        $assignments = Assignment::select('id', 'title')->get();
        $employees = Employee::select('id', 'name')->get();

        return Inertia::render('assignment-progresses/edit', [
            'assignmentProgress' => $assignmentProgress,
            'assignments' => $assignments,
            'employees' => $employees,
        ]);
    }

    public function update(AssignmentProgressUpdateRequest $request, AssignmentProgress $assignmentProgress): RedirectResponse
    {
        $assignmentProgress->update($request->validated());

        return redirect()->route('assignment-progresses.index', ['assignment_id' => $assignmentProgress->assignment_id])
            ->with('success', 'Assignment progress updated successfully.');
    }

    public function destroy(Request $request, AssignmentProgress $assignmentProgress): RedirectResponse
    {
        $assignmentId = $assignmentProgress->assignment_id;
        $assignmentProgress->delete();

        return redirect()->route('assignment-progresses.index', ['assignment_id' => $assignmentId])
            ->with('success', 'Assignment progress removed.');
    }
}
