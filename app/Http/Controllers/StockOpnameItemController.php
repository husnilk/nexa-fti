<?php

namespace App\Http\Controllers;

use App\Http\Requests\StockOpnameItemStoreRequest;
use App\Http\Requests\StockOpnameItemUpdateRequest;
use App\Models\StockOpnameItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class StockOpnameItemController extends Controller
{
    public function index(Request $request): View
    {
        $stockOpnameItems = StockOpnameItem::all();

        return view('stockOpnameItem.index', [
            'stockOpnameItems' => $stockOpnameItems,
        ]);
    }

    public function create(Request $request): View
    {
        return view('stockOpnameItem.create');
    }

    public function store(StockOpnameItemStoreRequest $request): RedirectResponse
    {
        $stockOpnameItem = StockOpnameItem::create($request->validated());

        $request->session()->flash('stockOpnameItem.id', $stockOpnameItem->id);

        return redirect()->route('stockOpnameItems.index');
    }

    public function show(Request $request, StockOpnameItem $stockOpnameItem): View
    {
        return view('stockOpnameItem.show', [
            'stockOpnameItem' => $stockOpnameItem,
        ]);
    }

    public function edit(Request $request, StockOpnameItem $stockOpnameItem): View
    {
        return view('stockOpnameItem.edit', [
            'stockOpnameItem' => $stockOpnameItem,
        ]);
    }

    public function update(StockOpnameItemUpdateRequest $request, StockOpnameItem $stockOpnameItem): RedirectResponse
    {
        $stockOpnameItem->update($request->validated());

        $request->session()->flash('stockOpnameItem.id', $stockOpnameItem->id);

        return redirect()->route('stockOpnameItems.index');
    }

    public function destroy(Request $request, StockOpnameItem $stockOpnameItem): RedirectResponse
    {
        $stockOpnameItem->delete();

        return redirect()->route('stockOpnameItems.index');
    }
}
