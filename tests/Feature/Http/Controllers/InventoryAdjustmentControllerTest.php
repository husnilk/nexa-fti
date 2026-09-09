<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\InventoryAdjustmentController;
use App\Http\Requests\InventoryAdjustmentControllerStoreRequest;
use App\Http\Requests\InventoryAdjustmentControllerUpdateRequest;
use App\Models\AdjustedBy;
use App\Models\Employee;
use App\Models\InventoryAdjustment;
use App\Models\Item;
use App\Models\StockOpnameItem;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see InventoryAdjustmentController
 */
final class InventoryAdjustmentControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $inventoryAdjustments = InventoryAdjustment::factory()->count(3)->create();

        $response = $this->get(route('inventory-adjustments.index'));

        $response->assertOk();
        $response->assertViewIs('inventoryAdjustment.index');
        $response->assertViewHas('inventoryAdjustments', $inventoryAdjustments);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('inventory-adjustments.create'));

        $response->assertOk();
        $response->assertViewIs('inventoryAdjustment.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryAdjustmentController::class,
            'store',
            InventoryAdjustmentControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $stock_opname_item = StockOpnameItem::factory()->create();
        $warehouse = Warehouse::factory()->create();
        $item = Item::factory()->create();
        $adjustment_quantity = fake()->numberBetween(-10000, 10000);
        $adjusted_by = AdjustedBy::factory()->create();
        $adjustment_date = Carbon::parse(fake()->dateTime());
        $adjusted_by = Employee::factory()->create();

        $response = $this->post(route('inventory-adjustments.store'), [
            'stock_opname_item_id' => $stock_opname_item->id,
            'warehouse_id' => $warehouse->id,
            'item_id' => $item->id,
            'adjustment_quantity' => $adjustment_quantity,
            'adjusted_by' => $adjusted_by->id,
            'adjustment_date' => $adjustment_date->toDateTimeString(),
            'adjusted_by_id' => $adjusted_by->id,
        ]);

        $inventoryAdjustments = InventoryAdjustment::query()
            ->where('stock_opname_item_id', $stock_opname_item->id)
            ->where('warehouse_id', $warehouse->id)
            ->where('item_id', $item->id)
            ->where('adjustment_quantity', $adjustment_quantity)
            ->where('adjusted_by', $adjusted_by->id)
            ->where('adjustment_date', $adjustment_date)
            ->where('adjusted_by_id', $adjusted_by->id)
            ->get();
        $this->assertCount(1, $inventoryAdjustments);
        $inventoryAdjustment = $inventoryAdjustments->first();

        $response->assertRedirect(route('inventoryAdjustments.index'));
        $response->assertSessionHas('inventoryAdjustment.id', $inventoryAdjustment->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $inventoryAdjustment = InventoryAdjustment::factory()->create();

        $response = $this->get(route('inventory-adjustments.show', $inventoryAdjustment));

        $response->assertOk();
        $response->assertViewIs('inventoryAdjustment.show');
        $response->assertViewHas('inventoryAdjustment', $inventoryAdjustment);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $inventoryAdjustment = InventoryAdjustment::factory()->create();

        $response = $this->get(route('inventory-adjustments.edit', $inventoryAdjustment));

        $response->assertOk();
        $response->assertViewIs('inventoryAdjustment.edit');
        $response->assertViewHas('inventoryAdjustment', $inventoryAdjustment);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryAdjustmentController::class,
            'update',
            InventoryAdjustmentControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $inventoryAdjustment = InventoryAdjustment::factory()->create();
        $stock_opname_item = StockOpnameItem::factory()->create();
        $warehouse = Warehouse::factory()->create();
        $item = Item::factory()->create();
        $adjustment_quantity = fake()->numberBetween(-10000, 10000);
        $adjusted_by = AdjustedBy::factory()->create();
        $adjustment_date = Carbon::parse(fake()->dateTime());
        $adjusted_by = Employee::factory()->create();

        $response = $this->put(route('inventory-adjustments.update', $inventoryAdjustment), [
            'stock_opname_item_id' => $stock_opname_item->id,
            'warehouse_id' => $warehouse->id,
            'item_id' => $item->id,
            'adjustment_quantity' => $adjustment_quantity,
            'adjusted_by' => $adjusted_by->id,
            'adjustment_date' => $adjustment_date->toDateTimeString(),
            'adjusted_by_id' => $adjusted_by->id,
        ]);

        $inventoryAdjustment->refresh();

        $response->assertRedirect(route('inventoryAdjustments.index'));
        $response->assertSessionHas('inventoryAdjustment.id', $inventoryAdjustment->id);

        $this->assertEquals($stock_opname_item->id, $inventoryAdjustment->stock_opname_item_id);
        $this->assertEquals($warehouse->id, $inventoryAdjustment->warehouse_id);
        $this->assertEquals($item->id, $inventoryAdjustment->item_id);
        $this->assertEquals($adjustment_quantity, $inventoryAdjustment->adjustment_quantity);
        $this->assertEquals($adjusted_by->id, $inventoryAdjustment->adjusted_by);
        $this->assertEquals($adjustment_date, $inventoryAdjustment->adjustment_date);
        $this->assertEquals($adjusted_by->id, $inventoryAdjustment->adjusted_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $inventoryAdjustment = InventoryAdjustment::factory()->create();

        $response = $this->delete(route('inventory-adjustments.destroy', $inventoryAdjustment));

        $response->assertRedirect(route('inventoryAdjustments.index'));

        $this->assertModelMissing($inventoryAdjustment);
    }
}
