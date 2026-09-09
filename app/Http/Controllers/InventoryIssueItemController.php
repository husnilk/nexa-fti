<?php

namespace App\Http\Controllers;

use App\Http\Requests\InventoryIssueItemStoreRequest;
use App\Http\Requests\InventoryIssueItemUpdateRequest;
use App\Models\InventoryIssueItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class InventoryIssueItemController extends Controller
{
    public function index(Request $request): View
    {
        $inventoryIssueItems = InventoryIssueItem::all();

        return view('inventoryIssueItem.index', [
            'inventoryIssueItems' => $inventoryIssueItems,
        ]);
    }

    public function create(Request $request): View
    {
        return view('inventoryIssueItem.create');
    }

    public function store(InventoryIssueItemStoreRequest $request): RedirectResponse
    {
        $inventoryIssueItem = InventoryIssueItem::create($request->validated());

        $request->session()->flash('inventoryIssueItem.id', $inventoryIssueItem->id);

        return redirect()->route('inventoryIssueItems.index');
    }

    public function show(Request $request, InventoryIssueItem $inventoryIssueItem): View
    {
        return view('inventoryIssueItem.show', [
            'inventoryIssueItem' => $inventoryIssueItem,
        ]);
    }

    public function edit(Request $request, InventoryIssueItem $inventoryIssueItem): View
    {
        return view('inventoryIssueItem.edit', [
            'inventoryIssueItem' => $inventoryIssueItem,
        ]);
    }

    public function update(InventoryIssueItemUpdateRequest $request, InventoryIssueItem $inventoryIssueItem): RedirectResponse
    {
        $inventoryIssueItem->update($request->validated());

        $request->session()->flash('inventoryIssueItem.id', $inventoryIssueItem->id);

        return redirect()->route('inventoryIssueItems.index');
    }

    public function destroy(Request $request, InventoryIssueItem $inventoryIssueItem): RedirectResponse
    {
        $inventoryIssueItem->delete();

        return redirect()->route('inventoryIssueItems.index');
    }
}
