<?php

namespace App\Http\Controllers;

use App\Http\Requests\InventoryProcurementItemStoreRequest;
use App\Http\Requests\InventoryProcurementItemUpdateRequest;
use App\Models\InventoryProcurementItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class InventoryProcurementItemController extends Controller
{
    public function index(Request $request): View
    {
        $inventoryProcurementItems = InventoryProcurementItem::all();

        return view('inventoryProcurementItem.index', [
            'inventoryProcurementItems' => $inventoryProcurementItems,
        ]);
    }

    public function create(Request $request): View
    {
        return view('inventoryProcurementItem.create');
    }

    public function store(InventoryProcurementItemStoreRequest $request): RedirectResponse
    {
        $inventoryProcurementItem = InventoryProcurementItem::create($request->validated());

        $request->session()->flash('inventoryProcurementItem.id', $inventoryProcurementItem->id);

        return redirect()->route('inventoryProcurementItems.index');
    }

    public function show(Request $request, InventoryProcurementItem $inventoryProcurementItem): View
    {
        return view('inventoryProcurementItem.show', [
            'inventoryProcurementItem' => $inventoryProcurementItem,
        ]);
    }

    public function edit(Request $request, InventoryProcurementItem $inventoryProcurementItem): View
    {
        return view('inventoryProcurementItem.edit', [
            'inventoryProcurementItem' => $inventoryProcurementItem,
        ]);
    }

    public function update(InventoryProcurementItemUpdateRequest $request, InventoryProcurementItem $inventoryProcurementItem): RedirectResponse
    {
        $inventoryProcurementItem->update($request->validated());

        $request->session()->flash('inventoryProcurementItem.id', $inventoryProcurementItem->id);

        return redirect()->route('inventoryProcurementItems.index');
    }

    public function destroy(Request $request, InventoryProcurementItem $inventoryProcurementItem): RedirectResponse
    {
        $inventoryProcurementItem->delete();

        return redirect()->route('inventoryProcurementItems.index');
    }
}
