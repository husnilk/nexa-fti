<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentStoreRequest;
use App\Http\Requests\EquipmentUpdateRequest;
use App\Models\Equipment;
use App\Models\EquipmentModel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EquipmentController extends Controller
{
    public function index(Request $request): Response
    {
        $equipment = Equipment::with('equipmentModel')->get();

        return Inertia::render('equipment/index', [
            'equipment' => $equipment,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('equipment/create', [
            'equipmentModels' => EquipmentModel::all(),
        ]);
    }

    public function store(EquipmentStoreRequest $request): RedirectResponse
    {
        Equipment::create($request->validated());

        return redirect()->route('equipment.index')->with('success', 'Equipment created successfully.');
    }

    public function show(Request $request, Equipment $equipment): Response
    {
        return Inertia::render('equipment/show', [
            'equipment' => $equipment->load('equipmentModel', 'equipmentMaintenanceRequests.equipmentMaintenanceActivities'),
        ]);
    }

    public function edit(Request $request, Equipment $equipment): Response
    {
        return Inertia::render('equipment/edit', [
            'equipment' => $equipment,
            'equipmentModels' => EquipmentModel::all(),
        ]);
    }

    public function update(EquipmentUpdateRequest $request, Equipment $equipment): RedirectResponse
    {
        $equipment->update($request->validated());

        return redirect()->route('equipment.index')->with('success', 'Equipment updated successfully.');
    }

    public function destroy(Request $request, Equipment $equipment): RedirectResponse
    {
        $equipment->delete();

        return redirect()->route('equipment.index')->with('success', 'Equipment deleted successfully.');
    }
}
