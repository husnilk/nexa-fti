<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentProcurementStoreRequest;
use App\Http\Requests\EquipmentProcurementUpdateRequest;
use App\Models\Employee;
use App\Models\EquipmentModel;
use App\Models\EquipmentProcurement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EquipmentProcurementController extends Controller
{
    public function index(Request $request): Response
    {
        $equipmentProcurements = EquipmentProcurement::with(['requestedBy', 'approvedBy'])
            ->withCount('equipmentProcurementItems')
            ->latest()
            ->get();

        return Inertia::render('equipment/procurements/index', [
            'equipmentProcurements' => $equipmentProcurements,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('equipment/procurements/create', [
            'equipmentModels' => EquipmentModel::all(),
        ]);
    }

    public function store(EquipmentProcurementStoreRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $procurement = EquipmentProcurement::create([
                'procurement_number' => 'PRC-'.strtoupper(Str::random(8)),
                'title' => $request->title,
                'description' => $request->description,
                'request_date' => $request->request_date,
                'requested_by' => $request->user()->id, // Assuming user ID is employee ID
                'status' => 'pending',
            ]);

            foreach ($request->items as $item) {
                if (empty($item['name']) && isset($item['equipment_model_id'])) {
                    $item['name'] = EquipmentModel::find($item['equipment_model_id'])?->model_name ?? 'Unknown Model';
                }
                $procurement->equipmentProcurementItems()->create($item);
            }
        });

        return redirect()->route('equipment-procurements.index')
            ->with('success', 'Procurement request submitted successfully.');
    }

    public function show(Request $request, EquipmentProcurement $equipmentProcurement): Response
    {
        return Inertia::render('equipment/procurements/show', [
            'equipmentProcurement' => $equipmentProcurement->load([
                'requestedBy',
                'approvedBy',
                'equipmentProcurementItems.equipmentModel',
                'equipmentProcurementApprovals.approver',
            ]),
        ]);
    }

    public function edit(Request $request, EquipmentProcurement $equipmentProcurement): Response
    {
        if (! in_array($equipmentProcurement->status, ['draft', 'pending'])) {
            return redirect()->route('equipment-procurements.index')
                ->with('error', 'Only draft or pending procurements can be edited.');
        }

        return Inertia::render('equipment/procurements/edit', [
            'equipmentProcurement' => $equipmentProcurement->load('equipmentProcurementItems'),
            'equipmentModels' => EquipmentModel::all(),
        ]);
    }

    public function update(EquipmentProcurementUpdateRequest $request, EquipmentProcurement $equipmentProcurement): RedirectResponse
    {
        if (! in_array($equipmentProcurement->status, ['draft', 'pending'])) {
            return redirect()->route('equipment-procurements.index')
                ->with('error', 'Only draft or pending procurements can be updated.');
        }

        DB::transaction(function () use ($request, $equipmentProcurement) {
            $equipmentProcurement->update($request->only(['title', 'description', 'request_date', 'status']));

            // Simple approach: remove and re-add items or update them.
            // For now, let's sync them.
            $keepIds = collect($request->items)->pluck('id')->filter()->toArray();
            $equipmentProcurement->equipmentProcurementItems()->whereNotIn('id', $keepIds)->delete();

            foreach ($request->items as $item) {
                if (empty($item['name']) && isset($item['equipment_model_id'])) {
                    $item['name'] = EquipmentModel::find($item['equipment_model_id'])?->model_name ?? 'Unknown Model';
                }

                if (isset($item['id'])) {
                    $equipmentProcurement->equipmentProcurementItems()->find($item['id'])->update($item);
                } else {
                    $equipmentProcurement->equipmentProcurementItems()->create($item);
                }
            }
        });

        return redirect()->route('equipment-procurements.index')
            ->with('success', 'Procurement request updated successfully.');
    }

    public function destroy(Request $request, EquipmentProcurement $equipmentProcurement): RedirectResponse
    {
        if (! in_array($equipmentProcurement->status, ['draft', 'pending', 'cancelled'])) {
            return redirect()->route('equipment-procurements.index')
                ->with('error', 'Only draft, pending, or cancelled procurements can be deleted.');
        }

        $equipmentProcurement->delete();

        return redirect()->route('equipment-procurements.index')
            ->with('success', 'Procurement request deleted successfully.');
    }

    public function cancel(Request $request, EquipmentProcurement $equipmentProcurement): RedirectResponse
    {
        if (! in_array($equipmentProcurement->status, ['draft', 'pending'])) {
            return redirect()->back()
                ->with('error', 'Only draft or pending procurements can be cancelled.');
        }

        $equipmentProcurement->update(['status' => 'cancelled']);

        return redirect()->back()
            ->with('success', 'Procurement request cancelled successfully.');
    }
}
