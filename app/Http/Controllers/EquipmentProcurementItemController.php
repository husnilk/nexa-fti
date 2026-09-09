<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentProcurementItemStoreRequest;
use App\Http\Requests\EquipmentProcurementItemUpdateRequest;
use App\Models\EquipmentProcurementItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class EquipmentProcurementItemController extends Controller
{
    public function index(Request $request): View
    {
        $equipmentProcurementItems = EquipmentProcurementItem::all();

        return view('equipmentProcurementItem.index', [
            'equipmentProcurementItems' => $equipmentProcurementItems,
        ]);
    }

    public function create(Request $request): View
    {
        return view('equipmentProcurementItem.create');
    }

    public function store(EquipmentProcurementItemStoreRequest $request): RedirectResponse
    {
        $equipmentProcurementItem = EquipmentProcurementItem::create($request->validated());

        $request->session()->flash('equipmentProcurementItem.id', $equipmentProcurementItem->id);

        return redirect()->route('equipmentProcurementItems.index');
    }

    public function show(Request $request, EquipmentProcurementItem $equipmentProcurementItem): View
    {
        return view('equipmentProcurementItem.show', [
            'equipmentProcurementItem' => $equipmentProcurementItem,
        ]);
    }

    public function edit(Request $request, EquipmentProcurementItem $equipmentProcurementItem): View
    {
        return view('equipmentProcurementItem.edit', [
            'equipmentProcurementItem' => $equipmentProcurementItem,
        ]);
    }

    public function update(EquipmentProcurementItemUpdateRequest $request, EquipmentProcurementItem $equipmentProcurementItem): RedirectResponse
    {
        $equipmentProcurementItem->update($request->validated());

        $request->session()->flash('equipmentProcurementItem.id', $equipmentProcurementItem->id);

        return redirect()->route('equipmentProcurementItems.index');
    }

    public function destroy(Request $request, EquipmentProcurementItem $equipmentProcurementItem): RedirectResponse
    {
        $equipmentProcurementItem->delete();

        return redirect()->route('equipmentProcurementItems.index');
    }
}
