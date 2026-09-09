<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Inventory;
use App\Models\InventoryProcurement;
use App\Models\InventoryReceipt;
use App\Models\InventoryTransaction;
use App\Models\Warehouse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class InventoryReceiptController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:inventory.receipt')->only(['index', 'create', 'store']);
    }

    public function index(): Response
    {
        $receipts = InventoryReceipt::with(['receivedBy', 'inventoryProcurement', 'warehouse'])
            ->latest()
            ->paginate(10);

        return Inertia::render('inventory/receipts/index', [
            'receipts' => $receipts,
        ]);
    }

    public function create(Request $request): Response
    {
        $procurement = null;
        if ($request->has('procurement_id')) {
            $procurement = InventoryProcurement::with('inventoryProcurementItems.item')
                ->where('status', 'approved')
                ->findOrFail($request->procurement_id);
        }

        return Inertia::render('inventory/receipts/create', [
            'procurements' => InventoryProcurement::where('status', 'approved')->get(),
            'selectedProcurement' => $procurement,
            'warehouses' => Warehouse::where('is_active', true)->get(),
            'employees' => Employee::all(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'inventory_procurement_id' => 'required|exists:inventory_procurements,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'received_by' => 'required|exists:employees,id',
            'receipt_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.inventory_procurement_item_id' => 'required|exists:inventory_procurement_items,id',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($validated) {
            $receipt = InventoryReceipt::create([
                'inventory_procurement_id' => $validated['inventory_procurement_id'],
                'warehouse_id' => $validated['warehouse_id'],
                'receipt_number' => 'RECV-'.strtoupper(uniqid()),
                'receipt_date' => $validated['receipt_date'],
                'received_by' => $validated['received_by'],
                'received_by_id' => $validated['received_by'],
            ]);

            foreach ($validated['items'] as $item) {
                $receipt->inventoryReceiptItems()->create([
                    'inventory_procurement_item_id' => $item['inventory_procurement_item_id'],
                    'quantity' => $item['quantity'],
                ]);

                // Update stock
                $inventory = Inventory::firstOrCreate(
                    ['warehouse_id' => $validated['warehouse_id'], 'item_id' => $item['item_id']],
                    ['quantity' => 0]
                );
                $inventory->increment('quantity', $item['quantity']);

                // Log transaction
                InventoryTransaction::create([
                    'warehouse_id' => $validated['warehouse_id'],
                    'item_id' => $item['item_id'],
                    'type' => 'in',
                    'quantity' => $item['quantity'],
                    'balance_after' => $inventory->quantity,
                    'transaction_date' => $validated['receipt_date'],
                    'reference' => $receipt->receipt_number,
                    'notes' => 'Received from procurement',
                ]);
            }
        });

        return redirect()->route('inventory-procurements.show', $validated['inventory_procurement_id'])
            ->with('success', 'Items received and stock updated.');
    }
}
