<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\StockOpnameItemController;
use App\Http\Requests\StockOpnameItemControllerStoreRequest;
use App\Http\Requests\StockOpnameItemControllerUpdateRequest;
use App\Models\Item;
use App\Models\StockOpname;
use App\Models\StockOpnameItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see StockOpnameItemController
 */
final class StockOpnameItemControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $stockOpnameItems = StockOpnameItem::factory()->count(3)->create();

        $response = $this->get(route('stock-opname-items.index'));

        $response->assertOk();
        $response->assertViewIs('stockOpnameItem.index');
        $response->assertViewHas('stockOpnameItems', $stockOpnameItems);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('stock-opname-items.create'));

        $response->assertOk();
        $response->assertViewIs('stockOpnameItem.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            StockOpnameItemController::class,
            'store',
            StockOpnameItemControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $stock_opname = StockOpname::factory()->create();
        $item = Item::factory()->create();
        $system_quantity = fake()->numberBetween(-10000, 10000);
        $physical_quantity = fake()->numberBetween(-10000, 10000);
        $variance = fake()->numberBetween(-10000, 10000);

        $response = $this->post(route('stock-opname-items.store'), [
            'stock_opname_id' => $stock_opname->id,
            'item_id' => $item->id,
            'system_quantity' => $system_quantity,
            'physical_quantity' => $physical_quantity,
            'variance' => $variance,
        ]);

        $stockOpnameItems = StockOpnameItem::query()
            ->where('stock_opname_id', $stock_opname->id)
            ->where('item_id', $item->id)
            ->where('system_quantity', $system_quantity)
            ->where('physical_quantity', $physical_quantity)
            ->where('variance', $variance)
            ->get();
        $this->assertCount(1, $stockOpnameItems);
        $stockOpnameItem = $stockOpnameItems->first();

        $response->assertRedirect(route('stockOpnameItems.index'));
        $response->assertSessionHas('stockOpnameItem.id', $stockOpnameItem->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $stockOpnameItem = StockOpnameItem::factory()->create();

        $response = $this->get(route('stock-opname-items.show', $stockOpnameItem));

        $response->assertOk();
        $response->assertViewIs('stockOpnameItem.show');
        $response->assertViewHas('stockOpnameItem', $stockOpnameItem);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $stockOpnameItem = StockOpnameItem::factory()->create();

        $response = $this->get(route('stock-opname-items.edit', $stockOpnameItem));

        $response->assertOk();
        $response->assertViewIs('stockOpnameItem.edit');
        $response->assertViewHas('stockOpnameItem', $stockOpnameItem);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            StockOpnameItemController::class,
            'update',
            StockOpnameItemControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $stockOpnameItem = StockOpnameItem::factory()->create();
        $stock_opname = StockOpname::factory()->create();
        $item = Item::factory()->create();
        $system_quantity = fake()->numberBetween(-10000, 10000);
        $physical_quantity = fake()->numberBetween(-10000, 10000);
        $variance = fake()->numberBetween(-10000, 10000);

        $response = $this->put(route('stock-opname-items.update', $stockOpnameItem), [
            'stock_opname_id' => $stock_opname->id,
            'item_id' => $item->id,
            'system_quantity' => $system_quantity,
            'physical_quantity' => $physical_quantity,
            'variance' => $variance,
        ]);

        $stockOpnameItem->refresh();

        $response->assertRedirect(route('stockOpnameItems.index'));
        $response->assertSessionHas('stockOpnameItem.id', $stockOpnameItem->id);

        $this->assertEquals($stock_opname->id, $stockOpnameItem->stock_opname_id);
        $this->assertEquals($item->id, $stockOpnameItem->item_id);
        $this->assertEquals($system_quantity, $stockOpnameItem->system_quantity);
        $this->assertEquals($physical_quantity, $stockOpnameItem->physical_quantity);
        $this->assertEquals($variance, $stockOpnameItem->variance);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $stockOpnameItem = StockOpnameItem::factory()->create();

        $response = $this->delete(route('stock-opname-items.destroy', $stockOpnameItem));

        $response->assertRedirect(route('stockOpnameItems.index'));

        $this->assertModelMissing($stockOpnameItem);
    }
}
