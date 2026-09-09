<?php

use App\Models\Permission;
use App\Models\Research;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    $this->user = User::factory()->create();

    // Create research permissions
    Permission::findOrCreate('research.view', 'web');
    Permission::findOrCreate('research.manage', 'web');
    Permission::findOrCreate('research.manage', 'web');
    Permission::findOrCreate('research.manage', 'web');
});

test('user without research permission cannot view research index', function () {
    $this->actingAs($this->user)
        ->get(route('research.index'))
        ->assertForbidden();
});

test('user with research permission can view research index', function () {
    $this->user->givePermissionTo('research.view');

    $this->actingAs($this->user)
        ->get(route('research.index'))
        ->assertSuccessful();
});

test('user can create research', function () {
    $this->user->givePermissionTo('research.manage');

    $this->actingAs($this->user)
        ->postJson(route('research.store'), [
            'title' => 'New Research Project',
            'start_date' => now()->toDateString(),
            'status' => 'proposed',
        ])
        ->assertRedirect(route('research.index'));

    $this->assertDatabaseHas('research', [
        'title' => 'New Research Project',
    ]);
});

test('user can add member to research', function () {
    $this->user->givePermissionTo('research.manage');
    $research = Research::factory()->create();
    $memberUser = User::factory()->create();

    $this->actingAs($this->user)
        ->postJson(route('research-members.store'), [
            'research_id' => $research->id,
            'user_id' => $memberUser->id,
            'role' => 'Researcher',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('research_members', [
        'research_id' => $research->id,
        'user_id' => $memberUser->id,
        'role' => 'Researcher',
    ]);
});
