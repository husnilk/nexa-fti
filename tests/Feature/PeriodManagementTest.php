<?php

use App\Models\Period;
use App\Models\Permission;
use App\Models\Role;
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

    $this->admin = User::factory()->create();
    $this->admin->assignRole(Role::findOrCreate('super-admin', 'web'));

    $this->guest = User::factory()->create();
});

function periodPayload(array $overrides = []): array
{
    return array_merge([
        'year' => 2026,
        'no' => 1,
        'name' => 'Period 1 2026',
        'description' => 'January to March',
        'start_date' => '2026-01-01',
        'end_date' => '2026-03-31',
        'input_start_date' => '2026-04-01',
        'input_end_date' => '2026-04-07',
        'verification_start_date' => '2026-04-08',
        'verification_end_date' => '2026-04-14',
        'validation_start_date' => '2026-04-15',
        'validation_end_date' => '2026-04-21',
        'attendance' => 1,
        'skp' => 1,
        'skp_format' => 0,
        'calc_method' => 0,
        'performance' => 0,
        'pir' => 3000,
        'show_rupiah' => 0,
        'user_confirmation' => 1,
        'bkd_year' => 2025,
        'bkd_semester' => 'Ganjil',
        'p1_bkd_ref' => 0,
        'p1_bkd_year' => 0,
        'p1_bkd_semester' => 'Genap',
        'p2_bkd_ref' => 0,
        'p2_bkd_year' => 0,
        'p2_bkd_semester' => 'Ganjil',
        'status' => 1,
    ], $overrides);
}

test('user with period.manage can view the period list', function () {
    Period::factory()->count(3)->create();

    actingAs($this->manager)
        ->get(route('periods.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('periods/index')
            ->has('periods', 3)
            ->where('options.skpFormats', [
                ['value' => 0, 'label' => 'Old Format'],
                ['value' => 1, 'label' => 'New Format'],
            ])
            ->where('options.calcMethods', [
                ['value' => 0, 'label' => 'Old calculation method'],
                ['value' => 1, 'label' => 'New calculation method'],
            ])
            ->where('options.bkdSemesters', [
                ['value' => 'Ganjil', 'label' => 'Ganjil'],
                ['value' => 'Genap', 'label' => 'Genap'],
            ])
        );
});

test('super-admin can view the period list', function () {
    actingAs($this->admin)
        ->get(route('periods.index'))
        ->assertOk();
});

test('user without period.manage cannot access periods', function () {
    $period = Period::factory()->create();

    actingAs($this->guest)->get(route('periods.index'))->assertForbidden();
    actingAs($this->guest)->get(route('periods.show', $period))->assertForbidden();
    actingAs($this->guest)->post(route('periods.store'), periodPayload())->assertForbidden();
    actingAs($this->guest)->patch(route('periods.update', $period), periodPayload())->assertForbidden();
    actingAs($this->guest)->patch(route('periods.toggle-status', $period))->assertForbidden();
    actingAs($this->guest)->delete(route('periods.destroy', $period))->assertForbidden();

    expect(Period::count())->toBe(1);
});

test('guests are redirected to login', function () {
    $this->get(route('periods.index'))->assertRedirect(route('login'));
});

test('can create a period', function () {
    actingAs($this->manager)
        ->post(route('periods.store'), periodPayload())
        ->assertRedirect(route('periods.index'));

    $period = Period::sole();

    expect($period->name)->toBe('Period 1 2026')
        ->and($period->year)->toBe(2026)
        ->and($period->start_date->toDateString())->toBe('2026-01-01')
        ->and($period->pir)->toBe(3000.0)
        ->and($period->isActive())->toBeTrue();
});

test('create validates required fields', function () {
    actingAs($this->manager)
        ->post(route('periods.store'), [])
        ->assertSessionHasErrors(['year', 'no', 'name', 'start_date', 'end_date', 'input_start_date', 'pir', 'status']);
});

test('create validates date ordering', function () {
    actingAs($this->manager)
        ->post(route('periods.store'), periodPayload([
            'end_date' => '2025-12-31',
            'input_end_date' => '2026-03-01',
            'validation_start_date' => '2026-04-01',
        ]))
        ->assertSessionHasErrors(['end_date', 'input_end_date', 'validation_start_date']);

    expect(Period::count())->toBe(0);
});

test('create rejects options that are not in the remun config', function () {
    actingAs($this->manager)
        ->post(route('periods.store'), periodPayload([
            'skp_format' => 2,
            'calc_method' => 5,
            'bkd_semester' => 'Pendek',
            'p1_bkd_semester' => '0',
            'p2_bkd_semester' => 'ganjil',
        ]))
        ->assertSessionHasErrors(['skp_format', 'calc_method', 'bkd_semester', 'p1_bkd_semester', 'p2_bkd_semester']);

    expect(Period::count())->toBe(0);
});

test('create accepts the new skp format and calculation method', function () {
    actingAs($this->manager)
        ->post(route('periods.store'), periodPayload([
            'skp_format' => 1,
            'calc_method' => 1,
            'bkd_semester' => 'Genap',
        ]))
        ->assertSessionHasNoErrors();

    expect(Period::sole())
        ->skp_format->toBe(1)
        ->calc_method->toBe(1)
        ->bkd_semester->toBe('Genap');
});

test('period number must be unique within a year', function () {
    Period::factory()->create(['year' => 2026, 'no' => 1]);

    actingAs($this->manager)
        ->post(route('periods.store'), periodPayload(['year' => 2026, 'no' => 1]))
        ->assertSessionHasErrors('no');

    actingAs($this->manager)
        ->post(route('periods.store'), periodPayload(['year' => 2027, 'no' => 1]))
        ->assertSessionHasNoErrors();
});

test('can view period details', function () {
    $period = Period::factory()->create();

    actingAs($this->manager)
        ->get(route('periods.show', $period))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('periods/show')
            ->has('options.skpFormats', 2)
            ->where('period.id', $period->id)
            ->where('period.months_count', 0)
            ->where('period.organizations_count', 0)
        );
});

test('can update a period', function () {
    $period = Period::factory()->create(['year' => 2026, 'no' => 1]);

    actingAs($this->manager)
        ->from(route('periods.show', $period))
        ->patch(route('periods.update', $period), periodPayload([
            'name' => 'Renamed Period',
            'pir' => 3500,
        ]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('periods.show', $period));

    expect($period->fresh())
        ->name->toBe('Renamed Period')
        ->pir->toBe(3500.0);
});

test('can toggle period status', function () {
    $period = Period::factory()->create();

    actingAs($this->manager)
        ->patch(route('periods.toggle-status', $period))
        ->assertRedirect();

    expect($period->fresh()->status)->toBe(Period::STATUS_INACTIVE);

    actingAs($this->manager)
        ->patch(route('periods.toggle-status', $period));

    expect($period->fresh()->status)->toBe(Period::STATUS_ACTIVE);
});

test('can delete a period', function () {
    $period = Period::factory()->create();
    $period->months()->create(['month' => 1, 'workdays' => 20]);

    actingAs($this->manager)
        ->delete(route('periods.destroy', $period))
        ->assertRedirect(route('periods.index'));

    $this->assertDatabaseMissing('periods', ['id' => $period->id]);
    $this->assertDatabaseMissing('period_months', ['period_id' => $period->id]);
});
