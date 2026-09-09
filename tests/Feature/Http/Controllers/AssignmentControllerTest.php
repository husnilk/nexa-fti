<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\AssignmentController;
use App\Http\Requests\AssignmentStoreRequest;
use App\Http\Requests\AssignmentUpdateRequest;
use App\Models\Assignment;
use App\Models\Employee;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Inertia\Testing\AssertableInertia as Assert;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see AssignmentController
 */
final class AssignmentControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        Permission::findOrCreate('assignment.view', 'web');
        Permission::findOrCreate('assignment.manage', 'web');
        $this->user->givePermissionTo(['assignment.view', 'assignment.manage']);
    }

    #[Test]
    public function index_displays_view(): void
    {
        Assignment::factory()->count(3)->create();

        $response = $this->actingAs($this->user)->get(route('assignments.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('assignments/index'));
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->actingAs($this->user)->get(route('assignments.create'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('assignments/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            AssignmentController::class,
            'store',
            AssignmentStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $assignedBy = Employee::factory()->create();
        $assignedTo = Employee::factory()->create();
        $title = fake()->sentence(4);
        $status = fake()->randomElement(['assigned', 'in_progress', 'completed', 'delegated', 'cancelled']);
        $priority = fake()->randomElement(['low', 'medium', 'high']);

        $response = $this->actingAs($this->user)->post(route('assignments.store'), [
            'title' => $title,
            'assigned_by' => $assignedBy->id,
            'assigned_to' => $assignedTo->id,
            'status' => $status,
            'priority' => $priority,
        ]);

        $response->assertRedirect(route('assignments.index'));

        $this->assertDatabaseHas('assignments', [
            'title' => $title,
            'assigned_by' => $assignedBy->id,
            'assigned_to' => $assignedTo->id,
            'status' => $status,
            'priority' => $priority,
        ]);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $assignment = Assignment::factory()->create();

        $response = $this->actingAs($this->user)->get(route('assignments.show', $assignment));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('assignments/show'));
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $assignment = Assignment::factory()->create();

        $response = $this->actingAs($this->user)->get(route('assignments.edit', $assignment));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('assignments/edit'));
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            AssignmentController::class,
            'update',
            AssignmentUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $assignment = Assignment::factory()->create();
        $assignedBy = Employee::factory()->create();
        $assignedTo = Employee::factory()->create();
        $title = fake()->sentence(4);
        $status = fake()->randomElement(['assigned', 'in_progress', 'completed', 'delegated', 'cancelled']);
        $priority = fake()->randomElement(['low', 'medium', 'high']);

        $response = $this->actingAs($this->user)->put(route('assignments.update', $assignment), [
            'title' => $title,
            'assigned_by' => $assignedBy->id,
            'assigned_to' => $assignedTo->id,
            'status' => $status,
            'priority' => $priority,
        ]);

        $assignment->refresh();

        $response->assertRedirect(route('assignments.index'));

        $this->assertEquals($title, $assignment->title);
        $this->assertEquals($assignedBy->id, $assignment->assigned_by);
        $this->assertEquals($assignedTo->id, $assignment->assigned_to);
        $this->assertEquals($status, $assignment->status);
        $this->assertEquals($priority, $assignment->priority);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $assignment = Assignment::factory()->create();

        $response = $this->actingAs($this->user)->delete(route('assignments.destroy', $assignment));

        $response->assertRedirect(route('assignments.index'));

        $this->assertModelMissing($assignment);
    }
}
