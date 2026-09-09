<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\CommitteeProgressController;
use App\Http\Requests\CommitteeProgressStoreRequest;
use App\Http\Requests\CommitteeProgressUpdateRequest;
use App\Models\Committee;
use App\Models\CommitteeProgress;
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
 * @see CommitteeProgressController
 */
final class CommitteeProgressControllerTest extends TestCase
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
        $committeeProgresses = CommitteeProgress::factory()->count(3)->create();

        $response = $this->get(route('committee-progresses.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/progresses/index'));

    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('committee-progresses.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/progresses/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommitteeProgressController::class,
            'store',
            CommitteeProgressStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $committee = Committee::factory()->create();
        $progress_date = Carbon::parse(fake()->date());
        $progress_percentage = fake()->randomFloat(2, 0, 100);
        $summary = fake()->text();
        $reported_by = Employee::factory()->create();

        $response = $this->post(route('committee-progresses.store'), [
            'committee_id' => $committee->id,
            'progress_date' => $progress_date->toDateString(),
            'progress_percentage' => $progress_percentage,
            'summary' => $summary,
            'reported_by' => $reported_by->id,
            'reported_by_id' => $reported_by->id,
        ]);

        $committeeProgresses = CommitteeProgress::query()
            ->where('committee_id', $committee->id)
            ->where('progress_date', $progress_date)
            ->where('progress_percentage', $progress_percentage)
            ->where('summary', $summary)
            ->where('reported_by', $reported_by->id)
            ->where('reported_by_id', $reported_by->id)
            ->get();
        $this->assertCount(1, $committeeProgresses);
        $committeeProgress = $committeeProgresses->first();

        $response->assertRedirect(route('committee-progresses.index'));
        $response->assertSessionHas('committeeProgress.id', $committeeProgress->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $committeeProgress = CommitteeProgress::factory()->create();

        $response = $this->get(route('committee-progresses.show', $committeeProgress));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/progresses/show'));

    }

    #[Test]
    public function edit_displays_view(): void
    {
        $committeeProgress = CommitteeProgress::factory()->create();

        $response = $this->get(route('committee-progresses.edit', $committeeProgress));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/progresses/edit'));

    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommitteeProgressController::class,
            'update',
            CommitteeProgressUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $committeeProgress = CommitteeProgress::factory()->create();
        $committee = Committee::factory()->create();
        $progress_date = Carbon::parse(fake()->date());
        $progress_percentage = fake()->randomFloat(2, 0, 100);
        $summary = fake()->text();
        $reported_by = Employee::factory()->create();

        $response = $this->put(route('committee-progresses.update', $committeeProgress), [
            'committee_id' => $committee->id,
            'progress_date' => $progress_date->toDateString(),
            'progress_percentage' => $progress_percentage,
            'summary' => $summary,
            'reported_by' => $reported_by->id,
            'reported_by_id' => $reported_by->id,
        ]);

        $committeeProgress->refresh();

        $response->assertRedirect(route('committee-progresses.index'));
        $response->assertSessionHas('committeeProgress.id', $committeeProgress->id);

        $this->assertEquals($committee->id, $committeeProgress->committee_id);
        $this->assertEquals($progress_date, $committeeProgress->progress_date);
        $this->assertEquals($progress_percentage, $committeeProgress->progress_percentage);
        $this->assertEquals($summary, $committeeProgress->summary);
        $this->assertEquals($reported_by->id, $committeeProgress->reported_by);
        $this->assertEquals($reported_by->id, $committeeProgress->reported_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $committeeProgress = CommitteeProgress::factory()->create();

        $response = $this->delete(route('committee-progresses.destroy', $committeeProgress));

        $response->assertRedirect(route('committee-progresses.index'));

        $this->assertModelMissing($committeeProgress);
    }
}
