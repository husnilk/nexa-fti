<?php

namespace App\Http\Controllers;

use App\Http\Requests\InventoryStoreRequest;
use App\Http\Requests\InventoryUpdateRequest;
use App\Models\Inventory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class InventoryController extends Controller
{
    public function index(Request $request): View
    {
        $inventories = Inventory::all();

        return view('inventory.index', [
            'inventories' => $inventories,
        ]);
    }

    public function create(Request $request): View
    {
        return view('inventory.manage');
    }

    public function store(InventoryStoreRequest $request): RedirectResponse
    {
        $inventory = Inventory::create($request->validated());

        $request->session()->flash('inventory.id', $inventory->id);

        return redirect()->route('inventories.index');
    }

    public function show(Request $request, Inventory $inventory): View
    {
        return view('inventory.show', [
            'inventory' => $inventory,
        ]);
    }

    public function edit(Request $request, Inventory $inventory): View
    {
        return view('inventory.edit', [
            'inventory' => $inventory,
        ]);
    }

    public function update(InventoryUpdateRequest $request, Inventory $inventory): RedirectResponse
    {
        $inventory->update($request->validated());

        $request->session()->flash('inventory.id', $inventory->id);

        return redirect()->route('inventories.index');
    }

    public function destroy(Request $request, Inventory $inventory): RedirectResponse
    {
        $inventory->delete();

        return redirect()->route('inventories.index');
    }
}
