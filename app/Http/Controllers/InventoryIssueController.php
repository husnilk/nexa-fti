<?php

namespace App\Http\Controllers;

use App\Http\Requests\InventoryIssueStoreRequest;
use App\Http\Requests\InventoryIssueUpdateRequest;
use App\Models\InventoryIssue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class InventoryIssueController extends Controller
{
    public function index(Request $request): View
    {
        $inventoryIssues = InventoryIssue::all();

        return view('inventoryIssue.index', [
            'inventoryIssues' => $inventoryIssues,
        ]);
    }

    public function create(Request $request): View
    {
        return view('inventoryIssue.create');
    }

    public function store(InventoryIssueStoreRequest $request): RedirectResponse
    {
        $inventoryIssue = InventoryIssue::create($request->validated());

        $request->session()->flash('inventoryIssue.id', $inventoryIssue->id);

        return redirect()->route('inventoryIssues.index');
    }

    public function show(Request $request, InventoryIssue $inventoryIssue): View
    {
        return view('inventoryIssue.show', [
            'inventoryIssue' => $inventoryIssue,
        ]);
    }

    public function edit(Request $request, InventoryIssue $inventoryIssue): View
    {
        return view('inventoryIssue.edit', [
            'inventoryIssue' => $inventoryIssue,
        ]);
    }

    public function update(InventoryIssueUpdateRequest $request, InventoryIssue $inventoryIssue): RedirectResponse
    {
        $inventoryIssue->update($request->validated());

        $request->session()->flash('inventoryIssue.id', $inventoryIssue->id);

        return redirect()->route('inventoryIssues.index');
    }

    public function destroy(Request $request, InventoryIssue $inventoryIssue): RedirectResponse
    {
        $inventoryIssue->delete();

        return redirect()->route('inventoryIssues.index');
    }
}
