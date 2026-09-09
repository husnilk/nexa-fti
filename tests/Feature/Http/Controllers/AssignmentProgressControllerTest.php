<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\AssignmentProgressController;
use App\Http\Requests\AssignmentProgressStoreRequest;
use App\Http\Requests\AssignmentProgressUpdateRequest;
use App\Models\Assignment;
use App\Models\AssignmentProgress;
use App\Models\Employee;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use Inertia\Testing\AssertableInertia as Assert;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see AssignmentProgressController
 */
final class AssignmentProgressControllerTest extends TestCase
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
        $assignmentProgresses = AssignmentProgress::factory()->count(3)->create();

        $response = $this->actingAs($this->user)->get(route('assignment-progresses.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('assignment-progresses/index'));
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->actingAs($this->user)->get(route('assignment-progresses.create'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('assignment-progresses/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            AssignmentProgressController::class,
            'store',
            AssignmentProgressStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $assignment = Assignment::factory()->create();
        $progress_date = Carbon::parse(fake()->date());
        $status = fake()->randomElement(['in_progress', 'completed']);
        $created_by = Employee::factory()->create();
        $employee = Employee::factory()->create();

        $response = $this->actingAs($this->user)->post(route('assignment-progresses.store'), [
            'assignment_id' => $assignment->id,
            'progress_date' => $progress_date->toDateString(),
            'status' => $status,
            'created_by' => $created_by->id,
            'employee_id' => $employee->id,
        ]);

        $assignmentProgresses = AssignmentProgress::query()
            ->where('assignment_id', $assignment->id)
            ->where('progress_date', $progress_date)
            ->where('status', $status)
            ->where('created_by', $created_by->id)
            ->where('employee_id', $employee->id)
            ->get();
        $this->assertCount(1, $assignmentProgresses);

        $response->assertRedirect(route('assignment-progresses.index', ['assignment_id' => $assignment->id]));
    }

    #[Test]
    public function show_displays_view(): void
    {
        $assignmentProgress = AssignmentProgress::factory()->create();

        $response = $this->actingAs($this->user)->get(route('assignment-progresses.show', $assignmentProgress));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('assignment-progresses/show'));
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $assignmentProgress = AssignmentProgress::factory()->create();

        $response = $this->actingAs($this->user)->get(route('assignment-progresses.edit', $assignmentProgress));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('assignment-progresses/edit'));
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            AssignmentProgressController::class,
            'update',
            AssignmentProgressUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $assignmentProgress = AssignmentProgress::factory()->create();
        $assignment = Assignment::factory()->create();
        $progress_date = Carbon::parse(fake()->date());
        $status = fake()->randomElement(['in_progress', 'completed']);
        $created_by = Employee::factory()->create();
        $employee = Employee::factory()->create();

        $response = $this->actingAs($this->user)->put(route('assignment-progresses.update', $assignmentProgress), [
            'assignment_id' => $assignment->id,
            'progress_date' => $progress_date->toDateString(),
            'status' => $status,
            'created_by' => $created_by->id,
            'employee_id' => $employee->id,
        ]);

        $assignmentProgress->refresh();

        $response->assertRedirect(route('assignment-progresses.index', ['assignment_id' => $assignment->id]));

        $this->assertEquals($assignment->id, $assignmentProgress->assignment_id);
        $this->assertEquals($progress_date, $assignmentProgress->progress_date);
        $this->assertEquals($status, $assignmentProgress->status);
        $this->assertEquals($created_by->id, $assignmentProgress->created_by);
        $this->assertEquals($employee->id, $assignmentProgress->employee_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $assignmentProgress = AssignmentProgress::factory()->create();

        $response = $this->actingAs($this->user)->delete(route('assignment-progresses.destroy', $assignmentProgress));

        $response->assertRedirect(route('assignment-progresses.index', ['assignment_id' => $assignmentProgress->assignment_id]));

        $this->assertModelMissing($assignmentProgress);
    }
}
