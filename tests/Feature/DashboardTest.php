<?php

use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
});

test('authorized user can view dashboard', function () {
    $user = User::factory()->create();
    $permission = Permission::findOrCreate('dashboard.view');
    $user->givePermissionTo($permission);

    actingAs($user)
        ->get(route('dashboard'))
        ->assertOk();
});

test('unauthorized user cannot view dashboard', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->get(route('dashboard'))
        ->assertForbidden();
});
