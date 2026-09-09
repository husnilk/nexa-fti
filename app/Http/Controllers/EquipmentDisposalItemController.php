<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentDisposalItemStoreRequest;
use App\Http\Requests\EquipmentDisposalItemUpdateRequest;
use App\Models\EquipmentDisposalItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class EquipmentDisposalItemController extends Controller
{
    public function index(Request $request): View
    {
        $equipmentDisposalItems = EquipmentDisposalItem::all();

        return view('equipmentDisposalItem.index', [
            'equipmentDisposalItems' => $equipmentDisposalItems,
        ]);
    }

    public function create(Request $request): View
    {
        return view('equipmentDisposalItem.create');
    }

    public function store(EquipmentDisposalItemStoreRequest $request): RedirectResponse
    {
        $equipmentDisposalItem = EquipmentDisposalItem::create($request->validated());

        $request->session()->flash('equipmentDisposalItem.id', $equipmentDisposalItem->id);

        return redirect()->route('equipmentDisposalItems.index');
    }

    public function show(Request $request, EquipmentDisposalItem $equipmentDisposalItem): View
    {
        return view('equipmentDisposalItem.show', [
            'equipmentDisposalItem' => $equipmentDisposalItem,
        ]);
    }

    public function edit(Request $request, EquipmentDisposalItem $equipmentDisposalItem): View
    {
        return view('equipmentDisposalItem.edit', [
            'equipmentDisposalItem' => $equipmentDisposalItem,
        ]);
    }

    public function update(EquipmentDisposalItemUpdateRequest $request, EquipmentDisposalItem $equipmentDisposalItem): RedirectResponse
    {
        $equipmentDisposalItem->update($request->validated());

        $request->session()->flash('equipmentDisposalItem.id', $equipmentDisposalItem->id);

        return redirect()->route('equipmentDisposalItems.index');
    }

    public function destroy(Request $request, EquipmentDisposalItem $equipmentDisposalItem): RedirectResponse
    {
        $equipmentDisposalItem->delete();

        return redirect()->route('equipmentDisposalItems.index');
    }
}
