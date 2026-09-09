<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentReceiptStoreRequest;
use App\Http\Requests\EquipmentReceiptUpdateRequest;
use App\Models\Employee;
use App\Models\EquipmentProcurement;
use App\Models\EquipmentReceipt;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EquipmentReceiptController extends Controller
{
    public function index(Request $request): Response
    {
        $equipmentReceipts = EquipmentReceipt::with(['equipmentProcurement', 'receivedBy'])
            ->withCount('equipmentReceiptItems')
            ->latest()
            ->get();

        return Inertia::render('equipment/receipts/index', [
            'equipmentReceipts' => $equipmentReceipts,
        ]);
    }

    public function create(Request $request): Response
    {
        $procurementId = $request->query('equipment_procurement_id');
        $procurement = null;

        if ($procurementId) {
            $procurement = EquipmentProcurement::with('equipmentProcurementItems.equipmentModel')->find($procurementId);
        }

        return Inertia::render('equipment/receipts/create', [
            'procurement' => $procurement,
            'procurements' => EquipmentProcurement::where('status', 'approved')->get(),
        ]);
    }

    public function store(EquipmentReceiptStoreRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $receipt = EquipmentReceipt::create([
                'equipment_procurement_id' => $request->equipment_procurement_id,
                'receipt_number' => 'RCT-'.strtoupper(Str::random(8)),
                'receipt_date' => $request->receipt_date,
                'received_by' => $request->user()->id, // Assuming user ID is employee ID
                'supplier_name' => $request->supplier_name,
                'invoice_number' => $request->invoice_number,
            ]);

            foreach ($request->items as $item) {
                $receipt->equipmentReceiptItems()->create($item);
            }
        });

        return redirect()->route('equipment-receipts.index')
            ->with('success', 'Receipt recorded successfully.');
    }

    public function show(Request $request, EquipmentReceipt $equipmentReceipt): Response
    {
        return Inertia::render('equipment/receipts/show', [
            'equipmentReceipt' => $equipmentReceipt->load([
                'equipmentProcurement',
                'receivedBy',
                'equipmentReceiptItems.equipmentProcurementItem.equipmentModel',
            ]),
        ]);
    }

    public function edit(Request $request, EquipmentReceipt $equipmentReceipt): Response
    {
        return Inertia::render('equipment/receipts/edit', [
            'equipmentReceipt' => $equipmentReceipt->load('equipmentReceiptItems'),
            'procurement' => $equipmentReceipt->equipmentProcurement->load('equipmentProcurementItems.equipmentModel'),
        ]);
    }

    public function update(EquipmentReceiptUpdateRequest $request, EquipmentReceipt $equipmentReceipt): RedirectResponse
    {
        DB::transaction(function () use ($request, $equipmentReceipt) {
            $equipmentReceipt->update($request->only(['receipt_date', 'supplier_name', 'invoice_number']));

            $keepIds = collect($request->items)->pluck('id')->filter()->toArray();
            $equipmentReceipt->equipmentReceiptItems()->whereNotIn('id', $keepIds)->delete();

            foreach ($request->items as $item) {
                if (isset($item['id'])) {
                    $equipmentReceipt->equipmentReceiptItems()->find($item['id'])->update($item);
                } else {
                    $equipmentReceipt->equipmentReceiptItems()->create($item);
                }
            }
        });

        return redirect()->route('equipment-receipts.index')
            ->with('success', 'Receipt updated successfully.');
    }

    public function destroy(Request $request, EquipmentReceipt $equipmentReceipt): RedirectResponse
    {
        $equipmentReceipt->delete();

        return redirect()->route('equipment-receipts.index')
            ->with('success', 'Receipt deleted successfully.');
    }
}
