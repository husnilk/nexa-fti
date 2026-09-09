<?php

namespace App\Http\Controllers;

use App\Http\Requests\ItemCategoryStoreRequest;
use App\Http\Requests\ItemCategoryUpdateRequest;
use App\Models\ItemCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ItemCategoryController extends Controller
{
    public function index(Request $request): View
    {
        $itemCategories = ItemCategory::all();

        return view('itemCategory.index', [
            'itemCategories' => $itemCategories,
        ]);
    }

    public function create(Request $request): View
    {
        return view('itemCategory.create');
    }

    public function store(ItemCategoryStoreRequest $request): RedirectResponse
    {
        $itemCategory = ItemCategory::create($request->validated());

        $request->session()->flash('itemCategory.id', $itemCategory->id);

        return redirect()->route('itemCategories.index');
    }

    public function show(Request $request, ItemCategory $itemCategory): View
    {
        return view('itemCategory.show', [
            'itemCategory' => $itemCategory,
        ]);
    }

    public function edit(Request $request, ItemCategory $itemCategory): View
    {
        return view('itemCategory.edit', [
            'itemCategory' => $itemCategory,
        ]);
    }

    public function update(ItemCategoryUpdateRequest $request, ItemCategory $itemCategory): RedirectResponse
    {
        $itemCategory->update($request->validated());

        $request->session()->flash('itemCategory.id', $itemCategory->id);

        return redirect()->route('itemCategories.index');
    }

    public function destroy(Request $request, ItemCategory $itemCategory): RedirectResponse
    {
        $itemCategory->delete();

        return redirect()->route('itemCategories.index');
    }
}
