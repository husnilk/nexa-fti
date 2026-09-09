<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\CommitteeTaskController;
use App\Http\Requests\CommitteeTaskStoreRequest;
use App\Http\Requests\CommitteeTaskUpdateRequest;
use App\Models\CommitteeMember;
use App\Models\CommitteeTask;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see CommitteeTaskController
 */
final class CommitteeTaskControllerTest extends TestCase
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
        $committeeTasks = CommitteeTask::factory()->count(3)->create();

        $response = $this->get(route('committee-tasks.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/tasks/index'));

    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('committee-tasks.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/tasks/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommitteeTaskController::class,
            'store',
            CommitteeTaskStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $title = fake()->sentence(4);
        $priority = fake()->randomElement(['low', 'medium', 'high']);
        $status = fake()->randomElement(['open', 'in_progress', 'completed', 'cancelled']);
        $completion_percentage = fake()->randomFloat(2, 0, 100);
        $parent_id = CommitteeTask::factory()->create();
        $assigned_to = CommitteeMember::factory()->create();

        $response = $this->post(route('committee-tasks.store'), [
            'title' => $title,
            'priority' => $priority,
            'status' => $status,
            'completion_percentage' => $completion_percentage,
            'parent_id_id' => $parent_id->id,
            'assigned_to_id' => $assigned_to->id,
        ]);

        $committeeTasks = CommitteeTask::query()
            ->where('title', $title)
            ->where('priority', $priority)
            ->where('status', $status)
            ->where('completion_percentage', $completion_percentage)
            ->where('parent_id_id', $parent_id->id)
            ->where('assigned_to_id', $assigned_to->id)
            ->get();
        $this->assertCount(1, $committeeTasks);
        $committeeTask = $committeeTasks->first();

        $response->assertRedirect(route('committee-tasks.index'));
        $response->assertSessionHas('committeeTask.id', $committeeTask->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $committeeTask = CommitteeTask::factory()->create();

        $response = $this->get(route('committee-tasks.show', $committeeTask));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/tasks/show'));

    }

    #[Test]
    public function edit_displays_view(): void
    {
        $committeeTask = CommitteeTask::factory()->create();

        $response = $this->get(route('committee-tasks.edit', $committeeTask));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/tasks/edit'));

    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommitteeTaskController::class,
            'update',
            CommitteeTaskUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $committeeTask = CommitteeTask::factory()->create();
        $title = fake()->sentence(4);
        $priority = fake()->randomElement(['low', 'medium', 'high']);
        $status = fake()->randomElement(['open', 'in_progress', 'completed', 'cancelled']);
        $completion_percentage = fake()->randomFloat(2, 0, 100);
        $parent_id = CommitteeTask::factory()->create();
        $assigned_to = CommitteeMember::factory()->create();

        $response = $this->put(route('committee-tasks.update', $committeeTask), [
            'title' => $title,
            'priority' => $priority,
            'status' => $status,
            'completion_percentage' => $completion_percentage,
            'parent_id_id' => $parent_id->id,
            'assigned_to_id' => $assigned_to->id,
        ]);

        $committeeTask->refresh();

        $response->assertRedirect(route('committee-tasks.index'));
        $response->assertSessionHas('committeeTask.id', $committeeTask->id);

        $this->assertEquals($title, $committeeTask->title);
        $this->assertEquals($priority, $committeeTask->priority);
        $this->assertEquals($status, $committeeTask->status);
        $this->assertEquals($completion_percentage, $committeeTask->completion_percentage);
        $this->assertEquals($parent_id->id, $committeeTask->parent_id_id);
        $this->assertEquals($assigned_to->id, $committeeTask->assigned_to_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $committeeTask = CommitteeTask::factory()->create();

        $response = $this->delete(route('committee-tasks.destroy', $committeeTask));

        $response->assertRedirect(route('committee-tasks.index'));

        $this->assertModelMissing($committeeTask);
    }
}
