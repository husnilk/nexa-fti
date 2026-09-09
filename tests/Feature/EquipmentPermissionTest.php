<?php

use App\Models\Permission;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

beforeEach(function () {
    Permission::findOrCreate('equipment.view', 'web');
    Permission::findOrCreate('equipment.manage', 'web');
});

test('unauthenticated user cannot access equipment models', function () {
    get(route('equipment-models.index'))
        ->assertRedirect(route('login'));
});

test('user without equipment permission cannot access equipment models', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->get(route('equipment-models.index'))
        ->assertForbidden();
});

test('user with equipment permission can access equipment models', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('equipment.view');

    actingAs($user)
        ->get(route('equipment-models.index'))
        ->assertSuccessful();
});

test('user with equipment permission can access equipment list', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('equipment.view');

    actingAs($user)
        ->get(route('equipment.index'))
        ->assertSuccessful();
});

test('user with equipment permission can access maintenance activities', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('equipment.view');

    actingAs($user)
        ->get(route('equipment-maintenance-activities.index'))
        ->assertSuccessful();
});
