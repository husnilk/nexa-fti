<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommitteeStoreRequest;
use App\Http\Requests\CommitteeUpdateRequest;
use App\Models\Committee;
use App\Models\Employee;
use App\Models\Organization;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommitteeController extends Controller
{
    public function index(Request $request): Response
    {
        $committees = Committee::with(['chairman', 'organization'])->get();
        $employees = Employee::all(['id', 'name']);
        $organizations = Organization::all(['id', 'name']);

        return Inertia::render('committees/index', [
            'committees' => $committees,
            'employees' => $employees,
            'organizations' => $organizations,
        ]);
    }

    public function create(Request $request): Response
    {
        $employees = Employee::all(['id', 'name']);
        $organizations = Organization::all(['id', 'name']);

        return Inertia::render('committees/create', [
            'employees' => $employees,
            'organizations' => $organizations,
        ]);
    }

    public function store(CommitteeStoreRequest $request): RedirectResponse
    {
        $committee = Committee::create($request->validated());

        $request->session()->flash('committee.id', $committee->id);

        return redirect()->route('committees.index')->with('success', 'Committee created successfully.');
    }

    public function show(Request $request, Committee $committee): Response
    {
        $committee->load([
            'chairman',
            'organization',
            'committeeMembers.user',
            'committeeMembers.supervisor',
            'committeeTasks.assignedTo.user',
            'committeeTasks.committeeTaskProgresses.createdBy',
            'committeeBudgets.committeeBudgetItems',
            'committeeBudgets.preparedBy',
            'committeeBudgets.approvedBy',
            'committeeExpenses.committeeExpenseItems.committeeBudgetItem',
            'committeeExpenses.submittedBy',
            'committeeExpenses.approvedBy',
            'committeeDocuments.uploadedBy',
        ]);

        $employees = Employee::all(['id', 'name']);
        $organizations = Organization::all(['id', 'name']);

        return Inertia::render('committees/show', [
            'committee' => $committee,
            'employees' => $employees,
            'organizations' => $organizations,
        ]);
    }

    public function edit(Request $request, Committee $committee): Response
    {
        $employees = Employee::all(['id', 'name']);
        $organizations = Organization::all(['id', 'name']);

        return Inertia::render('committees/edit', [
            'committee' => $committee,
            'employees' => $employees,
            'organizations' => $organizations,
        ]);
    }

    public function update(CommitteeUpdateRequest $request, Committee $committee): RedirectResponse
    {
        $committee->update($request->validated());

        $request->session()->flash('committee.id', $committee->id);

        return redirect()->route('committees.index')->with('success', 'Committee updated successfully.');
    }

    public function destroy(Request $request, Committee $committee): RedirectResponse
    {
        $committee->delete();

        return redirect()->route('committees.index')->with('success', 'Committee deleted successfully.');
    }
}
