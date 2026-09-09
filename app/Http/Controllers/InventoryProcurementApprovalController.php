<?php

namespace App\Http\Controllers;

use App\Http\Requests\InventoryProcurementApprovalStoreRequest;
use App\Http\Requests\InventoryProcurementApprovalUpdateRequest;
use App\Models\InventoryProcurementApproval;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class InventoryProcurementApprovalController extends Controller
{
    public function index(Request $request): View
    {
        $inventoryProcurementApprovals = InventoryProcurementApproval::all();

        return view('inventoryProcurementApproval.index', [
            'inventoryProcurementApprovals' => $inventoryProcurementApprovals,
        ]);
    }

    public function create(Request $request): View
    {
        return view('inventoryProcurementApproval.create');
    }

    public function store(InventoryProcurementApprovalStoreRequest $request): RedirectResponse
    {
        $inventoryProcurementApproval = InventoryProcurementApproval::create($request->validated());

        $request->session()->flash('inventoryProcurementApproval.id', $inventoryProcurementApproval->id);

        return redirect()->route('inventoryProcurementApprovals.index');
    }

    public function show(Request $request, InventoryProcurementApproval $inventoryProcurementApproval): View
    {
        return view('inventoryProcurementApproval.show', [
            'inventoryProcurementApproval' => $inventoryProcurementApproval,
        ]);
    }

    public function edit(Request $request, InventoryProcurementApproval $inventoryProcurementApproval): View
    {
        return view('inventoryProcurementApproval.edit', [
            'inventoryProcurementApproval' => $inventoryProcurementApproval,
        ]);
    }

    public function update(InventoryProcurementApprovalUpdateRequest $request, InventoryProcurementApproval $inventoryProcurementApproval): RedirectResponse
    {
        $inventoryProcurementApproval->update($request->validated());

        $request->session()->flash('inventoryProcurementApproval.id', $inventoryProcurementApproval->id);

        return redirect()->route('inventoryProcurementApprovals.index');
    }

    public function destroy(Request $request, InventoryProcurementApproval $inventoryProcurementApproval): RedirectResponse
    {
        $inventoryProcurementApproval->delete();

        return redirect()->route('inventoryProcurementApprovals.index');
    }
}
