<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentReceiptItemStoreRequest;
use App\Http\Requests\EquipmentReceiptItemUpdateRequest;
use App\Models\EquipmentReceiptItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class EquipmentReceiptItemController extends Controller
{
    public function index(Request $request): View
    {
        $equipmentReceiptItems = EquipmentReceiptItem::all();

        return view('equipmentReceiptItem.index', [
            'equipmentReceiptItems' => $equipmentReceiptItems,
        ]);
    }

    public function create(Request $request): View
    {
        return view('equipmentReceiptItem.create');
    }

    public function store(EquipmentReceiptItemStoreRequest $request): RedirectResponse
    {
        $equipmentReceiptItem = EquipmentReceiptItem::create($request->validated());

        $request->session()->flash('equipmentReceiptItem.id', $equipmentReceiptItem->id);

        return redirect()->route('equipmentReceiptItems.index');
    }

    public function show(Request $request, EquipmentReceiptItem $equipmentReceiptItem): View
    {
        return view('equipmentReceiptItem.show', [
            'equipmentReceiptItem' => $equipmentReceiptItem,
        ]);
    }

    public function edit(Request $request, EquipmentReceiptItem $equipmentReceiptItem): View
    {
        return view('equipmentReceiptItem.edit', [
            'equipmentReceiptItem' => $equipmentReceiptItem,
        ]);
    }

    public function update(EquipmentReceiptItemUpdateRequest $request, EquipmentReceiptItem $equipmentReceiptItem): RedirectResponse
    {
        $equipmentReceiptItem->update($request->validated());

        $request->session()->flash('equipmentReceiptItem.id', $equipmentReceiptItem->id);

        return redirect()->route('equipmentReceiptItems.index');
    }

    public function destroy(Request $request, EquipmentReceiptItem $equipmentReceiptItem): RedirectResponse
    {
        $equipmentReceiptItem->delete();

        return redirect()->route('equipmentReceiptItems.index');
    }
}
