<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\ItemCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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
            'items' => Item::with(['itemCategory', 'variants'])->get(),
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
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:2048',
            'variants' => 'nullable|array',
            'variants.*' => 'nullable',
        ]);

        DB::transaction(function () use ($request, $validated) {
            $variants = $validated['variants'] ?? [];
            unset($validated['variants']);

            if ($request->hasFile('picture')) {
                $validated['picture'] = $request->file('picture')->store('items', 'public');
            }

            $item = Item::create($validated);

            if (! empty($variants)) {
                foreach ($variants as $variant) {
                    $variantName = is_array($variant) ? ($variant['name'] ?? null) : (string) $variant;
                    $variantName = trim((string) $variantName);
                    if ($variantName !== '') {
                        $item->variants()->create(['name' => $variantName]);
                    }
                }
            }
        });

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
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:2048',
            'remove_picture' => 'nullable|boolean',
            'variants' => 'nullable|array',
            'variants.*' => 'nullable',
        ]);

        DB::transaction(function () use ($request, $validated, $item) {
            $variants = $validated['variants'] ?? null;
            unset($validated['variants']);

            if ($request->hasFile('picture')) {
                if ($item->picture && Storage::disk('public')->exists($item->picture)) {
                    Storage::disk('public')->delete($item->picture);
                }
                $validated['picture'] = $request->file('picture')->store('items', 'public');
            } elseif ($request->boolean('remove_picture')) {
                if ($item->picture && Storage::disk('public')->exists($item->picture)) {
                    Storage::disk('public')->delete($item->picture);
                }
                $validated['picture'] = null;
            } else {
                unset($validated['picture']);
            }

            unset($validated['remove_picture']);

            $item->update($validated);

            if ($request->has('variants')) {
                $item->variants()->delete();
                if (! empty($variants)) {
                    foreach ($variants as $variant) {
                        $variantName = is_array($variant) ? ($variant['name'] ?? null) : (string) $variant;
                        $variantName = trim((string) $variantName);
                        if ($variantName !== '') {
                            $item->variants()->create(['name' => $variantName]);
                        }
                    }
                }
            }
        });

        return back()->with('success', 'Item updated successfully.');
    }

    public function destroy(Item $item): RedirectResponse
    {
        if ($item->picture && Storage::disk('public')->exists($item->picture)) {
            Storage::disk('public')->delete($item->picture);
        }

        $item->delete();

        return back()->with('success', 'Item deleted successfully.');
    }
}
