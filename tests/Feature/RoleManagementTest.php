<?php

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\PermissionRegistrar;

function userWithRoleManagementAbilities(array $abilities): User
{
    $user = User::factory()->create();

    collect($abilities)
        ->map(fn (string $ability): Permission => Permission::findOrCreate($ability, 'web'))
        ->each(fn (Permission $permission) => $user->givePermissionTo($permission));

    return $user;
}

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
});

test('authorized users can list roles', function () {
    $permission1 = Permission::findOrCreate('posts.create', 'web');
    $permission2 = Permission::findOrCreate('posts.edit', 'web');

    $role1 = Role::findOrCreate('editor', 'web');
    $role1->givePermissionTo($permission1);

    $role2 = Role::findOrCreate('publisher', 'web');
    $role2->givePermissionTo($permission2);

    $user = userWithRoleManagementAbilities(['account.view']);

    $this->actingAs($user)
        ->get(route('roles.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('roles/index')
            ->has('roles', 2)
            ->where('roles.0.name', 'editor')
            ->where('roles.1.name', 'publisher')
            ->has('permissions', 3)
            ->where('permissions.0.name', 'account.view')
            ->where('permissions.1.name', 'posts.create')
            ->where('permissions.2.name', 'posts.edit')
        );
});

test('users without view permission cannot list roles', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('roles.index'))
        ->assertForbidden();
});

test('authorized users can create roles', function () {
    $permission = Permission::findOrCreate('reports.view', 'web');
    $user = userWithRoleManagementAbilities(['account.manage']);

    $this->actingAs($user)
        ->post(route('roles.store'), [
            'name' => 'reporter',
            'permissions' => [$permission->uuid],
        ])
        ->assertRedirect(route('roles.index'));

    $this->assertDatabaseHas('roles', [
        'name' => 'reporter',
    ]);

    $role = Role::findByName('reporter', 'web');
    $this->assertTrue($role->hasPermissionTo('reports.view'));
});

test('role names must be unique', function () {
    Role::findOrCreate('reporter', 'web');
    $user = userWithRoleManagementAbilities(['account.manage']);

    $this->actingAs($user)
        ->from(route('roles.index'))
        ->post(route('roles.store'), [
            'name' => 'reporter',
        ])
        ->assertSessionHasErrors('name')
        ->assertRedirect(route('roles.index'));
});

test('authorized users can update roles', function () {
    $permission1 = Permission::findOrCreate('reports.view', 'web');
    $permission2 = Permission::findOrCreate('reports.export', 'web');
    $role = Role::findOrCreate('reporter', 'web');
    $role->givePermissionTo($permission1);

    $user = userWithRoleManagementAbilities(['account.manage']);

    $this->actingAs($user)
        ->patch(route('roles.update', $role), [
            'name' => 'data-analyst',
            'permissions' => [$permission2->uuid],
        ])
        ->assertRedirect(route('roles.index'));

    $this->assertDatabaseHas('roles', [
        'uuid' => $role->uuid,
        'name' => 'data-analyst',
    ]);

    $role->refresh();
    $this->assertFalse($role->hasPermissionTo('reports.view'));
    $this->assertTrue($role->hasPermissionTo('reports.export'));
});

test('authorized users can delete roles', function () {
    $role = Role::findOrCreate('reporter', 'web');
    $user = userWithRoleManagementAbilities(['account.manage']);

    $this->actingAs($user)
        ->delete(route('roles.destroy', $role))
        ->assertRedirect(route('roles.index'));

    $this->assertDatabaseMissing('roles', [
        'uuid' => $role->uuid,
    ]);
});

test('write actions require their matching role permission', function () {
    $role = Role::findOrCreate('reporter', 'web');
    $user = User::factory()->create();
    $payload = [
        'name' => 'data-analyst',
    ];

    $this->actingAs($user)
        ->post(route('roles.store'), $payload)
        ->assertForbidden();

    $this->actingAs($user)
        ->patch(route('roles.update', $role), $payload)
        ->assertForbidden();

    $this->actingAs($user)
        ->delete(route('roles.destroy', $role))
        ->assertForbidden();
});

test('super admins can manage roles through the gate bypass', function () {
    $user = User::factory()->create();
    Role::findOrCreate('super-admin', 'web');

    $user->assignRole('super-admin');

    $this->actingAs($user)
        ->post(route('roles.store'), [
            'name' => 'auditor',
        ])
        ->assertRedirect(route('roles.index'));

    $this->assertDatabaseHas('roles', [
        'name' => 'auditor',
    ]);
});
