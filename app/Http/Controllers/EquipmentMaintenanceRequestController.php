<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentMaintenanceRequestStoreRequest;
use App\Http\Requests\EquipmentMaintenanceRequestUpdateRequest;
use App\Models\Equipment;
use App\Models\EquipmentMaintenanceActivity;
use App\Models\EquipmentMaintenanceRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class EquipmentMaintenanceRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $query = EquipmentMaintenanceRequest::with(['equipment', 'reportedByEmployee.user']);

        if (! $user->can('maintenance.view') && ! $user->can('equipment.manage')) {
            $query->where('reported_by_id', $user->id);
        }

        return Inertia::render('equipment/maintenance-requests/index', [
            'equipmentMaintenanceRequests' => $query->latest()->get(),
            'equipment' => Equipment::all(['id', 'equipment_number', 'serial_number']),
        ]);
    }

    public function create(Request $request): Response
    {
        Gate::authorize('create', EquipmentMaintenanceRequest::class);

        return Inertia::render('equipment/maintenance-requests/create', [
            'equipment' => Equipment::all(['id', 'equipment_number', 'serial_number']),
        ]);
    }

    public function store(EquipmentMaintenanceRequestStoreRequest $request): RedirectResponse
    {
        Gate::authorize('create', EquipmentMaintenanceRequest::class);

        $maintenanceRequest = EquipmentMaintenanceRequest::create([
            'equipment_id' => $request->equipment_id,
            'reported_by' => $request->user()->id,
            'reported_by_id' => $request->user()->id,
            'report_date' => now(),
            'problem_description' => $request->problem_description,
            'priority' => $request->priority ?? 'medium',
            'status' => 'open',
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('equipment-maintenance', 'public');
            $maintenanceRequest->update(['photo' => $path]);
        }

        return redirect()->route('equipment-maintenance-requests.index')->with('success', 'Maintenance request created successfully.');
    }

    public function show(Request $request, EquipmentMaintenanceRequest $equipment_maintenance_request): Response
    {
        Gate::authorize('view', $equipment_maintenance_request);

        return Inertia::render('equipment/maintenance-requests/show', [
            'maintenanceRequest' => $equipment_maintenance_request->load(['equipment', 'reportedByEmployee.user', 'equipmentMaintenanceActivities']),
        ]);
    }

    public function respond(Request $request, EquipmentMaintenanceRequest $equipment_maintenance_request): RedirectResponse
    {
        Gate::authorize('respond', EquipmentMaintenanceRequest::class);

        $request->validate([
            'status' => ['required', 'in:in_progress,rejected'],
        ]);

        $equipment_maintenance_request->update([
            'status' => $request->status,
        ]);

        return back()->with('success', 'Request status updated to '.str_replace('_', ' ', $request->status).'.');
    }

    public function addActivity(Request $request, EquipmentMaintenanceRequest $equipment_maintenance_request): RedirectResponse
    {
        Gate::authorize('addActivity', $equipment_maintenance_request);

        $request->validate([
            'description' => ['required', 'string'],
            'status' => ['required', 'in:in_progress,resolved'],
            'cost' => ['nullable', 'numeric'],
        ]);

        EquipmentMaintenanceActivity::create([
            'equipment_maintenance_request_id' => $equipment_maintenance_request->id,
            'description' => $request->description,
            'activity_date' => now(),
            'status' => $request->status,
            'cost' => $request->cost ?? 0,
            'performed_by' => $request->user()->name,
        ]);

        $equipment_maintenance_request->update([
            'status' => $request->status,
        ]);

        return back()->with('success', 'Activity added and status updated.');
    }

    public function verify(Request $request, EquipmentMaintenanceRequest $equipment_maintenance_request): RedirectResponse
    {
        Gate::authorize('verify', $equipment_maintenance_request);

        $equipment_maintenance_request->update([
            'status' => 'closed',
        ]);

        return back()->with('success', 'Maintenance verified and closed.');
    }

    public function edit(Request $request, EquipmentMaintenanceRequest $equipment_maintenance_request): Response
    {
        Gate::authorize('update', $equipment_maintenance_request);

        return Inertia::render('equipment/maintenance-requests/edit', [
            'equipmentMaintenanceRequest' => $equipment_maintenance_request,
            'equipment' => Equipment::all(['id', 'equipment_number', 'serial_number']),
        ]);
    }

    public function update(EquipmentMaintenanceRequestUpdateRequest $request, EquipmentMaintenanceRequest $equipment_maintenance_request): RedirectResponse
    {
        Gate::authorize('update', $equipment_maintenance_request);

        $equipment_maintenance_request->update($request->validated());

        return redirect()->route('equipment-maintenance-requests.index')->with('success', 'Maintenance request updated successfully.');
    }

    public function destroy(Request $request, EquipmentMaintenanceRequest $equipment_maintenance_request): RedirectResponse
    {
        Gate::authorize('delete', $equipment_maintenance_request);

        $equipment_maintenance_request->delete();

        return redirect()->route('equipment-maintenance-requests.index')->with('success', 'Maintenance request deleted successfully.');
    }
}
