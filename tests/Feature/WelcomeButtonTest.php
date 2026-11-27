<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    if (! Role::where('name', 'super-admin')->exists()) {
        Role::create([
            'uuid' => (string) str()->uuid(),
            'name' => 'super-admin',
            'guard_name' => 'web',
        ]);
    }
});

test('login-admin works with full middleware', function () {
    Config::set('app.debug', true);

    $user = User::factory()->create();
    $user->assignRole('super-admin');

    $response = $this->post('/login-admin');

    $response->assertRedirect(route('dashboard'));
    $this->assertAuthenticatedAs($user);
});

test('login-admin as inertia request works', function () {
    Config::set('app.debug', true);

    $user = User::factory()->create();
    $user->assignRole('super-admin');

    $response = $this->post('/login-admin', [], [
        'X-Inertia' => 'true',
    ]);

    $response->assertRedirect(route('dashboard'));
    $this->assertAuthenticatedAs($user);

    $dashboardResponse = $this->get(route('dashboard'));
    $dashboardResponse->assertSuccessful();
});

test('login-admin redirects to dashboard even if url.intended is root', function () {
    Config::set('app.debug', true);

    $user = User::factory()->create();
    $user->assignRole('super-admin');

    $this->withSession(['url.intended' => '/']);

    $response = $this->post('/login-admin');

    $response->assertRedirect(route('dashboard'));
    $this->assertAuthenticatedAs($user);
});

test('login-admin assigns super-admin role to first user if no super-admin exists', function () {
    Config::set('app.debug', true);

    $user = User::factory()->create();

    $response = $this->post('/login-admin');

    $response->assertRedirect(route('dashboard'));
    $this->assertAuthenticatedAs($user);
    expect($user->fresh()->hasRole('super-admin'))->toBeTrue();
});

test('login-as user automatically gains dashboard access and redirects to dashboard', function () {
    Config::set('app.debug', true);

    $user = User::factory()->create();

    $this->withSession(['url.intended' => '/']);

    $response = $this->post(route('login-as', ['user' => $user->id]), [], [
        'X-Inertia' => 'true',
    ]);

    $response->assertRedirect(route('dashboard'));
    $this->assertAuthenticatedAs($user);

    $dashboardResponse = $this->get(route('dashboard'));
    $dashboardResponse->assertSuccessful();
});
