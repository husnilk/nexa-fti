<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\InventoryReceiptController;
use App\Http\Requests\InventoryReceiptControllerStoreRequest;
use App\Http\Requests\InventoryReceiptControllerUpdateRequest;
use App\Models\Employee;
use App\Models\InventoryReceipt;
use App\Models\ReceivedBy;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see InventoryReceiptController
 */
final class InventoryReceiptControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $inventoryReceipts = InventoryReceipt::factory()->count(3)->create();

        $response = $this->get(route('inventory-receipts.index'));

        $response->assertOk();
        $response->assertViewIs('inventoryReceipt.index');
        $response->assertViewHas('inventoryReceipts', $inventoryReceipts);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('inventory-receipts.create'));

        $response->assertOk();
        $response->assertViewIs('inventoryReceipt.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryReceiptController::class,
            'store',
            InventoryReceiptControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $warehouse = Warehouse::factory()->create();
        $receipt_number = fake()->word();
        $receipt_date = Carbon::parse(fake()->date());
        $received_by = ReceivedBy::factory()->create();
        $received_by = Employee::factory()->create();

        $response = $this->post(route('inventory-receipts.store'), [
            'warehouse_id' => $warehouse->id,
            'receipt_number' => $receipt_number,
            'receipt_date' => $receipt_date->toDateString(),
            'received_by' => $received_by->id,
            'received_by_id' => $received_by->id,
        ]);

        $inventoryReceipts = InventoryReceipt::query()
            ->where('warehouse_id', $warehouse->id)
            ->where('receipt_number', $receipt_number)
            ->where('receipt_date', $receipt_date)
            ->where('received_by', $received_by->id)
            ->where('received_by_id', $received_by->id)
            ->get();
        $this->assertCount(1, $inventoryReceipts);
        $inventoryReceipt = $inventoryReceipts->first();

        $response->assertRedirect(route('inventoryReceipts.index'));
        $response->assertSessionHas('inventoryReceipt.id', $inventoryReceipt->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $inventoryReceipt = InventoryReceipt::factory()->create();

        $response = $this->get(route('inventory-receipts.show', $inventoryReceipt));

        $response->assertOk();
        $response->assertViewIs('inventoryReceipt.show');
        $response->assertViewHas('inventoryReceipt', $inventoryReceipt);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $inventoryReceipt = InventoryReceipt::factory()->create();

        $response = $this->get(route('inventory-receipts.edit', $inventoryReceipt));

        $response->assertOk();
        $response->assertViewIs('inventoryReceipt.edit');
        $response->assertViewHas('inventoryReceipt', $inventoryReceipt);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryReceiptController::class,
            'update',
            InventoryReceiptControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $inventoryReceipt = InventoryReceipt::factory()->create();
        $warehouse = Warehouse::factory()->create();
        $receipt_number = fake()->word();
        $receipt_date = Carbon::parse(fake()->date());
        $received_by = ReceivedBy::factory()->create();
        $received_by = Employee::factory()->create();

        $response = $this->put(route('inventory-receipts.update', $inventoryReceipt), [
            'warehouse_id' => $warehouse->id,
            'receipt_number' => $receipt_number,
            'receipt_date' => $receipt_date->toDateString(),
            'received_by' => $received_by->id,
            'received_by_id' => $received_by->id,
        ]);

        $inventoryReceipt->refresh();

        $response->assertRedirect(route('inventoryReceipts.index'));
        $response->assertSessionHas('inventoryReceipt.id', $inventoryReceipt->id);

        $this->assertEquals($warehouse->id, $inventoryReceipt->warehouse_id);
        $this->assertEquals($receipt_number, $inventoryReceipt->receipt_number);
        $this->assertEquals($receipt_date, $inventoryReceipt->receipt_date);
        $this->assertEquals($received_by->id, $inventoryReceipt->received_by);
        $this->assertEquals($received_by->id, $inventoryReceipt->received_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $inventoryReceipt = InventoryReceipt::factory()->create();

        $response = $this->delete(route('inventory-receipts.destroy', $inventoryReceipt));

        $response->assertRedirect(route('inventoryReceipts.index'));

        $this->assertModelMissing($inventoryReceipt);
    }
}
