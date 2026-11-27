<?php

use App\Models\User;

test('root page redirects guests to the login page', function () {
    $this->get(route('home'))->assertRedirect(route('login'));
});

test('root page redirects authenticated users to the dashboard', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('home'))
        ->assertRedirect(route('dashboard'));
});
