<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentModelStoreRequest;
use App\Http\Requests\EquipmentModelUpdateRequest;
use App\Models\EquipmentCategory;
use App\Models\EquipmentModel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EquipmentModelController extends Controller
{
    public function index(Request $request): Response
    {
        $equipmentModels = EquipmentModel::with('equipmentCategory')->get();

        return Inertia::render('equipment/models/index', [
            'equipmentModels' => $equipmentModels,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('equipment/models/create', [
            'categories' => EquipmentCategory::all(),
        ]);
    }

    public function store(EquipmentModelStoreRequest $request): RedirectResponse
    {
        EquipmentModel::create($request->validated());

        return redirect()->route('equipment-models.index')->with('success', 'Equipment model created successfully.');
    }

    public function show(Request $request, EquipmentModel $equipmentModel): Response
    {
        return Inertia::render('equipment/models/show', [
            'equipmentModel' => $equipmentModel->load('equipmentCategory', 'equipment'),
        ]);
    }

    public function edit(Request $request, EquipmentModel $equipmentModel): Response
    {
        return Inertia::render('equipment/models/edit', [
            'equipmentModel' => $equipmentModel,
            'categories' => EquipmentCategory::all(),
        ]);
    }

    public function update(EquipmentModelUpdateRequest $request, EquipmentModel $equipmentModel): RedirectResponse
    {
        $equipmentModel->update($request->validated());

        return redirect()->route('equipment-models.index')->with('success', 'Equipment model updated successfully.');
    }

    public function destroy(Request $request, EquipmentModel $equipmentModel): RedirectResponse
    {
        $equipmentModel->delete();

        return redirect()->route('equipment-models.index')->with('success', 'Equipment model deleted successfully.');
    }
}
