<?php

namespace App\Http\Controllers;

use App\Http\Requests\InventoryTransactionStoreRequest;
use App\Http\Requests\InventoryTransactionUpdateRequest;
use App\Models\InventoryTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class InventoryTransactionController extends Controller
{
    public function index(Request $request): View
    {
        $inventoryTransactions = InventoryTransaction::all();

        return view('inventoryTransaction.index', [
            'inventoryTransactions' => $inventoryTransactions,
        ]);
    }

    public function create(Request $request): View
    {
        return view('inventoryTransaction.create');
    }

    public function store(InventoryTransactionStoreRequest $request): RedirectResponse
    {
        $inventoryTransaction = InventoryTransaction::create($request->validated());

        $request->session()->flash('inventoryTransaction.id', $inventoryTransaction->id);

        return redirect()->route('inventoryTransactions.index');
    }

    public function show(Request $request, InventoryTransaction $inventoryTransaction): View
    {
        return view('inventoryTransaction.show', [
            'inventoryTransaction' => $inventoryTransaction,
        ]);
    }

    public function edit(Request $request, InventoryTransaction $inventoryTransaction): View
    {
        return view('inventoryTransaction.edit', [
            'inventoryTransaction' => $inventoryTransaction,
        ]);
    }

    public function update(InventoryTransactionUpdateRequest $request, InventoryTransaction $inventoryTransaction): RedirectResponse
    {
        $inventoryTransaction->update($request->validated());

        $request->session()->flash('inventoryTransaction.id', $inventoryTransaction->id);

        return redirect()->route('inventoryTransactions.index');
    }

    public function destroy(Request $request, InventoryTransaction $inventoryTransaction): RedirectResponse
    {
        $inventoryTransaction->delete();

        return redirect()->route('inventoryTransactions.index');
    }
}
