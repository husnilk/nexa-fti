<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentUsageStoreRequest;
use App\Http\Requests\EquipmentUsageUpdateRequest;
use App\Models\Equipment;
use App\Models\EquipmentUsage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class EquipmentUsageController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', EquipmentUsage::class);

        $user = $request->user();

        $query = EquipmentUsage::with(['equipment.equipmentModel', 'borrower', 'approvedBy'])
            ->latest();

        if (! $user->hasPermissionTo('equipment.manage')) {
            $query->where('borrower_id', $user->id);
        }

        return Inertia::render('equipment/usages/index', [
            'equipmentUsages' => $query->get(),
            'isAdmin' => $user->hasPermissionTo('equipment.manage'),
        ]);
    }

    public function create(Request $request): Response
    {
        Gate::authorize('create', EquipmentUsage::class);

        return Inertia::render('equipment/usages/create', [
            'equipment' => Equipment::where('status', 'available')
                ->with('equipmentModel')
                ->get(),
        ]);
    }

    public function store(EquipmentUsageStoreRequest $request): RedirectResponse
    {
        Gate::authorize('create', EquipmentUsage::class);

        EquipmentUsage::create(array_merge($request->validated(), [
            'borrower_id' => $request->user()->id,
            'borrower_type' => 'employee',
            'status' => 'requested',
        ]));

        return redirect()->route('equipment-usages.index')
            ->with('success', 'Equipment loan request submitted.');
    }

    public function show(Request $request, EquipmentUsage $equipmentUsage): Response
    {
        Gate::authorize('view', $equipmentUsage);

        return Inertia::render('equipment/usages/show', [
            'equipmentUsage' => $equipmentUsage->load([
                'equipment.equipmentModel',
                'borrower',
                'approvedBy',
                'equipmentUsageApprovals.approver',
            ]),
        ]);
    }

    public function edit(Request $request, EquipmentUsage $equipmentUsage): Response|RedirectResponse
    {
        Gate::authorize('update', $equipmentUsage);

        if ($equipmentUsage->status !== 'requested') {
            return redirect()->route('equipment-usages.index')
                ->with('error', 'Only requested loans can be edited.');
        }

        return Inertia::render('equipment/usages/edit', [
            'equipmentUsage' => $equipmentUsage,
            'equipment' => Equipment::with('equipmentModel')->get(),
        ]);
    }

    public function update(EquipmentUsageUpdateRequest $request, EquipmentUsage $equipmentUsage): RedirectResponse
    {
        Gate::authorize('update', $equipmentUsage);

        if ($equipmentUsage->status !== 'requested') {
            return redirect()->route('equipment-usages.index')
                ->with('error', 'Only requested loans can be updated.');
        }

        $equipmentUsage->update($request->validated());

        return redirect()->route('equipment-usages.index')
            ->with('success', 'Loan request updated.');
    }

    public function destroy(Request $request, EquipmentUsage $equipmentUsage): RedirectResponse
    {
        Gate::authorize('delete', $equipmentUsage);

        $equipmentUsage->delete();

        return redirect()->route('equipment-usages.index')
            ->with('success', 'Loan request deleted.');
    }

    public function return(Request $request, EquipmentUsage $equipmentUsage): RedirectResponse
    {
        Gate::authorize('view', $equipmentUsage);

        if (! in_array($equipmentUsage->status, ['approved', 'borrowed'])) {
            return redirect()->back()
                ->with('error', 'This equipment is not currently on loan.');
        }

        $equipmentUsage->update([
            'status' => 'returned',
            'actual_return_date' => now(),
        ]);

        $equipmentUsage->equipment->update(['status' => 'available']);

        return redirect()->back()
            ->with('success', 'Equipment returned successfully.');
    }
}
