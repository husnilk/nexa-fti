<?php

namespace App\Http\Controllers;

use App\Http\Requests\InventoryRequestStoreRequest;
use App\Http\Requests\InventoryRequestUpdateRequest;
use App\Models\InventoryRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class InventoryRequestController extends Controller
{
    public function index(Request $request): View
    {
        $inventoryRequests = InventoryRequest::all();

        return view('inventoryRequest.index', [
            'inventoryRequests' => $inventoryRequests,
        ]);
    }

    public function create(Request $request): View
    {
        return view('inventoryRequest.create');
    }

    public function store(InventoryRequestStoreRequest $request): RedirectResponse
    {
        $inventoryRequest = InventoryRequest::create($request->validated());

        $request->session()->flash('inventoryRequest.id', $inventoryRequest->id);

        return redirect()->route('inventoryRequests.index');
    }

    public function show(Request $request, InventoryRequest $inventoryRequest): View
    {
        return view('inventoryRequest.show', [
            'inventoryRequest' => $inventoryRequest,
        ]);
    }

    public function edit(Request $request, InventoryRequest $inventoryRequest): View
    {
        return view('inventoryRequest.edit', [
            'inventoryRequest' => $inventoryRequest,
        ]);
    }

    public function update(InventoryRequestUpdateRequest $request, InventoryRequest $inventoryRequest): RedirectResponse
    {
        $inventoryRequest->update($request->validated());

        $request->session()->flash('inventoryRequest.id', $inventoryRequest->id);

        return redirect()->route('inventoryRequests.index');
    }

    public function destroy(Request $request, InventoryRequest $inventoryRequest): RedirectResponse
    {
        $inventoryRequest->delete();

        return redirect()->route('inventoryRequests.index');
    }
}
