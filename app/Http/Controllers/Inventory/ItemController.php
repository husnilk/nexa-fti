<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\ItemCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ItemController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:inventory.manage')->only(['index', 'store', 'update', 'destroy']);
    }

    public function index(): Response
    {
        return Inertia::render('inventory/items/index', [
            'items' => Item::with('itemCategory')->get(),
            'categories' => ItemCategory::all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'item_category_id' => 'required|exists:item_categories,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:items,code',
            'unit' => 'required|string|max:50',
            'minimal_quantity' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        Item::create($validated);

        return back()->with('success', 'Item created successfully.');
    }

    public function update(Request $request, Item $item): RedirectResponse
    {
        $validated = $request->validate([
            'item_category_id' => 'required|exists:item_categories,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:items,code,'.$item->id.',id',
            'unit' => 'required|string|max:50',
            'minimal_quantity' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $item->update($validated);

        return back()->with('success', 'Item updated successfully.');
    }

    public function destroy(Item $item): RedirectResponse
    {
        $item->delete();

        return back()->with('success', 'Item deleted successfully.');
    }
}
