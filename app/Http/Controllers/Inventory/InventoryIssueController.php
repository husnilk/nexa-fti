<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Inventory;
use App\Models\InventoryIssue;
use App\Models\InventoryRequest;
use App\Models\InventoryTransaction;
use App\Models\Warehouse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class InventoryIssueController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:inventory.issue')->only(['index', 'create', 'store']);
    }

    public function index(): Response
    {
        $issues = InventoryIssue::with(['issuedBy', 'inventoryRequest', 'warehouse'])
            ->latest()
            ->paginate(10);

        return Inertia::render('inventory/issues/index', [
            'issues' => $issues,
        ]);
    }

    public function create(Request $request): Response
    {
        $inventoryRequest = null;
        if ($request->has('request_id')) {
            $inventoryRequest = InventoryRequest::with('inventoryRequestItems.item')
                ->where('status', 'approved')
                ->findOrFail($request->request_id);
        }

        return Inertia::render('inventory/issues/create', [
            'requests' => InventoryRequest::where('status', 'approved')->get(),
            'selectedRequest' => $inventoryRequest,
            'warehouses' => Warehouse::where('is_active', true)->get(),
            'employees' => Employee::all(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'inventory_request_id' => 'required|exists:inventory_requests,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'issued_by' => 'required|exists:employees,id',
            'issue_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.inventory_request_item_id' => 'required|exists:inventory_request_items,id',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($validated) {
            $issue = InventoryIssue::create([
                'inventory_request_id' => $validated['inventory_request_id'],
                'warehouse_id' => $validated['warehouse_id'],
                'issue_number' => 'ISSUE-'.strtoupper(uniqid()),
                'issue_date' => $validated['issue_date'],
                'issued_by' => $validated['issued_by'],
                'issued_by_id' => $validated['issued_by'],
            ]);

            foreach ($validated['items'] as $item) {
                $issue->inventoryIssueItems()->create([
                    'inventory_request_item_id' => $item['inventory_request_item_id'],
                    'inventory_issue_item_id' => $item['inventory_request_item_id'], // Fill both to satisfy constraints
                    'quantity' => $item['quantity'],
                ]);

                // Update stock (Stock Out)
                $inventory = Inventory::where('warehouse_id', $validated['warehouse_id'])
                    ->where('item_id', $item['item_id'])
                    ->first();

                if (! $inventory || $inventory->quantity < $item['quantity']) {
                    throw new \Exception('Insufficient stock for item in selected warehouse.');
                }

                $inventory->decrement('quantity', $item['quantity']);

                // Log transaction
                InventoryTransaction::create([
                    'warehouse_id' => $validated['warehouse_id'],
                    'item_id' => $item['item_id'],
                    'type' => 'out',
                    'quantity' => $item['quantity'],
                    'balance_after' => $inventory->quantity,
                    'transaction_date' => $validated['issue_date'],
                    'reference' => $issue->issue_number,
                    'notes' => 'Issued for request',
                ]);
            }
        });

        return redirect()->route('inventory-requests.show', $validated['inventory_request_id'])
            ->with('success', 'Items issued and stock updated.');
    }
}
