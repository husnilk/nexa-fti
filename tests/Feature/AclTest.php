<?php

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
});

test('super admin has all permissions through gate', function () {
    $user = User::factory()->create();
    $user->assignRole(Role::findOrCreate('super-admin'));

    $permission = Permission::findOrCreate('dashboard.view');

    $this->assertTrue($user->can('dashboard.view'));
    $this->assertTrue($user->can('non-existent-permission'));
});
