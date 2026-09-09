<?php

namespace App\Http\Controllers;

use App\Http\Requests\InventoryRequestDetailStoreRequest;
use App\Http\Requests\InventoryRequestDetailUpdateRequest;
use App\Models\InventoryRequestDetail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class InventoryRequestDetailController extends Controller
{
    public function index(Request $request): View
    {
        $inventoryRequestDetails = InventoryRequestDetail::all();

        return view('inventoryRequestDetail.index', [
            'inventoryRequestDetails' => $inventoryRequestDetails,
        ]);
    }

    public function create(Request $request): View
    {
        return view('inventoryRequestDetail.create');
    }

    public function store(InventoryRequestDetailStoreRequest $request): RedirectResponse
    {
        $inventoryRequestDetail = InventoryRequestDetail::create($request->validated());

        $request->session()->flash('inventoryRequestDetail.id', $inventoryRequestDetail->id);

        return redirect()->route('inventoryRequestDetails.index');
    }

    public function show(Request $request, InventoryRequestDetail $inventoryRequestDetail): View
    {
        return view('inventoryRequestDetail.show', [
            'inventoryRequestDetail' => $inventoryRequestDetail,
        ]);
    }

    public function edit(Request $request, InventoryRequestDetail $inventoryRequestDetail): View
    {
        return view('inventoryRequestDetail.edit', [
            'inventoryRequestDetail' => $inventoryRequestDetail,
        ]);
    }

    public function update(InventoryRequestDetailUpdateRequest $request, InventoryRequestDetail $inventoryRequestDetail): RedirectResponse
    {
        $inventoryRequestDetail->update($request->validated());

        $request->session()->flash('inventoryRequestDetail.id', $inventoryRequestDetail->id);

        return redirect()->route('inventoryRequestDetails.index');
    }

    public function destroy(Request $request, InventoryRequestDetail $inventoryRequestDetail): RedirectResponse
    {
        $inventoryRequestDetail->delete();

        return redirect()->route('inventoryRequestDetails.index');
    }
}
