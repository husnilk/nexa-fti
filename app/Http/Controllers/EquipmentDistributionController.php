<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentDistributionStoreRequest;
use App\Http\Requests\EquipmentDistributionUpdateRequest;
use App\Models\Employee;
use App\Models\Equipment;
use App\Models\EquipmentDistribution;
use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EquipmentDistributionController extends Controller
{
    public function index(Request $request): Response
    {
        $equipmentDistributions = EquipmentDistribution::with(['equipment', 'employee', 'room.responsibleEmployee'])
            ->latest()
            ->get();

        return Inertia::render('equipment/distributions/index', [
            'equipmentDistributions' => $equipmentDistributions,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('equipment/distributions/create', [
            'equipment' => Equipment::where('status', 'available')->get(),
            'employees' => Employee::all(),
            'rooms' => Room::all(),
        ]);
    }

    public function store(EquipmentDistributionStoreRequest $request): RedirectResponse
    {
        EquipmentDistribution::create($request->validated());

        return redirect()->route('equipment-distributions.index')
            ->with('success', 'Equipment distributed successfully.');
    }

    public function show(Request $request, EquipmentDistribution $equipmentDistribution): Response
    {
        return Inertia::render('equipment/distributions/show', [
            'equipmentDistribution' => $equipmentDistribution->load(['equipment', 'employee', 'room.responsibleEmployee']),
        ]);
    }

    public function edit(Request $request, EquipmentDistribution $equipmentDistribution): Response
    {
        if ($equipmentDistribution->status !== 'pending') {
            return redirect()->route('equipment-distributions.index')
                ->with('error', 'Only pending distributions can be edited.');
        }

        return Inertia::render('equipment/distributions/edit', [
            'equipmentDistribution' => $equipmentDistribution,
            'equipment' => Equipment::all(),
            'employees' => Employee::all(),
            'rooms' => Room::all(),
        ]);
    }

    public function update(EquipmentDistributionUpdateRequest $request, EquipmentDistribution $equipmentDistribution): RedirectResponse
    {
        if ($equipmentDistribution->status !== 'pending') {
            return redirect()->route('equipment-distributions.index')
                ->with('error', 'Only pending distributions can be updated.');
        }

        $equipmentDistribution->update($request->validated());

        return redirect()->route('equipment-distributions.index')
            ->with('success', 'Distribution updated successfully.');
    }

    public function destroy(Request $request, EquipmentDistribution $equipmentDistribution): RedirectResponse
    {
        if ($equipmentDistribution->status !== 'pending' && $equipmentDistribution->status !== 'rejected') {
            return redirect()->route('equipment-distributions.index')
                ->with('error', 'Only pending or rejected distributions can be deleted.');
        }

        $equipmentDistribution->delete();

        return redirect()->route('equipment-distributions.index')
            ->with('success', 'Distribution deleted successfully.');
    }

    public function accept(Request $request, EquipmentDistribution $equipmentDistribution): RedirectResponse
    {
        // Check if user is the recipient or responsible for the room
        $employeeId = $request->user()->id; // Assuming user ID is employee ID

        $isRecipient = $equipmentDistribution->employee_id === $employeeId;
        $isRoomResponsible = $equipmentDistribution->room?->responsible_employee_id === $employeeId;

        if (! $isRecipient && ! $isRoomResponsible) {
            return redirect()->back()->with('error', 'You are not authorized to accept this equipment.');
        }

        if ($equipmentDistribution->status !== 'pending') {
            return redirect()->back()->with('error', 'This distribution is not in pending state.');
        }

        $equipmentDistribution->update(['status' => 'accepted']);
        $equipmentDistribution->equipment->update(['status' => 'in_use']);

        return redirect()->back()->with('success', 'Equipment accepted successfully.');
    }

    public function reject(Request $request, EquipmentDistribution $equipmentDistribution): RedirectResponse
    {
        $employeeId = $request->user()->id;

        $isRecipient = $equipmentDistribution->employee_id === $employeeId;
        $isRoomResponsible = $equipmentDistribution->room?->responsible_employee_id === $employeeId;

        if (! $isRecipient && ! $isRoomResponsible) {
            return redirect()->back()->with('error', 'You are not authorized to reject this equipment.');
        }

        if ($equipmentDistribution->status !== 'pending') {
            return redirect()->back()->with('error', 'This distribution is not in pending state.');
        }

        $request->validate(['notes' => 'required|string']);

        $equipmentDistribution->update([
            'status' => 'rejected',
            'notes' => $request->notes,
        ]);

        return redirect()->back()->with('success', 'Equipment rejected successfully.');
    }

    public function return(Request $request, EquipmentDistribution $equipmentDistribution): RedirectResponse
    {
        $employeeId = $request->user()->id;

        $isRecipient = $equipmentDistribution->employee_id === $employeeId;
        $isRoomResponsible = $equipmentDistribution->room?->responsible_employee_id === $employeeId;

        if (! $isRecipient && ! $isRoomResponsible) {
            return redirect()->back()->with('error', 'You are not authorized to return this equipment.');
        }

        if ($equipmentDistribution->status !== 'accepted') {
            return redirect()->back()->with('error', 'Only accepted equipment can be returned.');
        }

        $equipmentDistribution->update([
            'status' => 'returned',
            'returned_date' => now(),
        ]);

        $equipmentDistribution->equipment->update(['status' => 'available']);

        return redirect()->back()->with('success', 'Equipment returned successfully.');
    }
}
