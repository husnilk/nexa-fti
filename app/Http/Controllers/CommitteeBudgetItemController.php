<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommitteeBudgetItemStoreRequest;
use App\Http\Requests\CommitteeBudgetItemUpdateRequest;
use App\Models\CommitteeBudgetItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommitteeBudgetItemController extends Controller
{
    public function index(Request $request): Response
    {
        $committeeBudgetItems = CommitteeBudgetItem::with(['committeeBudget'])->get();

        return Inertia::render('committees/budget-items/index', [
            'committeeBudgetItems' => $committeeBudgetItems,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('committees/budget-items/create');
    }

    public function store(CommitteeBudgetItemStoreRequest $request): RedirectResponse
    {
        $committeeBudgetItem = CommitteeBudgetItem::create($request->validated());

        $request->session()->flash('committeeBudgetItem.id', $committeeBudgetItem->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee budget item created successfully.');
        }

        return redirect()->route('committee-budget-items.index')->with('success', 'Committee budget item created successfully.');
    }

    public function show(Request $request, CommitteeBudgetItem $committeeBudgetItem): Response
    {
        $committeeBudgetItem->load(['committeeBudget']);

        return Inertia::render('committees/budget-items/show', [
            'committeeBudgetItem' => $committeeBudgetItem,
        ]);
    }

    public function edit(Request $request, CommitteeBudgetItem $committeeBudgetItem): Response
    {
        return Inertia::render('committees/budget-items/edit', [
            'committeeBudgetItem' => $committeeBudgetItem,
        ]);
    }

    public function update(CommitteeBudgetItemUpdateRequest $request, CommitteeBudgetItem $committeeBudgetItem): RedirectResponse
    {
        $committeeBudgetItem->update($request->validated());

        $request->session()->flash('committeeBudgetItem.id', $committeeBudgetItem->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee budget item updated successfully.');
        }

        return redirect()->route('committee-budget-items.index')->with('success', 'Committee budget item updated successfully.');
    }

    public function destroy(Request $request, CommitteeBudgetItem $committeeBudgetItem): RedirectResponse
    {
        $committeeBudgetItem->delete();

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee budget item deleted successfully.');
        }

        return redirect()->route('committee-budget-items.index')->with('success', 'Committee budget item deleted successfully.');
    }
}
