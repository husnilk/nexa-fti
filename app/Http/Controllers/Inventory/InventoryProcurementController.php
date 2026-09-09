<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\InventoryProcurement;
use App\Models\Item;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class InventoryProcurementController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:inventory.procurement')->only(['index', 'create', 'store']);
        $this->middleware('permission:inventory.approval')->only(['approve', 'reject']);
    }

    public function index(): Response
    {
        $procurements = InventoryProcurement::with(['createdBy', 'inventoryProcurementItems.item'])
            ->latest()
            ->paginate(10);

        return Inertia::render('inventory/procurements/index', [
            'procurements' => $procurements,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('inventory/procurements/create', [
            'items' => Item::all(),
            'employees' => Employee::all(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'created_by' => 'required|exists:employees,id',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($validated) {
            $procurement = InventoryProcurement::create([
                'request_number' => 'PROC-'.strtoupper(uniqid()),
                'title' => $validated['title'],
                'status' => 'submitted',
                'created_by' => $validated['created_by'],
                'created_by_id' => $validated['created_by'],
            ]);

            foreach ($validated['items'] as $item) {
                $procurement->inventoryProcurementItems()->create([
                    'item_id' => $item['item_id'],
                    'quantity' => $item['quantity'],
                ]);
            }
        });

        return redirect()->route('inventory-procurements.index')
            ->with('success', 'Procurement request submitted.');
    }

    public function show(InventoryProcurement $inventoryProcurement): Response
    {
        $inventoryProcurement->load(['createdBy', 'inventoryProcurementItems.item', 'inventoryReceipts.receivedBy']);

        return Inertia::render('inventory/procurements/show', [
            'procurement' => $inventoryProcurement,
        ]);
    }

    public function approve(Request $request, InventoryProcurement $inventoryProcurement): RedirectResponse
    {
        $inventoryProcurement->update([
            'status' => 'approved',
            'approved_at' => now(),
        ]);

        // Logic for specific approval log if model exists
        $inventoryProcurement->inventoryProcurementApprovals()->create([
            'approver_id' => auth()->user()->id, // Assuming user ID is linked to employee or handled appropriately
            'level' => 1,
            'status' => 'approved',
            'notes' => $request->notes,
            'approved_at' => now(),
        ]);

        return back()->with('success', 'Procurement approved.');
    }

    public function reject(Request $request, InventoryProcurement $inventoryProcurement): RedirectResponse
    {
        $request->validate(['notes' => 'required|string']);

        $inventoryProcurement->update(['status' => 'rejected']);

        $inventoryProcurement->inventoryProcurementApprovals()->create([
            'approver_id' => auth()->user()->id,
            'level' => 1,
            'status' => 'rejected',
            'notes' => $request->notes,
            'approved_at' => now(),
        ]);

        return back()->with('success', 'Procurement rejected.');
    }
}
