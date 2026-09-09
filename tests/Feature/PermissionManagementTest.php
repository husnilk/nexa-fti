<?php

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\PermissionRegistrar;

function userWithPermissionManagementAbilities(array $abilities): User
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

test('authorized users can list permissions', function () {
    Permission::findOrCreate('posts.create', 'web');

    $user = userWithPermissionManagementAbilities(['account.view']);

    $this->actingAs($user)
        ->get(route('permissions.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('permissions/index')
            ->has('permissions', 2)
            ->where('permissions.0.name', 'account.view')
            ->where('permissions.1.name', 'posts.create'),
        );
});

test('users without view permission cannot list permissions', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('permissions.index'))
        ->assertForbidden();
});

test('authorized users can create permissions', function () {
    $user = userWithPermissionManagementAbilities(['account.manage']);

    $this->actingAs($user)
        ->post(route('permissions.store'), [
            'name' => 'reports.view',
            'guard_name' => 'web',
        ])
        ->assertRedirect(route('permissions.index'));

    $this->assertDatabaseHas('permissions', [
        'name' => 'reports.view',
        'guard_name' => 'web',
    ]);
});

test('permission names must be unique per guard', function () {
    Permission::findOrCreate('reports.view', 'web');
    $user = userWithPermissionManagementAbilities(['account.manage']);

    $this->actingAs($user)
        ->from(route('permissions.index'))
        ->post(route('permissions.store'), [
            'name' => 'reports.view',
            'guard_name' => 'web',
        ])
        ->assertSessionHasErrors('name')
        ->assertRedirect(route('permissions.index'));
});

test('authorized users can update permissions', function () {
    $permission = Permission::findOrCreate('reports.view', 'web');
    $user = userWithPermissionManagementAbilities(['account.manage']);

    $this->actingAs($user)
        ->patch(route('permissions.update', $permission), [
            'name' => 'reports.export',
            'guard_name' => 'web',
        ])
        ->assertRedirect(route('permissions.index'));

    $this->assertDatabaseHas('permissions', [
        'uuid' => $permission->uuid,
        'name' => 'reports.export',
        'guard_name' => 'web',
    ]);
});

test('authorized users can delete permissions', function () {
    $permission = Permission::findOrCreate('reports.view', 'web');
    $user = userWithPermissionManagementAbilities(['account.manage']);

    $this->actingAs($user)
        ->delete(route('permissions.destroy', $permission))
        ->assertRedirect(route('permissions.index'));

    $this->assertDatabaseMissing('permissions', [
        'uuid' => $permission->uuid,
    ]);
});

test('write actions require their matching permission', function (string $method, string $routeName, string $permission) {
    $targetPermission = Permission::findOrCreate('reports.view', 'web');
    $user = User::factory()->create();
    $payload = [
        'name' => 'reports.export',
        'guard_name' => 'web',
    ];

    $this->actingAs($user)
        ->{$method}(route($routeName, $routeName === 'permissions.store' ? [] : $targetPermission), $payload)
        ->assertForbidden();
})->with([
    'create' => ['post', 'permissions.store', 'account.manage'],
    'update' => ['patch', 'permissions.update', 'account.manage'],
    'delete' => ['delete', 'permissions.destroy', 'account.manage'],
]);

test('super admins can manage permissions through the gate bypass', function () {
    $user = User::factory()->create();
    Role::findOrCreate('super-admin', 'web');

    $user->assignRole('super-admin');

    $this->actingAs($user)
        ->post(route('permissions.store'), [
            'name' => 'reports.view',
            'guard_name' => 'web',
        ])
        ->assertRedirect(route('permissions.index'));

    $this->assertDatabaseHas('permissions', [
        'name' => 'reports.view',
        'guard_name' => 'web',
    ]);
});
