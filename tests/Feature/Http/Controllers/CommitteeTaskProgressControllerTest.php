<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\CommitteeTaskProgressController;
use App\Http\Requests\CommitteeTaskProgressStoreRequest;
use App\Http\Requests\CommitteeTaskProgressUpdateRequest;
use App\Models\CommitteeTask;
use App\Models\CommitteeTaskProgress;
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
 * @see CommitteeTaskProgressController
 */
final class CommitteeTaskProgressControllerTest extends TestCase
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
        $committeeTaskProgresses = CommitteeTaskProgress::factory()->count(3)->create();

        $response = $this->get(route('committee-task-progresses.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/task-progresses/index'));

    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('committee-task-progresses.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/task-progresses/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommitteeTaskProgressController::class,
            'store',
            CommitteeTaskProgressStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $committee_task = CommitteeTask::factory()->create();
        $progress_date = Carbon::parse(fake()->dateTime());
        $progress_percentage = fake()->randomFloat(2, 0, 100);
        $description = fake()->text();
        $created_by = Employee::factory()->create();

        $response = $this->post(route('committee-task-progresses.store'), [
            'committee_task_id' => $committee_task->id,
            'progress_date' => $progress_date->toDateTimeString(),
            'progress_percentage' => $progress_percentage,
            'description' => $description,
            'created_by' => $created_by->id,
            'created_by_id' => $created_by->id,
        ]);

        $committeeTaskProgresses = CommitteeTaskProgress::query()
            ->where('committee_task_id', $committee_task->id)
            ->where('progress_date', $progress_date)
            ->where('progress_percentage', $progress_percentage)
            ->where('description', $description)
            ->where('created_by', $created_by->id)
            ->where('created_by_id', $created_by->id)
            ->get();
        $this->assertCount(1, $committeeTaskProgresses);
        $committeeTaskProgress = $committeeTaskProgresses->first();

        $response->assertRedirect(route('committee-task-progresses.index'));
        $response->assertSessionHas('committeeTaskProgress.id', $committeeTaskProgress->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $committeeTaskProgress = CommitteeTaskProgress::factory()->create();

        $response = $this->get(route('committee-task-progresses.show', $committeeTaskProgress));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/task-progresses/show'));

    }

    #[Test]
    public function edit_displays_view(): void
    {
        $committeeTaskProgress = CommitteeTaskProgress::factory()->create();

        $response = $this->get(route('committee-task-progresses.edit', $committeeTaskProgress));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/task-progresses/edit'));

    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommitteeTaskProgressController::class,
            'update',
            CommitteeTaskProgressUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $committeeTaskProgress = CommitteeTaskProgress::factory()->create();
        $committee_task = CommitteeTask::factory()->create();
        $progress_date = Carbon::parse(fake()->dateTime());
        $progress_percentage = fake()->randomFloat(2, 0, 100);
        $description = fake()->text();
        $created_by = Employee::factory()->create();

        $response = $this->put(route('committee-task-progresses.update', $committeeTaskProgress), [
            'committee_task_id' => $committee_task->id,
            'progress_date' => $progress_date->toDateTimeString(),
            'progress_percentage' => $progress_percentage,
            'description' => $description,
            'created_by' => $created_by->id,
            'created_by_id' => $created_by->id,
        ]);

        $committeeTaskProgress->refresh();

        $response->assertRedirect(route('committee-task-progresses.index'));
        $response->assertSessionHas('committeeTaskProgress.id', $committeeTaskProgress->id);

        $this->assertEquals($committee_task->id, $committeeTaskProgress->committee_task_id);
        $this->assertEquals($progress_date, $committeeTaskProgress->progress_date);
        $this->assertEquals($progress_percentage, $committeeTaskProgress->progress_percentage);
        $this->assertEquals($description, $committeeTaskProgress->description);
        $this->assertEquals($created_by->id, $committeeTaskProgress->created_by);
        $this->assertEquals($created_by->id, $committeeTaskProgress->created_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $committeeTaskProgress = CommitteeTaskProgress::factory()->create();

        $response = $this->delete(route('committee-task-progresses.destroy', $committeeTaskProgress));

        $response->assertRedirect(route('committee-task-progresses.index'));

        $this->assertModelMissing($committeeTaskProgress);
    }
}
