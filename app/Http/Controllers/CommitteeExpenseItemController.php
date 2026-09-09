<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommitteeExpenseItemStoreRequest;
use App\Http\Requests\CommitteeExpenseItemUpdateRequest;
use App\Models\CommitteeExpenseItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommitteeExpenseItemController extends Controller
{
    public function index(Request $request): Response
    {
        $committeeExpenseItems = CommitteeExpenseItem::with(['committeeExpense', 'committeeBudgetItem'])->get();

        return Inertia::render('committees/expense-items/index', [
            'committeeExpenseItems' => $committeeExpenseItems,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('committees/expense-items/create');
    }

    public function store(CommitteeExpenseItemStoreRequest $request): RedirectResponse
    {
        $committeeExpenseItem = CommitteeExpenseItem::create($request->validated());

        $request->session()->flash('committeeExpenseItem.id', $committeeExpenseItem->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee expense item created successfully.');
        }

        return redirect()->route('committee-expense-items.index')->with('success', 'Committee expense item created successfully.');
    }

    public function show(Request $request, CommitteeExpenseItem $committeeExpenseItem): Response
    {
        $committeeExpenseItem->load(['committeeExpense', 'committeeBudgetItem']);

        return Inertia::render('committees/expense-items/show', [
            'committeeExpenseItem' => $committeeExpenseItem,
        ]);
    }

    public function edit(Request $request, CommitteeExpenseItem $committeeExpenseItem): Response
    {
        return Inertia::render('committees/expense-items/edit', [
            'committeeExpenseItem' => $committeeExpenseItem,
        ]);
    }

    public function update(CommitteeExpenseItemUpdateRequest $request, CommitteeExpenseItem $committeeExpenseItem): RedirectResponse
    {
        $committeeExpenseItem->update($request->validated());

        $request->session()->flash('committeeExpenseItem.id', $committeeExpenseItem->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee expense item updated successfully.');
        }

        return redirect()->route('committee-expense-items.index')->with('success', 'Committee expense item updated successfully.');
    }

    public function destroy(Request $request, CommitteeExpenseItem $committeeExpenseItem): RedirectResponse
    {
        $committeeExpenseItem->delete();

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee expense item deleted successfully.');
        }

        return redirect()->route('committee-expense-items.index')->with('success', 'Committee expense item deleted successfully.');
    }
}
