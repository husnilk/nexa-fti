<?php

namespace App\Http\Controllers;

use App\Http\Requests\WarehouseStoreRequest;
use App\Http\Requests\WarehouseUpdateRequest;
use App\Models\Warehouse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class WarehouseController extends Controller
{
    public function index(Request $request): View
    {
        $warehouses = Warehouse::all();

        return view('warehouse.index', [
            'warehouses' => $warehouses,
        ]);
    }

    public function create(Request $request): View
    {
        return view('warehouse.create');
    }

    public function store(WarehouseStoreRequest $request): RedirectResponse
    {
        $warehouse = Warehouse::create($request->validated());

        $request->session()->flash('warehouse.id', $warehouse->id);

        return redirect()->route('warehouses.index');
    }

    public function show(Request $request, Warehouse $warehouse): View
    {
        return view('warehouse.show', [
            'warehouse' => $warehouse,
        ]);
    }

    public function edit(Request $request, Warehouse $warehouse): View
    {
        return view('warehouse.edit', [
            'warehouse' => $warehouse,
        ]);
    }

    public function update(WarehouseUpdateRequest $request, Warehouse $warehouse): RedirectResponse
    {
        $warehouse->update($request->validated());

        $request->session()->flash('warehouse.id', $warehouse->id);

        return redirect()->route('warehouses.index');
    }

    public function destroy(Request $request, Warehouse $warehouse): RedirectResponse
    {
        $warehouse->delete();

        return redirect()->route('warehouses.index');
    }
}
