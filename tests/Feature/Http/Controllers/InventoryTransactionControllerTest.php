<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\InventoryTransactionController;
use App\Http\Requests\InventoryTransactionControllerStoreRequest;
use App\Http\Requests\InventoryTransactionControllerUpdateRequest;
use App\Models\InventoryTransaction;
use App\Models\Item;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see InventoryTransactionController
 */
final class InventoryTransactionControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $inventoryTransactions = InventoryTransaction::factory()->count(3)->create();

        $response = $this->get(route('inventory-transactions.index'));

        $response->assertOk();
        $response->assertViewIs('inventoryTransaction.index');
        $response->assertViewHas('inventoryTransactions', $inventoryTransactions);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('inventory-transactions.create'));

        $response->assertOk();
        $response->assertViewIs('inventoryTransaction.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryTransactionController::class,
            'store',
            InventoryTransactionControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $warehouse = Warehouse::factory()->create();
        $item = Item::factory()->create();
        $type = fake()->randomElement(/** enum_attributes **/);
        $quantity = fake()->numberBetween(-10000, 10000);
        $balance_after = fake()->numberBetween(-10000, 10000);
        $transaction_date = Carbon::parse(fake()->date());

        $response = $this->post(route('inventory-transactions.store'), [
            'warehouse_id' => $warehouse->id,
            'item_id' => $item->id,
            'type' => $type,
            'quantity' => $quantity,
            'balance_after' => $balance_after,
            'transaction_date' => $transaction_date->toDateString(),
        ]);

        $inventoryTransactions = InventoryTransaction::query()
            ->where('warehouse_id', $warehouse->id)
            ->where('item_id', $item->id)
            ->where('type', $type)
            ->where('quantity', $quantity)
            ->where('balance_after', $balance_after)
            ->where('transaction_date', $transaction_date)
            ->get();
        $this->assertCount(1, $inventoryTransactions);
        $inventoryTransaction = $inventoryTransactions->first();

        $response->assertRedirect(route('inventoryTransactions.index'));
        $response->assertSessionHas('inventoryTransaction.id', $inventoryTransaction->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $inventoryTransaction = InventoryTransaction::factory()->create();

        $response = $this->get(route('inventory-transactions.show', $inventoryTransaction));

        $response->assertOk();
        $response->assertViewIs('inventoryTransaction.show');
        $response->assertViewHas('inventoryTransaction', $inventoryTransaction);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $inventoryTransaction = InventoryTransaction::factory()->create();

        $response = $this->get(route('inventory-transactions.edit', $inventoryTransaction));

        $response->assertOk();
        $response->assertViewIs('inventoryTransaction.edit');
        $response->assertViewHas('inventoryTransaction', $inventoryTransaction);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryTransactionController::class,
            'update',
            InventoryTransactionControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $inventoryTransaction = InventoryTransaction::factory()->create();
        $warehouse = Warehouse::factory()->create();
        $item = Item::factory()->create();
        $type = fake()->randomElement(/** enum_attributes **/);
        $quantity = fake()->numberBetween(-10000, 10000);
        $balance_after = fake()->numberBetween(-10000, 10000);
        $transaction_date = Carbon::parse(fake()->date());

        $response = $this->put(route('inventory-transactions.update', $inventoryTransaction), [
            'warehouse_id' => $warehouse->id,
            'item_id' => $item->id,
            'type' => $type,
            'quantity' => $quantity,
            'balance_after' => $balance_after,
            'transaction_date' => $transaction_date->toDateString(),
        ]);

        $inventoryTransaction->refresh();

        $response->assertRedirect(route('inventoryTransactions.index'));
        $response->assertSessionHas('inventoryTransaction.id', $inventoryTransaction->id);

        $this->assertEquals($warehouse->id, $inventoryTransaction->warehouse_id);
        $this->assertEquals($item->id, $inventoryTransaction->item_id);
        $this->assertEquals($type, $inventoryTransaction->type);
        $this->assertEquals($quantity, $inventoryTransaction->quantity);
        $this->assertEquals($balance_after, $inventoryTransaction->balance_after);
        $this->assertEquals($transaction_date, $inventoryTransaction->transaction_date);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $inventoryTransaction = InventoryTransaction::factory()->create();

        $response = $this->delete(route('inventory-transactions.destroy', $inventoryTransaction));

        $response->assertRedirect(route('inventoryTransactions.index'));

        $this->assertModelMissing($inventoryTransaction);
    }
}
