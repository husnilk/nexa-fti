<?php

use App\Models\Period;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Spatie\Permission\PermissionRegistrar;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    Permission::findOrCreate('period.manage', 'web');

    $this->manager = User::factory()->create();
    $this->manager->givePermissionTo('period.manage');

    $this->guest = User::factory()->create();

    $this->period = Period::factory()->create();
});

test('period detail lists its months in calendar order', function () {
    $this->period->months()->create(['month' => 3, 'workdays' => 21]);
    $this->period->months()->create(['month' => 1, 'workdays' => 22]);

    actingAs($this->manager)
        ->get(route('periods.show', $this->period))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('periods/show')
            ->has('period.months', 2)
            ->where('period.months.0.month', 1)
            ->where('period.months.1.month', 3)
        );
});

test('can add a month to a period', function () {
    actingAs($this->manager)
        ->from(route('periods.show', $this->period))
        ->post(route('period-months.store', $this->period), ['month' => 2, 'workdays' => 20])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('periods.show', $this->period));

    expect($this->period->months()->sole())
        ->month->toBe(2)
        ->workdays->toBe(20);
});

test('month and workdays are validated', function () {
    actingAs($this->manager)
        ->post(route('period-months.store', $this->period), ['month' => 13, 'workdays' => 32])
        ->assertSessionHasErrors(['month', 'workdays']);

    actingAs($this->manager)
        ->post(route('period-months.store', $this->period), [])
        ->assertSessionHasErrors(['month', 'workdays']);

    expect($this->period->months()->count())->toBe(0);
});

test('a month can only be added once per period', function () {
    $this->period->months()->create(['month' => 1, 'workdays' => 22]);

    actingAs($this->manager)
        ->post(route('period-months.store', $this->period), ['month' => 1, 'workdays' => 20])
        ->assertSessionHasErrors('month');

    $otherPeriod = Period::factory()->create();

    actingAs($this->manager)
        ->post(route('period-months.store', $otherPeriod), ['month' => 1, 'workdays' => 20])
        ->assertSessionHasNoErrors();
});

test('can update a month', function () {
    $month = $this->period->months()->create(['month' => 1, 'workdays' => 22]);

    actingAs($this->manager)
        ->patch(route('period-months.update', [$this->period, $month]), ['month' => 1, 'workdays' => 19])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect($month->fresh()->workdays)->toBe(19);
});

test('updating a month to one already in the period is rejected', function () {
    $this->period->months()->create(['month' => 1, 'workdays' => 22]);
    $february = $this->period->months()->create(['month' => 2, 'workdays' => 20]);

    actingAs($this->manager)
        ->patch(route('period-months.update', [$this->period, $february]), ['month' => 1, 'workdays' => 20])
        ->assertSessionHasErrors('month');

    expect($february->fresh()->month)->toBe(2);
});

test('can delete a month', function () {
    $month = $this->period->months()->create(['month' => 1, 'workdays' => 22]);

    actingAs($this->manager)
        ->delete(route('period-months.destroy', [$this->period, $month]))
        ->assertRedirect();

    $this->assertDatabaseMissing('period_months', ['id' => $month->id]);
});

test('a month cannot be changed through another period', function () {
    $otherPeriod = Period::factory()->create();
    $month = $otherPeriod->months()->create(['month' => 1, 'workdays' => 22]);

    actingAs($this->manager)
        ->patch(route('period-months.update', [$this->period, $month]), ['month' => 1, 'workdays' => 5])
        ->assertNotFound();

    actingAs($this->manager)
        ->delete(route('period-months.destroy', [$this->period, $month]))
        ->assertNotFound();

    expect($month->fresh()->workdays)->toBe(22);
});

test('user without period.manage cannot manage months', function () {
    $month = $this->period->months()->create(['month' => 1, 'workdays' => 22]);

    actingAs($this->guest)
        ->post(route('period-months.store', $this->period), ['month' => 2, 'workdays' => 20])
        ->assertForbidden();
    actingAs($this->guest)
        ->patch(route('period-months.update', [$this->period, $month]), ['month' => 1, 'workdays' => 5])
        ->assertForbidden();
    actingAs($this->guest)
        ->delete(route('period-months.destroy', [$this->period, $month]))
        ->assertForbidden();

    expect($this->period->months()->count())->toBe(1)
        ->and($month->fresh()->workdays)->toBe(22);
});
