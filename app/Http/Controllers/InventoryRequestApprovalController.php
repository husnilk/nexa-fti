<?php

namespace App\Http\Controllers;

use App\Http\Requests\InventoryRequestApprovalStoreRequest;
use App\Http\Requests\InventoryRequestApprovalUpdateRequest;
use App\Models\InventoryRequestApproval;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class InventoryRequestApprovalController extends Controller
{
    public function index(Request $request): View
    {
        $inventoryRequestApprovals = InventoryRequestApproval::all();

        return view('inventoryRequestApproval.index', [
            'inventoryRequestApprovals' => $inventoryRequestApprovals,
        ]);
    }

    public function create(Request $request): View
    {
        return view('inventoryRequestApproval.create');
    }

    public function store(InventoryRequestApprovalStoreRequest $request): RedirectResponse
    {
        $inventoryRequestApproval = InventoryRequestApproval::create($request->validated());

        $request->session()->flash('inventoryRequestApproval.id', $inventoryRequestApproval->id);

        return redirect()->route('inventoryRequestApprovals.index');
    }

    public function show(Request $request, InventoryRequestApproval $inventoryRequestApproval): View
    {
        return view('inventoryRequestApproval.show', [
            'inventoryRequestApproval' => $inventoryRequestApproval,
        ]);
    }

    public function edit(Request $request, InventoryRequestApproval $inventoryRequestApproval): View
    {
        return view('inventoryRequestApproval.edit', [
            'inventoryRequestApproval' => $inventoryRequestApproval,
        ]);
    }

    public function update(InventoryRequestApprovalUpdateRequest $request, InventoryRequestApproval $inventoryRequestApproval): RedirectResponse
    {
        $inventoryRequestApproval->update($request->validated());

        $request->session()->flash('inventoryRequestApproval.id', $inventoryRequestApproval->id);

        return redirect()->route('inventoryRequestApprovals.index');
    }

    public function destroy(Request $request, InventoryRequestApproval $inventoryRequestApproval): RedirectResponse
    {
        $inventoryRequestApproval->delete();

        return redirect()->route('inventoryRequestApprovals.index');
    }
}
