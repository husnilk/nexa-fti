<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\CommunityServiceMemberController;
use App\Http\Requests\CommunityServiceMemberControllerStoreRequest;
use App\Http\Requests\CommunityServiceMemberControllerUpdateRequest;
use App\Models\CommunityService;
use App\Models\CommunityServiceMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see CommunityServiceMemberController
 */
final class CommunityServiceMemberControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $communityServiceMembers = CommunityServiceMember::factory()->count(3)->create();

        $response = $this->get(route('community-service-members.index'));

        $response->assertOk();
        $response->assertViewIs('communityServiceMember.index');
        $response->assertViewHas('communityServiceMembers', $communityServiceMembers);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('community-service-members.create'));

        $response->assertOk();
        $response->assertViewIs('communityServiceMember.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommunityServiceMemberController::class,
            'store',
            CommunityServiceMemberControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $community_service = CommunityService::factory()->create();
        $user = User::factory()->create();

        $response = $this->post(route('community-service-members.store'), [
            'community_service_id' => $community_service->id,
            'user_id' => $user->id,
        ]);

        $communityServiceMembers = CommunityServiceMember::query()
            ->where('community_service_id', $community_service->id)
            ->where('user_id', $user->id)
            ->get();
        $this->assertCount(1, $communityServiceMembers);
        $communityServiceMember = $communityServiceMembers->first();

        $response->assertRedirect(route('communityServiceMembers.index'));
        $response->assertSessionHas('communityServiceMember.id', $communityServiceMember->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $communityServiceMember = CommunityServiceMember::factory()->create();

        $response = $this->get(route('community-service-members.show', $communityServiceMember));

        $response->assertOk();
        $response->assertViewIs('communityServiceMember.show');
        $response->assertViewHas('communityServiceMember', $communityServiceMember);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $communityServiceMember = CommunityServiceMember::factory()->create();

        $response = $this->get(route('community-service-members.edit', $communityServiceMember));

        $response->assertOk();
        $response->assertViewIs('communityServiceMember.edit');
        $response->assertViewHas('communityServiceMember', $communityServiceMember);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommunityServiceMemberController::class,
            'update',
            CommunityServiceMemberControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $communityServiceMember = CommunityServiceMember::factory()->create();
        $community_service = CommunityService::factory()->create();
        $user = User::factory()->create();

        $response = $this->put(route('community-service-members.update', $communityServiceMember), [
            'community_service_id' => $community_service->id,
            'user_id' => $user->id,
        ]);

        $communityServiceMember->refresh();

        $response->assertRedirect(route('communityServiceMembers.index'));
        $response->assertSessionHas('communityServiceMember.id', $communityServiceMember->id);

        $this->assertEquals($community_service->id, $communityServiceMember->community_service_id);
        $this->assertEquals($user->id, $communityServiceMember->user_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $communityServiceMember = CommunityServiceMember::factory()->create();

        $response = $this->delete(route('community-service-members.destroy', $communityServiceMember));

        $response->assertRedirect(route('communityServiceMembers.index'));

        $this->assertModelMissing($communityServiceMember);
    }
}
