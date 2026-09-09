<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\CommitteeMemberController;
use App\Http\Requests\CommitteeMemberStoreRequest;
use App\Http\Requests\CommitteeMemberUpdateRequest;
use App\Models\CommitteeMember;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see CommitteeMemberController
 */
final class CommitteeMemberControllerTest extends TestCase
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
        $committeeMembers = CommitteeMember::factory()->count(3)->create();

        $response = $this->get(route('committee-members.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/members/index'));

    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('committee-members.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/members/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommitteeMemberController::class,
            'store',
            CommitteeMemberStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $role = fake()->word();
        $is_leader = fake()->boolean();
        $supervisor_id = CommitteeMember::factory()->create();

        $response = $this->post(route('committee-members.store'), [
            'role' => $role,
            'is_leader' => $is_leader,
            'supervisor_id_id' => $supervisor_id->id,
        ]);

        $committeeMembers = CommitteeMember::query()
            ->where('role', $role)
            ->where('is_leader', $is_leader)
            ->where('supervisor_id_id', $supervisor_id->id)
            ->get();
        $this->assertCount(1, $committeeMembers);
        $committeeMember = $committeeMembers->first();

        $response->assertRedirect(route('committee-members.index'));
        $response->assertSessionHas('committeeMember.id', $committeeMember->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $committeeMember = CommitteeMember::factory()->create();

        $response = $this->get(route('committee-members.show', $committeeMember));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/members/show'));

    }

    #[Test]
    public function edit_displays_view(): void
    {
        $committeeMember = CommitteeMember::factory()->create();

        $response = $this->get(route('committee-members.edit', $committeeMember));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/members/edit'));

    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommitteeMemberController::class,
            'update',
            CommitteeMemberUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $committeeMember = CommitteeMember::factory()->create();
        $role = fake()->word();
        $is_leader = fake()->boolean();
        $supervisor_id = CommitteeMember::factory()->create();

        $response = $this->put(route('committee-members.update', $committeeMember), [
            'role' => $role,
            'is_leader' => $is_leader,
            'supervisor_id_id' => $supervisor_id->id,
        ]);

        $committeeMember->refresh();

        $response->assertRedirect(route('committee-members.index'));
        $response->assertSessionHas('committeeMember.id', $committeeMember->id);

        $this->assertEquals($role, $committeeMember->role);
        $this->assertEquals($is_leader, $committeeMember->is_leader);
        $this->assertEquals($supervisor_id->id, $committeeMember->supervisor_id_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $committeeMember = CommitteeMember::factory()->create();

        $response = $this->delete(route('committee-members.destroy', $committeeMember));

        $response->assertRedirect(route('committee-members.index'));

        $this->assertModelMissing($committeeMember);
    }
}
