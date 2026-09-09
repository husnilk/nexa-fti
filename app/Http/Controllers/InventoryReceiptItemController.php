<?php

namespace App\Http\Controllers;

use App\Http\Requests\InventoryReceiptItemStoreRequest;
use App\Http\Requests\InventoryReceiptItemUpdateRequest;
use App\Models\InventoryReceiptItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class InventoryReceiptItemController extends Controller
{
    public function index(Request $request): View
    {
        $inventoryReceiptItems = InventoryReceiptItem::all();

        return view('inventoryReceiptItem.index', [
            'inventoryReceiptItems' => $inventoryReceiptItems,
        ]);
    }

    public function create(Request $request): View
    {
        return view('inventoryReceiptItem.create');
    }

    public function store(InventoryReceiptItemStoreRequest $request): RedirectResponse
    {
        $inventoryReceiptItem = InventoryReceiptItem::create($request->validated());

        $request->session()->flash('inventoryReceiptItem.id', $inventoryReceiptItem->id);

        return redirect()->route('inventoryReceiptItems.index');
    }

    public function show(Request $request, InventoryReceiptItem $inventoryReceiptItem): View
    {
        return view('inventoryReceiptItem.show', [
            'inventoryReceiptItem' => $inventoryReceiptItem,
        ]);
    }

    public function edit(Request $request, InventoryReceiptItem $inventoryReceiptItem): View
    {
        return view('inventoryReceiptItem.edit', [
            'inventoryReceiptItem' => $inventoryReceiptItem,
        ]);
    }

    public function update(InventoryReceiptItemUpdateRequest $request, InventoryReceiptItem $inventoryReceiptItem): RedirectResponse
    {
        $inventoryReceiptItem->update($request->validated());

        $request->session()->flash('inventoryReceiptItem.id', $inventoryReceiptItem->id);

        return redirect()->route('inventoryReceiptItems.index');
    }

    public function destroy(Request $request, InventoryReceiptItem $inventoryReceiptItem): RedirectResponse
    {
        $inventoryReceiptItem->delete();

        return redirect()->route('inventoryReceiptItems.index');
    }
}
