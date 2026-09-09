<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\InventoryIssueItemController;
use App\Http\Requests\InventoryIssueItemControllerStoreRequest;
use App\Http\Requests\InventoryIssueItemControllerUpdateRequest;
use App\Models\InventoryIssue;
use App\Models\InventoryIssueItem;
use App\Models\InventoryRequestItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see InventoryIssueItemController
 */
final class InventoryIssueItemControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $inventoryIssueItems = InventoryIssueItem::factory()->count(3)->create();

        $response = $this->get(route('inventory-issue-items.index'));

        $response->assertOk();
        $response->assertViewIs('inventoryIssueItem.index');
        $response->assertViewHas('inventoryIssueItems', $inventoryIssueItems);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('inventory-issue-items.create'));

        $response->assertOk();
        $response->assertViewIs('inventoryIssueItem.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryIssueItemController::class,
            'store',
            InventoryIssueItemControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $inventory_issue = InventoryIssue::factory()->create();
        $inventory_issue_item = InventoryIssueItem::factory()->create();
        $quantity = fake()->numberBetween(-10000, 10000);
        $inventory_request_item = InventoryRequestItem::factory()->create();

        $response = $this->post(route('inventory-issue-items.store'), [
            'inventory_issue_id' => $inventory_issue->id,
            'inventory_issue_item_id' => $inventory_issue_item->id,
            'quantity' => $quantity,
            'inventory_request_item_id' => $inventory_request_item->id,
        ]);

        $inventoryIssueItems = InventoryIssueItem::query()
            ->where('inventory_issue_id', $inventory_issue->id)
            ->where('inventory_issue_item_id', $inventory_issue_item->id)
            ->where('quantity', $quantity)
            ->where('inventory_request_item_id', $inventory_request_item->id)
            ->get();
        $this->assertCount(1, $inventoryIssueItems);
        $inventoryIssueItem = $inventoryIssueItems->first();

        $response->assertRedirect(route('inventoryIssueItems.index'));
        $response->assertSessionHas('inventoryIssueItem.id', $inventoryIssueItem->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $inventoryIssueItem = InventoryIssueItem::factory()->create();

        $response = $this->get(route('inventory-issue-items.show', $inventoryIssueItem));

        $response->assertOk();
        $response->assertViewIs('inventoryIssueItem.show');
        $response->assertViewHas('inventoryIssueItem', $inventoryIssueItem);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $inventoryIssueItem = InventoryIssueItem::factory()->create();

        $response = $this->get(route('inventory-issue-items.edit', $inventoryIssueItem));

        $response->assertOk();
        $response->assertViewIs('inventoryIssueItem.edit');
        $response->assertViewHas('inventoryIssueItem', $inventoryIssueItem);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            InventoryIssueItemController::class,
            'update',
            InventoryIssueItemControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $inventoryIssueItem = InventoryIssueItem::factory()->create();
        $inventory_issue = InventoryIssue::factory()->create();
        $inventory_issue_item = InventoryIssueItem::factory()->create();
        $quantity = fake()->numberBetween(-10000, 10000);
        $inventory_request_item = InventoryRequestItem::factory()->create();

        $response = $this->put(route('inventory-issue-items.update', $inventoryIssueItem), [
            'inventory_issue_id' => $inventory_issue->id,
            'inventory_issue_item_id' => $inventory_issue_item->id,
            'quantity' => $quantity,
            'inventory_request_item_id' => $inventory_request_item->id,
        ]);

        $inventoryIssueItem->refresh();

        $response->assertRedirect(route('inventoryIssueItems.index'));
        $response->assertSessionHas('inventoryIssueItem.id', $inventoryIssueItem->id);

        $this->assertEquals($inventory_issue->id, $inventoryIssueItem->inventory_issue_id);
        $this->assertEquals($inventory_issue_item->id, $inventoryIssueItem->inventory_issue_item_id);
        $this->assertEquals($quantity, $inventoryIssueItem->quantity);
        $this->assertEquals($inventory_request_item->id, $inventoryIssueItem->inventory_request_item_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $inventoryIssueItem = InventoryIssueItem::factory()->create();

        $response = $this->delete(route('inventory-issue-items.destroy', $inventoryIssueItem));

        $response->assertRedirect(route('inventoryIssueItems.index'));

        $this->assertModelMissing($inventoryIssueItem);
    }
}
