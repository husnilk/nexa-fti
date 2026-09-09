<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentDisposalStoreRequest;
use App\Http\Requests\EquipmentDisposalUpdateRequest;
use App\Models\Employee;
use App\Models\Equipment;
use App\Models\EquipmentDisposal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class EquipmentDisposalController extends Controller
{
    public function index(Request $request): Response
    {
        $equipmentDisposals = EquipmentDisposal::with(['proposedBy', 'approvedBy'])
            ->withCount('equipmentDisposalItems')
            ->latest()
            ->get();

        return Inertia::render('equipment/disposals/index', [
            'equipmentDisposals' => $equipmentDisposals,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('equipment/disposals/create', [
            'equipment' => Equipment::with('equipmentModel')->get(),
            'employees' => Employee::all(),
        ]);
    }

    public function store(EquipmentDisposalStoreRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $disposal = EquipmentDisposal::create([
                'disposal_number' => $request->disposal_number,
                'disposal_date' => $request->disposal_date,
                'title' => $request->title,
                'reason' => $request->reason,
                'disposal_method' => $request->disposal_method,
                'status' => $request->status,
                'notes' => $request->notes,
                'proposed_by' => $request->proposed_by_id,
                'proposed_by_id' => $request->proposed_by_id,
            ]);

            foreach ($request->items as $item) {
                $disposal->equipmentDisposalItems()->create([
                    'equipment_id' => $item['equipment_id'],
                    'book_value' => $item['book_value'] ?? null,
                    'disposal_value' => $item['disposal_value'] ?? null,
                    'notes' => $item['notes'] ?? null,
                ]);
            }
        });

        return redirect()->route('equipment-disposals.index')
            ->with('success', 'Equipment disposal request submitted successfully.');
    }

    public function show(Request $request, EquipmentDisposal $equipmentDisposal): Response
    {
        return Inertia::render('equipment/disposals/show', [
            'equipmentDisposal' => $equipmentDisposal->load([
                'proposedBy',
                'approvedBy',
                'equipmentDisposalItems.equipment.equipmentModel',
            ]),
        ]);
    }

    public function edit(Request $request, EquipmentDisposal $equipmentDisposal): Response|RedirectResponse
    {
        if (! in_array($equipmentDisposal->status, ['draft', 'pending'])) {
            return redirect()->route('equipment-disposals.index')
                ->with('error', 'Only draft or pending disposal requests can be edited.');
        }

        return Inertia::render('equipment/disposals/edit', [
            'equipmentDisposal' => $equipmentDisposal->load('equipmentDisposalItems'),
            'equipment' => Equipment::with('equipmentModel')->get(),
            'employees' => Employee::all(),
        ]);
    }

    public function update(EquipmentDisposalUpdateRequest $request, EquipmentDisposal $equipmentDisposal): RedirectResponse
    {
        if (! in_array($equipmentDisposal->status, ['draft', 'pending'])) {
            return redirect()->route('equipment-disposals.index')
                ->with('error', 'Only draft or pending disposal requests can be updated.');
        }

        DB::transaction(function () use ($request, $equipmentDisposal) {
            $equipmentDisposal->update([
                'disposal_number' => $request->disposal_number,
                'disposal_date' => $request->disposal_date,
                'title' => $request->title,
                'reason' => $request->reason,
                'disposal_method' => $request->disposal_method,
                'status' => $request->status,
                'notes' => $request->notes,
                'proposed_by' => $request->proposed_by_id,
                'proposed_by_id' => $request->proposed_by_id,
            ]);

            // Sync items
            $keepIds = collect($request->items)->pluck('id')->filter()->toArray();
            $equipmentDisposal->equipmentDisposalItems()->whereNotIn('id', $keepIds)->delete();

            foreach ($request->items as $item) {
                if (isset($item['id']) && $item['id']) {
                    $equipmentDisposal->equipmentDisposalItems()->find($item['id'])->update([
                        'equipment_id' => $item['equipment_id'],
                        'book_value' => $item['book_value'] ?? null,
                        'disposal_value' => $item['disposal_value'] ?? null,
                        'notes' => $item['notes'] ?? null,
                    ]);
                } else {
                    $equipmentDisposal->equipmentDisposalItems()->create([
                        'equipment_id' => $item['equipment_id'],
                        'book_value' => $item['book_value'] ?? null,
                        'disposal_value' => $item['disposal_value'] ?? null,
                        'notes' => $item['notes'] ?? null,
                    ]);
                }
            }
        });

        return redirect()->route('equipment-disposals.index')
            ->with('success', 'Equipment disposal request updated successfully.');
    }

    public function destroy(Request $request, EquipmentDisposal $equipmentDisposal): RedirectResponse
    {
        if (! in_array($equipmentDisposal->status, ['draft', 'pending'])) {
            return redirect()->route('equipment-disposals.index')
                ->with('error', 'Only draft or pending disposal requests can be cancelled.');
        }

        DB::transaction(function () use ($equipmentDisposal) {
            $equipmentDisposal->equipmentDisposalItems()->delete();
            $equipmentDisposal->delete();
        });

        return redirect()->route('equipment-disposals.index')
            ->with('success', 'Equipment disposal request cancelled successfully.');
    }
}
