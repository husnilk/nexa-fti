<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\AssignmentStoreRequest;
use App\Http\Requests\AssignmentUpdateRequest;
use App\Models\Assignment;
use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssignmentController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:assignment.view|assignment.manage')->only(['index', 'show']);
        $this->middleware('permission:assignment.manage')->only(['create', 'store', 'edit', 'update', 'destroy']);
    }

    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $assignments = Assignment::with(['assignedByEmployee', 'assignedToEmployee'])
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->get();

        return Inertia::render('assignments/index', [
            'assignments' => $assignments,
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? '',
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        $employees = Employee::select('id', 'name')->get();
        $parentAssignments = Assignment::select('id', 'title')->get();

        return Inertia::render('assignments/create', [
            'employees' => $employees,
            'parentAssignments' => $parentAssignments,
        ]);
    }

    public function store(AssignmentStoreRequest $request): RedirectResponse
    {
        Assignment::create($request->validated());

        return redirect()->route('assignments.index')
            ->with('success', 'Assignment created successfully.');
    }

    public function show(Request $request, Assignment $assignment): Response
    {
        $assignment->load(['assignedByEmployee', 'assignedToEmployee', 'parent', 'progresses']);

        return Inertia::render('assignments/show', [
            'assignment' => $assignment,
        ]);
    }

    public function edit(Request $request, Assignment $assignment): Response
    {
        $employees = Employee::select('id', 'name')->get();
        $parentAssignments = Assignment::select('id', 'title')->where('id', '!=', $assignment->id)->get();

        return Inertia::render('assignments/edit', [
            'assignment' => $assignment,
            'employees' => $employees,
            'parentAssignments' => $parentAssignments,
        ]);
    }

    public function update(AssignmentUpdateRequest $request, Assignment $assignment): RedirectResponse
    {
        $assignment->update($request->validated());

        return redirect()->route('assignments.index')
            ->with('success', 'Assignment updated successfully.');
    }

    public function destroy(Request $request, Assignment $assignment): RedirectResponse
    {
        $assignment->delete();

        return redirect()->route('assignments.index')
            ->with('success', 'Assignment deleted successfully.');
    }
}
