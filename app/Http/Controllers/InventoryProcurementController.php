<?php

namespace App\Http\Controllers;

use App\Http\Requests\InventoryProcurementStoreRequest;
use App\Http\Requests\InventoryProcurementUpdateRequest;
use App\Models\InventoryProcurement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class InventoryProcurementController extends Controller
{
    public function index(Request $request): View
    {
        $inventoryProcurements = InventoryProcurement::all();

        return view('inventoryProcurement.index', [
            'inventoryProcurements' => $inventoryProcurements,
        ]);
    }

    public function create(Request $request): View
    {
        return view('inventoryProcurement.create');
    }

    public function store(InventoryProcurementStoreRequest $request): RedirectResponse
    {
        $inventoryProcurement = InventoryProcurement::create($request->validated());

        $request->session()->flash('inventoryProcurement.id', $inventoryProcurement->id);

        return redirect()->route('inventoryProcurements.index');
    }

    public function show(Request $request, InventoryProcurement $inventoryProcurement): View
    {
        return view('inventoryProcurement.show', [
            'inventoryProcurement' => $inventoryProcurement,
        ]);
    }

    public function edit(Request $request, InventoryProcurement $inventoryProcurement): View
    {
        return view('inventoryProcurement.edit', [
            'inventoryProcurement' => $inventoryProcurement,
        ]);
    }

    public function update(InventoryProcurementUpdateRequest $request, InventoryProcurement $inventoryProcurement): RedirectResponse
    {
        $inventoryProcurement->update($request->validated());

        $request->session()->flash('inventoryProcurement.id', $inventoryProcurement->id);

        return redirect()->route('inventoryProcurements.index');
    }

    public function destroy(Request $request, InventoryProcurement $inventoryProcurement): RedirectResponse
    {
        $inventoryProcurement->delete();

        return redirect()->route('inventoryProcurements.index');
    }
}
