<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\CommitteeExpenseController;
use App\Http\Requests\CommitteeExpenseStoreRequest;
use App\Http\Requests\CommitteeExpenseUpdateRequest;
use App\Models\Committee;
use App\Models\CommitteeExpense;
use App\Models\Employee;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see CommitteeExpenseController
 */
final class CommitteeExpenseControllerTest extends TestCase
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
        $committeeExpenses = CommitteeExpense::factory()->count(3)->create();

        $response = $this->get(route('committee-expenses.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/expenses/index'));

    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('committee-expenses.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/expenses/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommitteeExpenseController::class,
            'store',
            CommitteeExpenseStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $committee = Committee::factory()->create();
        $expense_number = fake()->word();
        $expense_date = Carbon::parse(fake()->date());
        $status = fake()->randomElement(['draft', 'submitted', 'approved', 'rejected']);
        $submitted_by = Employee::factory()->create();
        $approved_by = Employee::factory()->create();

        $response = $this->post(route('committee-expenses.store'), [
            'committee_id' => $committee->id,
            'expense_number' => $expense_number,
            'expense_date' => $expense_date->toDateString(),
            'status' => $status,
            'submitted_by_id' => $submitted_by->id,
            'approved_by_id' => $approved_by->id,
        ]);

        $committeeExpenses = CommitteeExpense::query()
            ->where('committee_id', $committee->id)
            ->where('expense_number', $expense_number)
            ->where('expense_date', $expense_date)
            ->where('status', $status)
            ->where('submitted_by_id', $submitted_by->id)
            ->where('approved_by_id', $approved_by->id)
            ->get();
        $this->assertCount(1, $committeeExpenses);
        $committeeExpense = $committeeExpenses->first();

        $response->assertRedirect(route('committee-expenses.index'));
        $response->assertSessionHas('committeeExpense.id', $committeeExpense->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $committeeExpense = CommitteeExpense::factory()->create();

        $response = $this->get(route('committee-expenses.show', $committeeExpense));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/expenses/show'));

    }

    #[Test]
    public function edit_displays_view(): void
    {
        $committeeExpense = CommitteeExpense::factory()->create();

        $response = $this->get(route('committee-expenses.edit', $committeeExpense));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/expenses/edit'));

    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommitteeExpenseController::class,
            'update',
            CommitteeExpenseUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $committeeExpense = CommitteeExpense::factory()->create();
        $committee = Committee::factory()->create();
        $expense_number = fake()->word();
        $expense_date = Carbon::parse(fake()->date());
        $status = fake()->randomElement(['draft', 'submitted', 'approved', 'rejected']);
        $submitted_by = Employee::factory()->create();
        $approved_by = Employee::factory()->create();

        $response = $this->put(route('committee-expenses.update', $committeeExpense), [
            'committee_id' => $committee->id,
            'expense_number' => $expense_number,
            'expense_date' => $expense_date->toDateString(),
            'status' => $status,
            'submitted_by_id' => $submitted_by->id,
            'approved_by_id' => $approved_by->id,
        ]);

        $committeeExpense->refresh();

        $response->assertRedirect(route('committee-expenses.index'));
        $response->assertSessionHas('committeeExpense.id', $committeeExpense->id);

        $this->assertEquals($committee->id, $committeeExpense->committee_id);
        $this->assertEquals($expense_number, $committeeExpense->expense_number);
        $this->assertEquals($expense_date, $committeeExpense->expense_date);
        $this->assertEquals($status, $committeeExpense->status);
        $this->assertEquals($submitted_by->id, $committeeExpense->submitted_by_id);
        $this->assertEquals($approved_by->id, $committeeExpense->approved_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $committeeExpense = CommitteeExpense::factory()->create();

        $response = $this->delete(route('committee-expenses.destroy', $committeeExpense));

        $response->assertRedirect(route('committee-expenses.index'));

        $this->assertModelMissing($committeeExpense);
    }
}
