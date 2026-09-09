<?php

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\PermissionRegistrar;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    $this->userView = Permission::findOrCreate('account.view');
    $this->userCreate = Permission::findOrCreate('account.manage');
    $this->userUpdate = Permission::findOrCreate('account.manage');
    $this->userDelete = Permission::findOrCreate('account.manage');

    $this->admin = User::factory()->create();
    $this->admin->givePermissionTo([$this->userView, $this->userCreate, $this->userUpdate, $this->userDelete]);
});

test('authorized user can view user list', function () {
    actingAs($this->admin)
        ->get(route('users.index'))
        ->assertOk();
});

test('unauthorized user cannot view user list', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->get(route('users.index'))
        ->assertForbidden();
});

test('authorized user can create user', function () {
    $role1 = Role::create(['name' => 'editor', 'guard_name' => 'web']);

    actingAs($this->admin)
        ->postJson(route('users.store'), [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'is_active' => true,
            'roles' => ['editor'],
        ])
        ->assertRedirect(route('users.index'));

    $this->assertDatabaseHas('users', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
    ]);

    $user = User::where('email', 'john@example.com')->first();
    $this->assertTrue($user->hasRole('editor'));
});

test('authorized user can update user', function () {
    $user = User::factory()->create();
    $role1 = Role::create(['name' => 'viewer', 'guard_name' => 'web']);

    actingAs($this->admin)
        ->patchJson(route('users.update', $user), [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'is_active' => false,
            'roles' => ['viewer'],
        ])
        ->assertRedirect(route('users.index'));

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Jane Doe',
        'is_active' => 0,
    ]);

    $user->refresh();
    $this->assertTrue($user->hasRole('viewer'));
});

test('authorized user can toggle user status', function () {
    $user = User::factory()->create(['is_active' => true]);

    actingAs($this->admin)
        ->patch(route('users.toggle-status', $user))
        ->assertRedirect();

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'is_active' => 0,
    ]);
});

test('authorized user can delete user', function () {
    $user = User::factory()->create();

    actingAs($this->admin)
        ->delete(route('users.destroy', $user))
        ->assertRedirect(route('users.index'));

    $this->assertDatabaseMissing('users', [
        'id' => $user->id,
    ]);
});

test('inactive user cannot login', function () {
    $user = User::factory()->create([
        'email' => 'inactive@example.com',
        'password' => Hash::make('password123'),
        'is_active' => false,
    ]);

    $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password123',
    ])->assertSessionHasErrors(['email']);
});

test('authorized user can search users', function () {
    User::factory()->create(['name' => 'Searchable User', 'email' => 'search@example.com']);
    User::factory()->create(['name' => 'Other User', 'email' => 'other@example.com']);

    actingAs($this->admin)
        ->get(route('users.index', ['search' => 'Searchable']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('users', 1)
            ->where('users.0.name', 'Searchable User')
        );
});
