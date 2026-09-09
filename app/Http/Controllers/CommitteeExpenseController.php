<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommitteeExpenseStoreRequest;
use App\Http\Requests\CommitteeExpenseUpdateRequest;
use App\Models\CommitteeExpense;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommitteeExpenseController extends Controller
{
    public function index(Request $request): Response
    {
        $committeeExpenses = CommitteeExpense::with(['committee', 'submittedBy', 'approvedBy'])->get();

        return Inertia::render('committees/expenses/index', [
            'committeeExpenses' => $committeeExpenses,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('committees/expenses/create');
    }

    public function store(CommitteeExpenseStoreRequest $request): RedirectResponse
    {
        $committeeExpense = CommitteeExpense::create($request->validated());

        $request->session()->flash('committeeExpense.id', $committeeExpense->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee expense created successfully.');
        }

        return redirect()->route('committee-expenses.index')->with('success', 'Committee expense created successfully.');
    }

    public function show(Request $request, CommitteeExpense $committeeExpense): Response
    {
        $committeeExpense->load(['committee', 'submittedBy', 'approvedBy', 'committeeExpenseItems']);

        return Inertia::render('committees/expenses/show', [
            'committeeExpense' => $committeeExpense,
        ]);
    }

    public function edit(Request $request, CommitteeExpense $committeeExpense): Response
    {
        return Inertia::render('committees/expenses/edit', [
            'committeeExpense' => $committeeExpense,
        ]);
    }

    public function update(CommitteeExpenseUpdateRequest $request, CommitteeExpense $committeeExpense): RedirectResponse
    {
        $committeeExpense->update($request->validated());

        $request->session()->flash('committeeExpense.id', $committeeExpense->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee expense updated successfully.');
        }

        return redirect()->route('committee-expenses.index')->with('success', 'Committee expense updated successfully.');
    }

    public function destroy(Request $request, CommitteeExpense $committeeExpense): RedirectResponse
    {
        $committeeExpense->delete();

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee expense deleted successfully.');
        }

        return redirect()->route('committee-expenses.index')->with('success', 'Committee expense deleted successfully.');
    }
}
