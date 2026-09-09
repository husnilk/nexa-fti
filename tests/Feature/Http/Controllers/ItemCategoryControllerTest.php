<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\ItemCategoryController;
use App\Http\Requests\ItemCategoryControllerStoreRequest;
use App\Http\Requests\ItemCategoryControllerUpdateRequest;
use App\Models\ItemCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see ItemCategoryController
 */
final class ItemCategoryControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $itemCategories = ItemCategory::factory()->count(3)->create();

        $response = $this->get(route('item-categories.index'));

        $response->assertOk();
        $response->assertViewIs('itemCategory.index');
        $response->assertViewHas('itemCategories', $itemCategories);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('item-categories.create'));

        $response->assertOk();
        $response->assertViewIs('itemCategory.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            ItemCategoryController::class,
            'store',
            ItemCategoryControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $code = fake()->word();
        $name = fake()->name();

        $response = $this->post(route('item-categories.store'), [
            'code' => $code,
            'name' => $name,
        ]);

        $itemCategories = ItemCategory::query()
            ->where('code', $code)
            ->where('name', $name)
            ->get();
        $this->assertCount(1, $itemCategories);
        $itemCategory = $itemCategories->first();

        $response->assertRedirect(route('itemCategories.index'));
        $response->assertSessionHas('itemCategory.id', $itemCategory->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $itemCategory = ItemCategory::factory()->create();

        $response = $this->get(route('item-categories.show', $itemCategory));

        $response->assertOk();
        $response->assertViewIs('itemCategory.show');
        $response->assertViewHas('itemCategory', $itemCategory);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $itemCategory = ItemCategory::factory()->create();

        $response = $this->get(route('item-categories.edit', $itemCategory));

        $response->assertOk();
        $response->assertViewIs('itemCategory.edit');
        $response->assertViewHas('itemCategory', $itemCategory);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            ItemCategoryController::class,
            'update',
            ItemCategoryControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $itemCategory = ItemCategory::factory()->create();
        $code = fake()->word();
        $name = fake()->name();

        $response = $this->put(route('item-categories.update', $itemCategory), [
            'code' => $code,
            'name' => $name,
        ]);

        $itemCategory->refresh();

        $response->assertRedirect(route('itemCategories.index'));
        $response->assertSessionHas('itemCategory.id', $itemCategory->id);

        $this->assertEquals($code, $itemCategory->code);
        $this->assertEquals($name, $itemCategory->name);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $itemCategory = ItemCategory::factory()->create();

        $response = $this->delete(route('item-categories.destroy', $itemCategory));

        $response->assertRedirect(route('itemCategories.index'));

        $this->assertModelMissing($itemCategory);
    }
}
