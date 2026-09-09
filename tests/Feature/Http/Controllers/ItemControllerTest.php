<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\ItemController;
use App\Http\Requests\ItemControllerStoreRequest;
use App\Http\Requests\ItemControllerUpdateRequest;
use App\Models\Item;
use App\Models\ItemCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see ItemController
 */
final class ItemControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $items = Item::factory()->count(3)->create();

        $response = $this->get(route('items.index'));

        $response->assertOk();
        $response->assertViewIs('item.index');
        $response->assertViewHas('items', $items);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('items.create'));

        $response->assertOk();
        $response->assertViewIs('item.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            ItemController::class,
            'store',
            ItemControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $item_category = ItemCategory::factory()->create();
        $name = fake()->name();
        $code = fake()->word();
        $unit = fake()->word();
        $minimal_quantity = fake()->numberBetween(-10000, 10000);

        $response = $this->post(route('items.store'), [
            'item_category_id' => $item_category->id,
            'name' => $name,
            'code' => $code,
            'unit' => $unit,
            'minimal_quantity' => $minimal_quantity,
        ]);

        $items = Item::query()
            ->where('item_category_id', $item_category->id)
            ->where('name', $name)
            ->where('code', $code)
            ->where('unit', $unit)
            ->where('minimal_quantity', $minimal_quantity)
            ->get();
        $this->assertCount(1, $items);
        $item = $items->first();

        $response->assertRedirect(route('items.index'));
        $response->assertSessionHas('item.id', $item->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $item = Item::factory()->create();

        $response = $this->get(route('items.show', $item));

        $response->assertOk();
        $response->assertViewIs('item.show');
        $response->assertViewHas('item', $item);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $item = Item::factory()->create();

        $response = $this->get(route('items.edit', $item));

        $response->assertOk();
        $response->assertViewIs('item.edit');
        $response->assertViewHas('item', $item);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            ItemController::class,
            'update',
            ItemControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $item = Item::factory()->create();
        $item_category = ItemCategory::factory()->create();
        $name = fake()->name();
        $code = fake()->word();
        $unit = fake()->word();
        $minimal_quantity = fake()->numberBetween(-10000, 10000);

        $response = $this->put(route('items.update', $item), [
            'item_category_id' => $item_category->id,
            'name' => $name,
            'code' => $code,
            'unit' => $unit,
            'minimal_quantity' => $minimal_quantity,
        ]);

        $item->refresh();

        $response->assertRedirect(route('items.index'));
        $response->assertSessionHas('item.id', $item->id);

        $this->assertEquals($item_category->id, $item->item_category_id);
        $this->assertEquals($name, $item->name);
        $this->assertEquals($code, $item->code);
        $this->assertEquals($unit, $item->unit);
        $this->assertEquals($minimal_quantity, $item->minimal_quantity);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $item = Item::factory()->create();

        $response = $this->delete(route('items.destroy', $item));

        $response->assertRedirect(route('items.index'));

        $this->assertModelMissing($item);
    }
}
