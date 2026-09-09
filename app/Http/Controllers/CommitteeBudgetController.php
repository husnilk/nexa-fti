<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommitteeBudgetStoreRequest;
use App\Http\Requests\CommitteeBudgetUpdateRequest;
use App\Models\CommitteeBudget;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommitteeBudgetController extends Controller
{
    public function index(Request $request): Response
    {
        $committeeBudgets = CommitteeBudget::with(['committee', 'preparedBy', 'approvedBy'])->get();

        return Inertia::render('committees/budgets/index', [
            'committeeBudgets' => $committeeBudgets,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('committees/budgets/create');
    }

    public function store(CommitteeBudgetStoreRequest $request): RedirectResponse
    {
        $committeeBudget = CommitteeBudget::create($request->validated());

        $request->session()->flash('committeeBudget.id', $committeeBudget->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee budget created successfully.');
        }

        return redirect()->route('committee-budgets.index')->with('success', 'Committee budget created successfully.');
    }

    public function show(Request $request, CommitteeBudget $committeeBudget): Response
    {
        $committeeBudget->load(['committee', 'preparedBy', 'approvedBy', 'committeeBudgetItems']);

        return Inertia::render('committees/budgets/show', [
            'committeeBudget' => $committeeBudget,
        ]);
    }

    public function edit(Request $request, CommitteeBudget $committeeBudget): Response
    {
        return Inertia::render('committees/budgets/edit', [
            'committeeBudget' => $committeeBudget,
        ]);
    }

    public function update(CommitteeBudgetUpdateRequest $request, CommitteeBudget $committeeBudget): RedirectResponse
    {
        $committeeBudget->update($request->validated());

        $request->session()->flash('committeeBudget.id', $committeeBudget->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee budget updated successfully.');
        }

        return redirect()->route('committee-budgets.index')->with('success', 'Committee budget updated successfully.');
    }

    public function destroy(Request $request, CommitteeBudget $committeeBudget): RedirectResponse
    {
        $committeeBudget->delete();

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee budget deleted successfully.');
        }

        return redirect()->route('committee-budgets.index')->with('success', 'Committee budget deleted successfully.');
    }
}
