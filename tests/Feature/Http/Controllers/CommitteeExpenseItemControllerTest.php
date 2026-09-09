<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\CommitteeExpenseItemController;
use App\Http\Requests\CommitteeExpenseItemStoreRequest;
use App\Http\Requests\CommitteeExpenseItemUpdateRequest;
use App\Models\CommitteeExpense;
use App\Models\CommitteeExpenseItem;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see CommitteeExpenseItemController
 */
final class CommitteeExpenseItemControllerTest extends TestCase
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
        $committeeExpenseItems = CommitteeExpenseItem::factory()->count(3)->create();

        $response = $this->get(route('committee-expense-items.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/expense-items/index'));

    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('committee-expense-items.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/expense-items/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommitteeExpenseItemController::class,
            'store',
            CommitteeExpenseItemStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $committee_expense = CommitteeExpense::factory()->create();
        $description = fake()->text();
        $quantity = fake()->randomFloat(2, 1, 100);
        $unit_price = fake()->randomFloat(2, 1, 1000);
        $total_amount = fake()->randomFloat(2, 1, 10000);

        $response = $this->post(route('committee-expense-items.store'), [
            'committee_expense_id' => $committee_expense->id,
            'description' => $description,
            'quantity' => $quantity,
            'unit_price' => $unit_price,
            'total_amount' => $total_amount,
        ]);

        $committeeExpenseItems = CommitteeExpenseItem::query()
            ->where('committee_expense_id', $committee_expense->id)
            ->where('description', $description)
            ->where('quantity', $quantity)
            ->where('unit_price', $unit_price)
            ->where('total_amount', $total_amount)
            ->get();
        $this->assertCount(1, $committeeExpenseItems);
        $committeeExpenseItem = $committeeExpenseItems->first();

        $response->assertRedirect(route('committee-expense-items.index'));
        $response->assertSessionHas('committeeExpenseItem.id', $committeeExpenseItem->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $committeeExpenseItem = CommitteeExpenseItem::factory()->create();

        $response = $this->get(route('committee-expense-items.show', $committeeExpenseItem));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/expense-items/show'));

    }

    #[Test]
    public function edit_displays_view(): void
    {
        $committeeExpenseItem = CommitteeExpenseItem::factory()->create();

        $response = $this->get(route('committee-expense-items.edit', $committeeExpenseItem));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/expense-items/edit'));

    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommitteeExpenseItemController::class,
            'update',
            CommitteeExpenseItemUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $committeeExpenseItem = CommitteeExpenseItem::factory()->create();
        $committee_expense = CommitteeExpense::factory()->create();
        $description = fake()->text();
        $quantity = fake()->randomFloat(2, 1, 100);
        $unit_price = fake()->randomFloat(2, 1, 1000);
        $total_amount = fake()->randomFloat(2, 1, 10000);

        $response = $this->put(route('committee-expense-items.update', $committeeExpenseItem), [
            'committee_expense_id' => $committee_expense->id,
            'description' => $description,
            'quantity' => $quantity,
            'unit_price' => $unit_price,
            'total_amount' => $total_amount,
        ]);

        $committeeExpenseItem->refresh();

        $response->assertRedirect(route('committee-expense-items.index'));
        $response->assertSessionHas('committeeExpenseItem.id', $committeeExpenseItem->id);

        $this->assertEquals($committee_expense->id, $committeeExpenseItem->committee_expense_id);
        $this->assertEquals($description, $committeeExpenseItem->description);
        $this->assertEquals($quantity, $committeeExpenseItem->quantity);
        $this->assertEquals($unit_price, $committeeExpenseItem->unit_price);
        $this->assertEquals($total_amount, $committeeExpenseItem->total_amount);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $committeeExpenseItem = CommitteeExpenseItem::factory()->create();

        $response = $this->delete(route('committee-expense-items.destroy', $committeeExpenseItem));

        $response->assertRedirect(route('committee-expense-items.index'));

        $this->assertModelMissing($committeeExpenseItem);
    }
}
