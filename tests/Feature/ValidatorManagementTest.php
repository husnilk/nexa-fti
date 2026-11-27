<?php

use App\Models\Employee;
use App\Models\Organization;
use App\Models\Period;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Models\Validator;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\PermissionRegistrar;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    Permission::findOrCreate('validator.manage', 'web');

    $this->manager = User::factory()->create();
    $this->manager->givePermissionTo('validator.manage');

    $this->admin = User::factory()->create();
    $this->admin->assignRole(Role::findOrCreate('super-admin', 'web'));

    $this->guest = User::factory()->create();

    $this->oldPeriod = Period::factory()->create(['year' => 2025]);
    $this->period = Period::factory()->create(['year' => 2026]);
    $this->organization = Organization::factory()->create(['name' => 'Departemen Sistem Informasi']);
    $this->employee = Employee::factory()->create(['name' => 'Ratna Sari']);
});

function validatorPayload(array $overrides = []): array
{
    return array_merge([
        'employee_id' => test()->employee->id,
        'organization_id' => test()->organization->id,
        'position' => Validator::POSITION_CHAIR,
        'is_active' => true,
    ], $overrides);
}

it('keeps only one period active', function () {
    expect($this->period->fresh()->isActive())->toBeTrue()
        ->and($this->oldPeriod->fresh()->isActive())->toBeFalse()
        ->and(Period::active()->id)->toBe($this->period->id);

    actingAs($this->admin)->patch(route('periods.toggle-status', $this->oldPeriod));

    expect($this->oldPeriod->fresh()->isActive())->toBeTrue()
        ->and($this->period->fresh()->isActive())->toBeFalse();
});

it('restricts the module to validator managers', function (string $user, int $status) {
    $validator = Validator::factory()->create(['period_id' => $this->period->id]);

    actingAs($this->{$user})->get(route('validators.index'))->assertStatus($status);
    actingAs($this->{$user})->post(route('validators.store'), validatorPayload())->assertStatus($status === 200 ? 302 : 403);
    actingAs($this->{$user})->put(route('validators.update', $validator), validatorPayload())->assertStatus($status === 200 ? 302 : 403);
    actingAs($this->{$user})->delete(route('validators.destroy', $validator))->assertStatus($status === 200 ? 302 : 403);
})->with([
    'manager' => ['manager', 200],
    'super-admin' => ['admin', 200],
    'no permission' => ['guest', 403],
]);

it('lists only validators of the active period', function () {
    Validator::factory()->create(['period_id' => $this->period->id, 'employee_id' => $this->employee->id]);
    Validator::factory()->create(['period_id' => $this->oldPeriod->id]);

    actingAs($this->manager)
        ->get(route('validators.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('validators/index')
            ->where('activePeriod.id', $this->period->id)
            ->has('validators.data', 1)
            ->where('validators.data.0.employee.name', 'Ratna Sari'));
});

it('adds a validator to the active period without a period input', function () {
    actingAs($this->manager)
        ->from(route('validators.index'))
        ->post(route('validators.store'), validatorPayload(['period_id' => $this->oldPeriod->id]))
        ->assertRedirect(route('validators.index'))
        ->assertSessionHasNoErrors();

    expect(Validator::sole())
        ->period_id->toBe($this->period->id)
        ->employee_id->toBe($this->employee->id)
        ->position->toBe(Validator::POSITION_CHAIR)
        ->is_active->toBeTrue();
});

it('refuses to add a validator when no period is active', function () {
    Period::query()->update(['status' => Period::STATUS_INACTIVE]);

    actingAs($this->manager)
        ->get(route('validators.index'))
        ->assertInertia(fn (Assert $page) => $page->where('activePeriod', null)->has('validators.data', 0));

    actingAs($this->manager)
        ->post(route('validators.store'), validatorPayload())
        ->assertSessionHasErrors('period');

    expect(Validator::count())->toBe(0);
});

it('updates a validator', function () {
    $validator = Validator::factory()->create([
        'period_id' => $this->period->id,
        'employee_id' => $this->employee->id,
        'organization_id' => $this->organization->id,
    ]);

    actingAs($this->manager)
        ->put(route('validators.update', $validator), validatorPayload([
            'position' => Validator::POSITION_MEMBER,
            'is_active' => false,
        ]))
        ->assertSessionHasNoErrors();

    expect($validator->fresh())
        ->position->toBe(Validator::POSITION_MEMBER)
        ->is_active->toBeFalse()
        ->period_id->toBe($this->period->id);
});

it('removes a validator', function () {
    $validator = Validator::factory()->create(['period_id' => $this->period->id]);

    actingAs($this->manager)->delete(route('validators.destroy', $validator))->assertRedirect();

    expect(Validator::count())->toBe(0);
});

it('rejects duplicates in the same period and organization', function () {
    Validator::factory()->create([
        'period_id' => $this->period->id,
        'employee_id' => $this->employee->id,
        'organization_id' => $this->organization->id,
    ]);

    actingAs($this->manager)
        ->post(route('validators.store'), validatorPayload())
        ->assertSessionHasErrors('employee_id');

    // Same employee for another organization is fine.
    actingAs($this->manager)
        ->post(route('validators.store'), validatorPayload(['organization_id' => Organization::factory()->create()->id]))
        ->assertSessionHasNoErrors();

    // Faculty-wide (no organization) duplicates are caught too.
    actingAs($this->manager)->post(route('validators.store'), validatorPayload(['organization_id' => null]));
    actingAs($this->manager)
        ->post(route('validators.store'), validatorPayload(['organization_id' => null]))
        ->assertSessionHasErrors('employee_id');

    expect(Validator::count())->toBe(3);
});

it('validates the input', function () {
    actingAs($this->manager)
        ->post(route('validators.store'), validatorPayload(['employee_id' => null, 'position' => 9]))
        ->assertSessionHasErrors(['employee_id', 'position']);
});

it('searches by employee name, number and organization', function () {
    Validator::factory()->create([
        'period_id' => $this->period->id,
        'employee_id' => $this->employee->id,
        'organization_id' => $this->organization->id,
    ]);
    Validator::factory()->create(['period_id' => $this->period->id]);

    foreach (['Ratna', $this->employee->emp_number, 'Sistem Informasi'] as $term) {
        actingAs($this->manager)
            ->get(route('validators.index', ['search' => $term]))
            ->assertInertia(fn (Assert $page) => $page
                ->has('validators.data', 1)
                ->where('validators.data.0.employee_id', $this->employee->id));
    }

    actingAs($this->manager)
        ->get(route('validators.index', ['organization_id' => $this->organization->id]))
        ->assertInertia(fn (Assert $page) => $page->has('validators.data', 1));
});
