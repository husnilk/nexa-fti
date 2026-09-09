<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\InventoryRequest;
use App\Models\InventoryRequestItem;
use App\Models\Item;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class InventoryRequestController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:inventory.request')->only(['index', 'create', 'store']);
        $this->middleware('permission:inventory.approval')->only(['approve', 'reject']);
    }

    public function index(): Response
    {
        $requests = InventoryRequest::with(['employee', 'inventoryRequestItems.item'])
            ->latest()
            ->paginate(10);

        return Inertia::render('inventory/requests/index', [
            'requests' => $requests,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('inventory/requests/create', [
            'items' => Item::all(),
            'employees' => Employee::all(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($validated) {
            $inventoryRequest = InventoryRequest::create([
                'request_number' => 'REQ-'.strtoupper(uniqid()),
                'employee_id' => $validated['employee_id'],
                'request_date' => now(),
                'status' => 'pending',
                'approved_by_id' => $validated['employee_id'], // Placeholder, fixed in approval
            ]);

            foreach ($validated['items'] as $item) {
                // The existing model uses InventoryRequestItem or InventoryRequestDetail?
                // Let's check InventoryRequest.php again.
                // L68: public function inventoryRequestItems(): HasMany
                $inventoryRequest->inventoryRequestItems()->create([
                    'item_id' => $item['item_id'],
                    'quantity' => $item['quantity'],
                ]);
            }
        });

        return redirect()->route('inventory-requests.index')
            ->with('success', 'Inventory request submitted.');
    }

    public function show(InventoryRequest $inventoryRequest): Response
    {
        $inventoryRequest->load(['employee', 'inventoryRequestItems.item', 'inventoryIssues.issuedBy']);

        return Inertia::render('inventory/requests/show', [
            'inventoryRequest' => $inventoryRequest,
        ]);
    }

    public function approve(Request $request, InventoryRequest $inventoryRequest): RedirectResponse
    {
        $inventoryRequest->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => auth()->user()->id, // Assuming user ID is linked to employee
            'approved_by_id' => auth()->user()->id,
        ]);

        $inventoryRequest->inventoryRequestApprovals()->create([
            'approver_id' => auth()->user()->id,
            'approver_id_id' => auth()->user()->id,
            'status' => 'approved',
            'notes' => $request->notes,
            'action_date' => now(),
        ]);

        return back()->with('success', 'Request approved.');
    }

    public function reject(Request $request, InventoryRequest $inventoryRequest): RedirectResponse
    {
        $request->validate(['notes' => 'required|string']);

        $inventoryRequest->update(['status' => 'rejected']);

        $inventoryRequest->inventoryRequestApprovals()->create([
            'approver_id' => auth()->user()->id,
            'approver_id_id' => auth()->user()->id,
            'status' => 'rejected',
            'notes' => $request->notes,
            'action_date' => now(),
        ]);

        return back()->with('success', 'Request rejected.');
    }
}
