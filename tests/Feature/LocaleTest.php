<?php

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Route;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    config(['app.locale' => 'id']);

    Route::middleware('web')->get('/_locale-probe', fn () => App::getLocale());
});

test('bahasa indonesia is the default locale', function () {
    $this->get('/_locale-probe')->assertSeeText('id');

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('locale', 'id')
            ->where('locales', ['id' => 'Bahasa Indonesia', 'en' => 'English'])
        );
});

test('the locale cookie selects english', function () {
    $this->withUnencryptedCookie('locale', 'en')
        ->get('/_locale-probe')
        ->assertSeeText('en');
});

test('an unknown locale cookie falls back to the default', function () {
    $this->withUnencryptedCookie('locale', 'fr')
        ->get('/_locale-probe')
        ->assertSeeText('id');
});

test('switching language stores the cookie and goes back', function () {
    $this->from(route('home'))
        ->get(route('locale.update', 'en'))
        ->assertRedirect(route('home'))
        ->assertCookie('locale', 'en', encrypted: false);
});

test('switching to an unsupported language is not found', function () {
    $this->get(route('locale.update', 'fr'))->assertNotFound();
});

test('translations resolve from the json dictionary', function () {
    App::setLocale('id');
    expect(__('Language'))->toBe('Bahasa');

    App::setLocale('en');
    expect(__('Language'))->toBe('Language');
});
