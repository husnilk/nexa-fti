<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\CommitteeBudgetItemController;
use App\Http\Requests\CommitteeBudgetItemStoreRequest;
use App\Http\Requests\CommitteeBudgetItemUpdateRequest;
use App\Models\CommitteeBudget;
use App\Models\CommitteeBudgetItem;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see CommitteeBudgetItemController
 */
final class CommitteeBudgetItemControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        Permission::findOrCreate('committee.view', 'web');
        Permission::findOrCreate('committee.manage', 'web');
        $this->user->givePermissionTo(['committee.view', 'committee.manage']);
        $this->actingAs($this->user);
    }

    #[Test]
    public function index_displays_view(): void
    {
        $committeeBudgetItems = CommitteeBudgetItem::factory()->count(3)->create();

        $response = $this->get(route('committee-budget-items.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/budget-items/index'));

    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('committee-budget-items.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/budget-items/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommitteeBudgetItemController::class,
            'store',
            CommitteeBudgetItemStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $committee_budget = CommitteeBudget::factory()->create();
        $category = fake()->word();
        $description = fake()->text();
        $quantity = fake()->randomFloat(2, 1, 100);
        $unit_price = fake()->randomFloat(2, 1, 1000);
        $total_amount = fake()->randomFloat(2, 1, 10000);

        $response = $this->post(route('committee-budget-items.store'), [
            'committee_budget_id' => $committee_budget->id,
            'category' => $category,
            'description' => $description,
            'quantity' => $quantity,
            'unit_price' => $unit_price,
            'total_amount' => $total_amount,
        ]);

        $committeeBudgetItems = CommitteeBudgetItem::query()
            ->where('committee_budget_id', $committee_budget->id)
            ->where('category', $category)
            ->where('description', $description)
            ->where('quantity', $quantity)
            ->where('unit_price', $unit_price)
            ->where('total_amount', $total_amount)
            ->get();
        $this->assertCount(1, $committeeBudgetItems);
        $committeeBudgetItem = $committeeBudgetItems->first();

        $response->assertRedirect(route('committee-budget-items.index'));
        $response->assertSessionHas('committeeBudgetItem.id', $committeeBudgetItem->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $committeeBudgetItem = CommitteeBudgetItem::factory()->create();

        $response = $this->get(route('committee-budget-items.show', $committeeBudgetItem));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/budget-items/show'));

    }

    #[Test]
    public function edit_displays_view(): void
    {
        $committeeBudgetItem = CommitteeBudgetItem::factory()->create();

        $response = $this->get(route('committee-budget-items.edit', $committeeBudgetItem));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/budget-items/edit'));

    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommitteeBudgetItemController::class,
            'update',
            CommitteeBudgetItemUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $committeeBudgetItem = CommitteeBudgetItem::factory()->create();
        $committee_budget = CommitteeBudget::factory()->create();
        $category = fake()->word();
        $description = fake()->text();
        $quantity = fake()->randomFloat(2, 1, 100);
        $unit_price = fake()->randomFloat(2, 1, 1000);
        $total_amount = fake()->randomFloat(2, 1, 10000);

        $response = $this->put(route('committee-budget-items.update', $committeeBudgetItem), [
            'committee_budget_id' => $committee_budget->id,
            'category' => $category,
            'description' => $description,
            'quantity' => $quantity,
            'unit_price' => $unit_price,
            'total_amount' => $total_amount,
        ]);

        $committeeBudgetItem->refresh();

        $response->assertRedirect(route('committee-budget-items.index'));
        $response->assertSessionHas('committeeBudgetItem.id', $committeeBudgetItem->id);

        $this->assertEquals($committee_budget->id, $committeeBudgetItem->committee_budget_id);
        $this->assertEquals($category, $committeeBudgetItem->category);
        $this->assertEquals($description, $committeeBudgetItem->description);
        $this->assertEquals($quantity, $committeeBudgetItem->quantity);
        $this->assertEquals($unit_price, $committeeBudgetItem->unit_price);
        $this->assertEquals($total_amount, $committeeBudgetItem->total_amount);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $committeeBudgetItem = CommitteeBudgetItem::factory()->create();

        $response = $this->delete(route('committee-budget-items.destroy', $committeeBudgetItem));

        $response->assertRedirect(route('committee-budget-items.index'));

        $this->assertModelMissing($committeeBudgetItem);
    }
}
