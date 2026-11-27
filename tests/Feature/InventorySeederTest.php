<?php

use App\Models\Inventory;
use App\Models\InventoryProcurement;
use App\Models\InventoryProcurementItem;
use App\Models\InventoryRequest;
use App\Models\InventoryRequestItem;
use App\Models\Item;
use App\Models\ItemCategory;
use App\Models\Warehouse;
use Database\Seeders\InventoryItemSeeder;
use Database\Seeders\InventorySeeder;

test('inventory item seeder populates real office items and categories', function () {
    $this->seed(InventoryItemSeeder::class);

    // Categories
    $expectedCategories = [
        'CAT-ATK',
        'CAT-INK',
        'CAT-PERIPH',
        'CAT-CLN',
        'CAT-NET',
        'CAT-MNT',
        'CAT-IOT',
    ];

    foreach ($expectedCategories as $catCode) {
        expect(ItemCategory::where('code', $catCode)->exists())->toBeTrue();
    }

    // Key real office items check
    $realItemCodes = [
        'ATK-HVS-A4-80',   // Kertas HVS A4
        'ATK-HVS-F4-75',   // Kertas HVS F4
        'ATK-PEN-BLK-DZ',  // Pulpen Gel Joyko
        'ATK-WB-BLK-DZ',   // Spidol Whiteboard Snowman
        'ATK-STP-HD10-SET', // Stapler Joyko HD-10
        'PRN-EPS-003-BK',  // Tinta Epson 003 Black
        'PRN-TNR-HP-85A',  // Toner HP LaserJet 85A
        'IT-MOU-LOGI-B100', // Mouse Logitech
        'IT-CBL-HDMI-3M',   // Kabel HDMI
        'CLN-TSU-PAS-250S', // Tisu Wajah Paseo
        'CLN-SOAP-LB-500ML', // Sabun Cuci Tangan Lifebuoy
        'NET-CBL-CAT6-305M', // Kabel UTP Cat6 Belden
        'MNT-BAT-AA-4PK',   // Baterai AA Alkaline
    ];

    foreach ($realItemCodes as $code) {
        $item = Item::where('code', $code)->first();
        expect($item)->not->toBeNull();
        expect($item->name)->not->toBeEmpty();
        expect($item->unit)->not->toBeEmpty();
        expect($item->minimal_quantity)->toBeGreaterThan(0);
        expect($item->item_category_id)->not->toBeNull();
    }

    // Verify variants seeded on items with variants
    $paperItem = Item::where('code', 'ATK-HVS-A4-80')->first();
    expect($paperItem->variants()->count())->toBeGreaterThanOrEqual(2);

    $penItem = Item::where('code', 'ATK-PEN-BLK-DZ')->first();
    expect($penItem->variants()->count())->toBeGreaterThanOrEqual(2);

    // Verify warehouses exist
    expect(Warehouse::where('code', 'WH-MAIN')->exists())->toBeTrue();
    expect(Warehouse::where('code', 'WH-ADMIN')->exists())->toBeTrue();
    expect(Warehouse::where('code', 'WH-LAB')->exists())->toBeTrue();

    // Verify warehouse inventory stock populated
    expect(Inventory::where('item_id', $paperItem->id)->count())->toBe(3);
    expect(Inventory::where('item_id', $paperItem->id)->where('quantity', '>', 0)->count())->toBe(3);
});

test('inventory seeder runs cleanly and seeds real procurements and requests', function () {
    $this->seed(InventorySeeder::class);

    // Verify procurements exist and reference real items
    expect(InventoryProcurement::count())->toBeGreaterThanOrEqual(4);
    $procurementItems = InventoryProcurementItem::with('item')->get();
    expect($procurementItems->count())->toBeGreaterThan(0);

    foreach ($procurementItems as $procItem) {
        expect($procItem->item)->not->toBeNull();
        expect($procItem->item_name)->toBe($procItem->item->name);
        expect($procItem->quantity)->toBeGreaterThan(0);
    }

    // Verify requests exist and reference real items
    expect(InventoryRequest::count())->toBeGreaterThanOrEqual(4);
    $requestItems = InventoryRequestItem::with('item')->get();
    expect($requestItems->count())->toBeGreaterThan(0);

    foreach ($requestItems as $reqItem) {
        expect($reqItem->item)->not->toBeNull();
        expect($reqItem->item_name)->toBe($reqItem->item->name);
        expect($reqItem->quantity)->toBeGreaterThan(0);
        expect($reqItem->specification)->not->toBeEmpty();
    }
});

test('inventory seeders are idempotent and can be run multiple times', function () {
    $this->seed(InventorySeeder::class);
    $firstItemCount = Item::count();
    $firstCategoryCount = ItemCategory::count();

    // Run again
    $this->seed(InventorySeeder::class);
    expect(Item::count())->toBe($firstItemCount);
    expect(ItemCategory::count())->toBe($firstCategoryCount);
});
