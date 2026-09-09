<?php

use App\Models\CommunityService;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    $this->user = User::factory()->create();

    Permission::findOrCreate('community_service.view', 'web');
    Permission::findOrCreate('community_service.manage', 'web');
    Permission::findOrCreate('community_service.manage', 'web');
    Permission::findOrCreate('community_service.manage', 'web');
});

test('user without community_service permission cannot view community service index', function () {
    $this->actingAs($this->user)
        ->get(route('community-services.index'))
        ->assertForbidden();
});

test('user with community_service permission can view community service index', function () {
    $this->user->givePermissionTo('community_service.view');

    $this->actingAs($this->user)
        ->get(route('community-services.index'))
        ->assertSuccessful();
});

test('user can create community service', function () {
    $this->user->givePermissionTo('community_service.manage');

    $this->actingAs($this->user)
        ->postJson(route('community-services.store'), [
            'title' => 'New Community Service Project',
            'location' => 'City Center',
            'start_date' => now()->toDateString(),
            'status' => 'proposed',
        ])
        ->assertRedirect(route('community-services.index'));

    $this->assertDatabaseHas('community_services', [
        'title' => 'New Community Service Project',
        'location' => 'City Center',
    ]);
});

test('user can add member to community service', function () {
    $this->user->givePermissionTo('community_service.manage');
    $service = CommunityService::factory()->create();
    $memberUser = User::factory()->create();

    $this->actingAs($this->user)
        ->postJson(route('community-service-members.store'), [
            'community_service_id' => $service->id,
            'user_id' => $memberUser->id,
            'role' => 'Volunteer',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('community_service_members', [
        'community_service_id' => $service->id,
        'user_id' => $memberUser->id,
        'role' => 'Volunteer',
    ]);
});
