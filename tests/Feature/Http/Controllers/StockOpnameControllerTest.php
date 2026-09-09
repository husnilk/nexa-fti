<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\StockOpnameController;
use App\Http\Requests\StockOpnameControllerStoreRequest;
use App\Http\Requests\StockOpnameControllerUpdateRequest;
use App\Models\ConductedBy;
use App\Models\Employee;
use App\Models\StockOpname;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see StockOpnameController
 */
final class StockOpnameControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $stockOpnames = StockOpname::factory()->count(3)->create();

        $response = $this->get(route('stock-opnames.index'));

        $response->assertOk();
        $response->assertViewIs('stockOpname.index');
        $response->assertViewHas('stockOpnames', $stockOpnames);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('stock-opnames.create'));

        $response->assertOk();
        $response->assertViewIs('stockOpname.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            StockOpnameController::class,
            'store',
            StockOpnameControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $warehouse = Warehouse::factory()->create();
        $opname_number = fake()->word();
        $opname_date = Carbon::parse(fake()->date());
        $conducted_by = ConductedBy::factory()->create();
        $status = fake()->randomElement(/** enum_attributes **/);
        $conducted_by = Employee::factory()->create();

        $response = $this->post(route('stock-opnames.store'), [
            'warehouse_id' => $warehouse->id,
            'opname_number' => $opname_number,
            'opname_date' => $opname_date->toDateString(),
            'conducted_by' => $conducted_by->id,
            'status' => $status,
            'conducted_by_id' => $conducted_by->id,
        ]);

        $stockOpnames = StockOpname::query()
            ->where('warehouse_id', $warehouse->id)
            ->where('opname_number', $opname_number)
            ->where('opname_date', $opname_date)
            ->where('conducted_by', $conducted_by->id)
            ->where('status', $status)
            ->where('conducted_by_id', $conducted_by->id)
            ->get();
        $this->assertCount(1, $stockOpnames);
        $stockOpname = $stockOpnames->first();

        $response->assertRedirect(route('stockOpnames.index'));
        $response->assertSessionHas('stockOpname.id', $stockOpname->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $stockOpname = StockOpname::factory()->create();

        $response = $this->get(route('stock-opnames.show', $stockOpname));

        $response->assertOk();
        $response->assertViewIs('stockOpname.show');
        $response->assertViewHas('stockOpname', $stockOpname);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $stockOpname = StockOpname::factory()->create();

        $response = $this->get(route('stock-opnames.edit', $stockOpname));

        $response->assertOk();
        $response->assertViewIs('stockOpname.edit');
        $response->assertViewHas('stockOpname', $stockOpname);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            StockOpnameController::class,
            'update',
            StockOpnameControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $stockOpname = StockOpname::factory()->create();
        $warehouse = Warehouse::factory()->create();
        $opname_number = fake()->word();
        $opname_date = Carbon::parse(fake()->date());
        $conducted_by = ConductedBy::factory()->create();
        $status = fake()->randomElement(/** enum_attributes **/);
        $conducted_by = Employee::factory()->create();

        $response = $this->put(route('stock-opnames.update', $stockOpname), [
            'warehouse_id' => $warehouse->id,
            'opname_number' => $opname_number,
            'opname_date' => $opname_date->toDateString(),
            'conducted_by' => $conducted_by->id,
            'status' => $status,
            'conducted_by_id' => $conducted_by->id,
        ]);

        $stockOpname->refresh();

        $response->assertRedirect(route('stockOpnames.index'));
        $response->assertSessionHas('stockOpname.id', $stockOpname->id);

        $this->assertEquals($warehouse->id, $stockOpname->warehouse_id);
        $this->assertEquals($opname_number, $stockOpname->opname_number);
        $this->assertEquals($opname_date, $stockOpname->opname_date);
        $this->assertEquals($conducted_by->id, $stockOpname->conducted_by);
        $this->assertEquals($status, $stockOpname->status);
        $this->assertEquals($conducted_by->id, $stockOpname->conducted_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $stockOpname = StockOpname::factory()->create();

        $response = $this->delete(route('stock-opnames.destroy', $stockOpname));

        $response->assertRedirect(route('stockOpnames.index'));

        $this->assertModelMissing($stockOpname);
    }
}
