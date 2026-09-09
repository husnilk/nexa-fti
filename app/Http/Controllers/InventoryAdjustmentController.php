<?php

namespace App\Http\Controllers;

use App\Http\Requests\InventoryAdjustmentStoreRequest;
use App\Http\Requests\InventoryAdjustmentUpdateRequest;
use App\Models\InventoryAdjustment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class InventoryAdjustmentController extends Controller
{
    public function index(Request $request): View
    {
        $inventoryAdjustments = InventoryAdjustment::all();

        return view('inventoryAdjustment.index', [
            'inventoryAdjustments' => $inventoryAdjustments,
        ]);
    }

    public function create(Request $request): View
    {
        return view('inventoryAdjustment.create');
    }

    public function store(InventoryAdjustmentStoreRequest $request): RedirectResponse
    {
        $inventoryAdjustment = InventoryAdjustment::create($request->validated());

        $request->session()->flash('inventoryAdjustment.id', $inventoryAdjustment->id);

        return redirect()->route('inventoryAdjustments.index');
    }

    public function show(Request $request, InventoryAdjustment $inventoryAdjustment): View
    {
        return view('inventoryAdjustment.show', [
            'inventoryAdjustment' => $inventoryAdjustment,
        ]);
    }

    public function edit(Request $request, InventoryAdjustment $inventoryAdjustment): View
    {
        return view('inventoryAdjustment.edit', [
            'inventoryAdjustment' => $inventoryAdjustment,
        ]);
    }

    public function update(InventoryAdjustmentUpdateRequest $request, InventoryAdjustment $inventoryAdjustment): RedirectResponse
    {
        $inventoryAdjustment->update($request->validated());

        $request->session()->flash('inventoryAdjustment.id', $inventoryAdjustment->id);

        return redirect()->route('inventoryAdjustments.index');
    }

    public function destroy(Request $request, InventoryAdjustment $inventoryAdjustment): RedirectResponse
    {
        $inventoryAdjustment->delete();

        return redirect()->route('inventoryAdjustments.index');
    }
}
