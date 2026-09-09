<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\ResearchMemberController;
use App\Http\Requests\ResearchMemberControllerStoreRequest;
use App\Http\Requests\ResearchMemberControllerUpdateRequest;
use App\Models\Research;
use App\Models\ResearchMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see ResearchMemberController
 */
final class ResearchMemberControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $researchMembers = ResearchMember::factory()->count(3)->create();

        $response = $this->get(route('research-members.index'));

        $response->assertOk();
        $response->assertViewIs('researchMember.index');
        $response->assertViewHas('researchMembers', $researchMembers);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('research-members.create'));

        $response->assertOk();
        $response->assertViewIs('researchMember.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            ResearchMemberController::class,
            'store',
            ResearchMemberControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $research = Research::factory()->create();
        $user = User::factory()->create();

        $response = $this->post(route('research-members.store'), [
            'research_id' => $research->id,
            'user_id' => $user->id,
        ]);

        $researchMembers = ResearchMember::query()
            ->where('research_id', $research->id)
            ->where('user_id', $user->id)
            ->get();
        $this->assertCount(1, $researchMembers);
        $researchMember = $researchMembers->first();

        $response->assertRedirect(route('researchMembers.index'));
        $response->assertSessionHas('researchMember.id', $researchMember->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $researchMember = ResearchMember::factory()->create();

        $response = $this->get(route('research-members.show', $researchMember));

        $response->assertOk();
        $response->assertViewIs('researchMember.show');
        $response->assertViewHas('researchMember', $researchMember);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $researchMember = ResearchMember::factory()->create();

        $response = $this->get(route('research-members.edit', $researchMember));

        $response->assertOk();
        $response->assertViewIs('researchMember.edit');
        $response->assertViewHas('researchMember', $researchMember);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            ResearchMemberController::class,
            'update',
            ResearchMemberControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $researchMember = ResearchMember::factory()->create();
        $research = Research::factory()->create();
        $user = User::factory()->create();

        $response = $this->put(route('research-members.update', $researchMember), [
            'research_id' => $research->id,
            'user_id' => $user->id,
        ]);

        $researchMember->refresh();

        $response->assertRedirect(route('researchMembers.index'));
        $response->assertSessionHas('researchMember.id', $researchMember->id);

        $this->assertEquals($research->id, $researchMember->research_id);
        $this->assertEquals($user->id, $researchMember->user_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $researchMember = ResearchMember::factory()->create();

        $response = $this->delete(route('research-members.destroy', $researchMember));

        $response->assertRedirect(route('researchMembers.index'));

        $this->assertModelMissing($researchMember);
    }
}
