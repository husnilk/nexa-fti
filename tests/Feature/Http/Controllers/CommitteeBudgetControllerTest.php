<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\CommitteeBudgetController;
use App\Http\Requests\CommitteeBudgetStoreRequest;
use App\Http\Requests\CommitteeBudgetUpdateRequest;
use App\Models\Committee;
use App\Models\CommitteeBudget;
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
 * @see CommitteeBudgetController
 */
final class CommitteeBudgetControllerTest extends TestCase
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
        $committeeBudgets = CommitteeBudget::factory()->count(3)->create();

        $response = $this->get(route('committee-budgets.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/budgets/index'));

    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('committee-budgets.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/budgets/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommitteeBudgetController::class,
            'store',
            CommitteeBudgetStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $committee = Committee::factory()->create();
        $budget_number = fake()->word();
        $title = fake()->sentence(4);
        $prepared_at = Carbon::parse(fake()->date());
        $status = fake()->randomElement(['draft', 'submitted', 'approved', 'rejected']);
        $prepared_by = Employee::factory()->create();
        $approved_by = Employee::factory()->create();

        $response = $this->post(route('committee-budgets.store'), [
            'committee_id' => $committee->id,
            'budget_number' => $budget_number,
            'title' => $title,
            'prepared_at' => $prepared_at->toDateString(),
            'status' => $status,
            'prepared_by_id' => $prepared_by->id,
            'approved_by_id' => $approved_by->id,
        ]);

        $committeeBudgets = CommitteeBudget::query()
            ->where('committee_id', $committee->id)
            ->where('budget_number', $budget_number)
            ->where('title', $title)
            ->where('prepared_at', $prepared_at)
            ->where('status', $status)
            ->where('prepared_by_id', $prepared_by->id)
            ->where('approved_by_id', $approved_by->id)
            ->get();
        $this->assertCount(1, $committeeBudgets);
        $committeeBudget = $committeeBudgets->first();

        $response->assertRedirect(route('committee-budgets.index'));
        $response->assertSessionHas('committeeBudget.id', $committeeBudget->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $committeeBudget = CommitteeBudget::factory()->create();

        $response = $this->get(route('committee-budgets.show', $committeeBudget));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/budgets/show'));

    }

    #[Test]
    public function edit_displays_view(): void
    {
        $committeeBudget = CommitteeBudget::factory()->create();

        $response = $this->get(route('committee-budgets.edit', $committeeBudget));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/budgets/edit'));

    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommitteeBudgetController::class,
            'update',
            CommitteeBudgetUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $committeeBudget = CommitteeBudget::factory()->create();
        $committee = Committee::factory()->create();
        $budget_number = fake()->word();
        $title = fake()->sentence(4);
        $prepared_at = Carbon::parse(fake()->date());
        $status = fake()->randomElement(['draft', 'submitted', 'approved', 'rejected']);
        $prepared_by = Employee::factory()->create();
        $approved_by = Employee::factory()->create();

        $response = $this->put(route('committee-budgets.update', $committeeBudget), [
            'committee_id' => $committee->id,
            'budget_number' => $budget_number,
            'title' => $title,
            'prepared_at' => $prepared_at->toDateString(),
            'status' => $status,
            'prepared_by_id' => $prepared_by->id,
            'approved_by_id' => $approved_by->id,
        ]);

        $committeeBudget->refresh();

        $response->assertRedirect(route('committee-budgets.index'));
        $response->assertSessionHas('committeeBudget.id', $committeeBudget->id);

        $this->assertEquals($committee->id, $committeeBudget->committee_id);
        $this->assertEquals($budget_number, $committeeBudget->budget_number);
        $this->assertEquals($title, $committeeBudget->title);
        $this->assertEquals($prepared_at, $committeeBudget->prepared_at);
        $this->assertEquals($status, $committeeBudget->status);
        $this->assertEquals($prepared_by->id, $committeeBudget->prepared_by_id);
        $this->assertEquals($approved_by->id, $committeeBudget->approved_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $committeeBudget = CommitteeBudget::factory()->create();

        $response = $this->delete(route('committee-budgets.destroy', $committeeBudget));

        $response->assertRedirect(route('committee-budgets.index'));

        $this->assertModelMissing($committeeBudget);
    }
}
