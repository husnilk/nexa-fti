<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\ItemCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ItemCategoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:inventory.manage')->only(['index', 'store', 'update', 'destroy']);
    }

    public function index(): Response
    {
        return Inertia::render('inventory/categories/index', [
            'categories' => ItemCategory::all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        ItemCategory::create($validated);

        return back()->with('success', 'Category created successfully.');
    }

    public function update(Request $request, ItemCategory $itemCategory): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $itemCategory->update($validated);

        return back()->with('success', 'Category updated successfully.');
    }

    public function destroy(ItemCategory $itemCategory): RedirectResponse
    {
        $itemCategory->delete();

        return back()->with('success', 'Category deleted successfully.');
    }
}
