<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentMaintenanceActivityStoreRequest;
use App\Http\Requests\EquipmentMaintenanceActivityUpdateRequest;
use App\Models\EquipmentMaintenanceActivity;
use App\Models\EquipmentMaintenanceRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EquipmentMaintenanceActivityController extends Controller
{
    public function index(Request $request): Response
    {
        $equipmentMaintenanceActivities = EquipmentMaintenanceActivity::with('equipmentMaintenanceRequest.equipment')->get();

        return Inertia::render('equipment/maintenance-activities/index', [
            'equipmentMaintenanceActivities' => $equipmentMaintenanceActivities,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('equipment/maintenance-activities/create', [
            'maintenanceRequests' => EquipmentMaintenanceRequest::with('equipment')->get(),
        ]);
    }

    public function store(EquipmentMaintenanceActivityStoreRequest $request): RedirectResponse
    {
        EquipmentMaintenanceActivity::create($request->validated());

        return redirect()->route('equipment-maintenance-activities.index')->with('success', 'Maintenance activity created successfully.');
    }

    public function show(Request $request, EquipmentMaintenanceActivity $equipmentMaintenanceActivity): Response
    {
        return Inertia::render('equipment/maintenance-activities/show', [
            'equipmentMaintenanceActivity' => $equipmentMaintenanceActivity->load('equipmentMaintenanceRequest.equipment'),
        ]);
    }

    public function edit(Request $request, EquipmentMaintenanceActivity $equipmentMaintenanceActivity): Response
    {
        return Inertia::render('equipment/maintenance-activities/edit', [
            'equipmentMaintenanceActivity' => $equipmentMaintenanceActivity,
            'maintenanceRequests' => EquipmentMaintenanceRequest::with('equipment')->get(),
        ]);
    }

    public function update(EquipmentMaintenanceActivityUpdateRequest $request, EquipmentMaintenanceActivity $equipmentMaintenanceActivity): RedirectResponse
    {
        $equipmentMaintenanceActivity->update($request->validated());

        return redirect()->route('equipment-maintenance-activities.index')->with('success', 'Maintenance activity updated successfully.');
    }

    public function destroy(Request $request, EquipmentMaintenanceActivity $equipmentMaintenanceActivity): RedirectResponse
    {
        $equipmentMaintenanceActivity->delete();

        return redirect()->route('equipment-maintenance-activities.index')->with('success', 'Maintenance activity deleted successfully.');
    }
}
