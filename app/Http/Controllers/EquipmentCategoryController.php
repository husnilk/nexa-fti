<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentCategoryStoreRequest;
use App\Http\Requests\EquipmentCategoryUpdateRequest;
use App\Models\EquipmentCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EquipmentCategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $equipmentCategories = EquipmentCategory::all();

        return Inertia::render('equipment/categories/index', [
            'equipmentCategories' => $equipmentCategories,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('equipment/categories/create');
    }

    public function store(EquipmentCategoryStoreRequest $request): RedirectResponse
    {
        EquipmentCategory::create($request->validated());

        return redirect()->route('equipment-categories.index')->with('success', 'Equipment category created successfully.');
    }

    public function show(Request $request, EquipmentCategory $equipmentCategory): Response
    {
        return Inertia::render('equipment/categories/show', [
            'equipmentCategory' => $equipmentCategory->load('equipmentModels'),
        ]);
    }

    public function edit(Request $request, EquipmentCategory $equipmentCategory): Response
    {
        return Inertia::render('equipment/categories/edit', [
            'equipmentCategory' => $equipmentCategory,
        ]);
    }

    public function update(EquipmentCategoryUpdateRequest $request, EquipmentCategory $equipmentCategory): RedirectResponse
    {
        $equipmentCategory->update($request->validated());

        return redirect()->route('equipment-categories.index')->with('success', 'Equipment category updated successfully.');
    }

    public function destroy(Request $request, EquipmentCategory $equipmentCategory): RedirectResponse
    {
        $equipmentCategory->delete();

        return redirect()->route('equipment-categories.index')->with('success', 'Equipment category deleted successfully.');
    }
}
