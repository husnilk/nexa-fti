<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\Warehouse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WarehouseController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:inventory.manage')->only(['index', 'store', 'update', 'destroy']);
    }

    public function index(): Response
    {
        return Inertia::render('inventory/warehouses/index', [
            'warehouses' => Warehouse::with('organization')->get(),
            'organizations' => Organization::all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'organization_id' => 'required|exists:organizations,id',
            'code' => 'required|string|unique:warehouses,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'required|boolean',
        ]);

        Warehouse::create($validated);

        return back()->with('success', 'Warehouse created successfully.');
    }

    public function update(Request $request, Warehouse $warehouse): RedirectResponse
    {
        $validated = $request->validate([
            'organization_id' => 'required|exists:organizations,id',
            'code' => 'required|string|unique:warehouses,code,'.$warehouse->id.',id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'required|boolean',
        ]);

        $warehouse->update($validated);

        return back()->with('success', 'Warehouse updated successfully.');
    }

    public function destroy(Warehouse $warehouse): RedirectResponse
    {
        $warehouse->delete();

        return back()->with('success', 'Warehouse deleted successfully.');
    }
}
