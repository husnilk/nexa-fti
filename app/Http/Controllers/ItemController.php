<?php

namespace App\Http\Controllers;

use App\Http\Requests\ItemStoreRequest;
use App\Http\Requests\ItemUpdateRequest;
use App\Models\Item;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ItemController extends Controller
{
    public function index(Request $request): View
    {
        $items = Item::all();

        return view('item.index', [
            'items' => $items,
        ]);
    }

    public function create(Request $request): View
    {
        return view('item.create');
    }

    public function store(ItemStoreRequest $request): RedirectResponse
    {
        $item = Item::create($request->validated());

        $request->session()->flash('item.id', $item->id);

        return redirect()->route('items.index');
    }

    public function show(Request $request, Item $item): View
    {
        return view('item.show', [
            'item' => $item,
        ]);
    }

    public function edit(Request $request, Item $item): View
    {
        return view('item.edit', [
            'item' => $item,
        ]);
    }

    public function update(ItemUpdateRequest $request, Item $item): RedirectResponse
    {
        $item->update($request->validated());

        $request->session()->flash('item.id', $item->id);

        return redirect()->route('items.index');
    }

    public function destroy(Request $request, Item $item): RedirectResponse
    {
        $item->delete();

        return redirect()->route('items.index');
    }
}
