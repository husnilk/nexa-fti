<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EquipmentReceiptController;
use App\Http\Requests\EquipmentReceiptControllerStoreRequest;
use App\Http\Requests\EquipmentReceiptControllerUpdateRequest;
use App\Models\Employee;
use App\Models\EquipmentReceipt;
use App\Models\ReceivedBy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EquipmentReceiptController
 */
final class EquipmentReceiptControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $equipmentReceipts = EquipmentReceipt::factory()->count(3)->create();

        $response = $this->get(route('equipment-receipts.index'));

        $response->assertOk();
        $response->assertViewIs('equipmentReceipt.index');
        $response->assertViewHas('equipmentReceipts', $equipmentReceipts);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('equipment-receipts.create'));

        $response->assertOk();
        $response->assertViewIs('equipmentReceipt.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentReceiptController::class,
            'store',
            EquipmentReceiptControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $receipt_number = fake()->word();
        $receipt_date = Carbon::parse(fake()->date());
        $received_by = ReceivedBy::factory()->create();
        $received_by = Employee::factory()->create();

        $response = $this->post(route('equipment-receipts.store'), [
            'receipt_number' => $receipt_number,
            'receipt_date' => $receipt_date->toDateString(),
            'received_by' => $received_by->id,
            'received_by_id' => $received_by->id,
        ]);

        $equipmentReceipts = EquipmentReceipt::query()
            ->where('receipt_number', $receipt_number)
            ->where('receipt_date', $receipt_date)
            ->where('received_by', $received_by->id)
            ->where('received_by_id', $received_by->id)
            ->get();
        $this->assertCount(1, $equipmentReceipts);
        $equipmentReceipt = $equipmentReceipts->first();

        $response->assertRedirect(route('equipmentReceipts.index'));
        $response->assertSessionHas('equipmentReceipt.id', $equipmentReceipt->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $equipmentReceipt = EquipmentReceipt::factory()->create();

        $response = $this->get(route('equipment-receipts.show', $equipmentReceipt));

        $response->assertOk();
        $response->assertViewIs('equipmentReceipt.show');
        $response->assertViewHas('equipmentReceipt', $equipmentReceipt);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $equipmentReceipt = EquipmentReceipt::factory()->create();

        $response = $this->get(route('equipment-receipts.edit', $equipmentReceipt));

        $response->assertOk();
        $response->assertViewIs('equipmentReceipt.edit');
        $response->assertViewHas('equipmentReceipt', $equipmentReceipt);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentReceiptController::class,
            'update',
            EquipmentReceiptControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $equipmentReceipt = EquipmentReceipt::factory()->create();
        $receipt_number = fake()->word();
        $receipt_date = Carbon::parse(fake()->date());
        $received_by = ReceivedBy::factory()->create();
        $received_by = Employee::factory()->create();

        $response = $this->put(route('equipment-receipts.update', $equipmentReceipt), [
            'receipt_number' => $receipt_number,
            'receipt_date' => $receipt_date->toDateString(),
            'received_by' => $received_by->id,
            'received_by_id' => $received_by->id,
        ]);

        $equipmentReceipt->refresh();

        $response->assertRedirect(route('equipmentReceipts.index'));
        $response->assertSessionHas('equipmentReceipt.id', $equipmentReceipt->id);

        $this->assertEquals($receipt_number, $equipmentReceipt->receipt_number);
        $this->assertEquals($receipt_date, $equipmentReceipt->receipt_date);
        $this->assertEquals($received_by->id, $equipmentReceipt->received_by);
        $this->assertEquals($received_by->id, $equipmentReceipt->received_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $equipmentReceipt = EquipmentReceipt::factory()->create();

        $response = $this->delete(route('equipment-receipts.destroy', $equipmentReceipt));

        $response->assertRedirect(route('equipmentReceipts.index'));

        $this->assertModelMissing($equipmentReceipt);
    }
}
