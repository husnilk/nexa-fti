<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\Item;
use App\Models\Warehouse;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:inventory.manage')->only(['index']);
    }

    public function index(): Response
    {
        return Inertia::render('inventory/stock/index', [
            'inventories' => Inventory::with(['item.itemCategory', 'warehouse'])->get(),
            'items' => Item::all(),
            'warehouses' => Warehouse::all(),
        ]);
    }
}
