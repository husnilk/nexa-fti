<?php

namespace App\Http\Controllers;

use App\Http\Requests\InventoryReceiptStoreRequest;
use App\Http\Requests\InventoryReceiptUpdateRequest;
use App\Models\InventoryReceipt;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class InventoryReceiptController extends Controller
{
    public function index(Request $request): View
    {
        $inventoryReceipts = InventoryReceipt::all();

        return view('inventoryReceipt.index', [
            'inventoryReceipts' => $inventoryReceipts,
        ]);
    }

    public function create(Request $request): View
    {
        return view('inventoryReceipt.create');
    }

    public function store(InventoryReceiptStoreRequest $request): RedirectResponse
    {
        $inventoryReceipt = InventoryReceipt::create($request->validated());

        $request->session()->flash('inventoryReceipt.id', $inventoryReceipt->id);

        return redirect()->route('inventoryReceipts.index');
    }

    public function show(Request $request, InventoryReceipt $inventoryReceipt): View
    {
        return view('inventoryReceipt.show', [
            'inventoryReceipt' => $inventoryReceipt,
        ]);
    }

    public function edit(Request $request, InventoryReceipt $inventoryReceipt): View
    {
        return view('inventoryReceipt.edit', [
            'inventoryReceipt' => $inventoryReceipt,
        ]);
    }

    public function update(InventoryReceiptUpdateRequest $request, InventoryReceipt $inventoryReceipt): RedirectResponse
    {
        $inventoryReceipt->update($request->validated());

        $request->session()->flash('inventoryReceipt.id', $inventoryReceipt->id);

        return redirect()->route('inventoryReceipts.index');
    }

    public function destroy(Request $request, InventoryReceipt $inventoryReceipt): RedirectResponse
    {
        $inventoryReceipt->delete();

        return redirect()->route('inventoryReceipts.index');
    }
}
