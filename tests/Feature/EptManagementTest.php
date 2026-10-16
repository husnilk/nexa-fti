<?php

use App\Models\Employee;
use App\Models\Ept;
use App\Models\Period;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\PermissionRegistrar;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    Permission::findOrCreate('ept.view', 'web');
    Permission::findOrCreate('ept.manage', 'web');

    $this->manager = User::factory()->create();
    $this->manager->givePermissionTo('ept.manage');

    $this->viewer = User::factory()->create();
    $this->viewer->givePermissionTo('ept.view');

    $this->admin = User::factory()->create();
    $this->admin->assignRole(Role::findOrCreate('super-admin', 'web'));

    $this->guest = User::factory()->create();

    $this->period = Period::factory()->create();
    $this->employee = Employee::factory()->create();
    $this->appraiser = Employee::factory()->create();
});

function eptPayload(array $overrides = []): array
{
    return array_merge([
        'employee_id' => test()->employee->id,
        'period_id' => test()->period->id,
        'year' => 2026,
        'start' => 1,
        'end' => 6,
        'start_date' => '2026-01-01',
        'end_date' => '2026-06-30',
        'appraiser_officer_id' => test()->appraiser->id,
        'orientation' => 85,
        'integrity' => 90,
        'commitment' => 88,
        'discipline' => 80,
        'teamwork' => 86,
        'leadership' => 75,
        'skp_achievement' => 92.5,
        'work_result_rating' => 2,
        'behavior_rating' => 3,
        'performance_predicate' => 4,
        'points' => 40,
        'status' => Ept::STATUS_DRAFT,
    ], $overrides);
}

it('lets viewers and managers see the list and details', function (string $user) {
    $ept = Ept::factory()->create([
        'employee_id' => $this->employee->id,
        'period_id' => $this->period->id,
        'appraiser_officer_id' => $this->appraiser->id,
    ]);

    actingAs($this->{$user})
        ->get(route('epts.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('epts/index')
            ->has('epts.data', 1)
            ->where('epts.data.0.appraiser.id', $this->appraiser->id)
            ->has('employees')
            ->has('periods', 1));

    actingAs($this->{$user})
        ->get(route('epts.show', $ept))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('epts/show')
            ->where('ept.employee.id', $this->employee->id));
})->with(['viewer', 'manager', 'admin']);

it('forbids users without ept permissions', function () {
    $ept = Ept::factory()->create();

    actingAs($this->guest)->get(route('epts.index'))->assertForbidden();
    actingAs($this->guest)->get(route('epts.show', $ept))->assertForbidden();
});

it('prevents viewers from changing epts', function () {
    $ept = Ept::factory()->create();

    actingAs($this->viewer)->post(route('epts.store'), eptPayload())->assertForbidden();
    actingAs($this->viewer)->put(route('epts.update', $ept), eptPayload())->assertForbidden();
    actingAs($this->viewer)->delete(route('epts.destroy', $ept))->assertForbidden();

    expect(Ept::count())->toBe(1);
});

it('lets managers create an ept from the list modal', function () {
    actingAs($this->manager)
        ->from(route('epts.index'))
        ->post(route('epts.store'), eptPayload())
        ->assertRedirect(route('epts.index'))
        ->assertSessionHasNoErrors();

    $ept = Ept::sole();

    expect($ept->employee_id)->toBe($this->employee->id)
        ->and($ept->appraiser_officer_id)->toBe($this->appraiser->id)
        ->and($ept->skp_achievement)->toBe(92.5)
        ->and($ept->performance_predicate)->toBe(4)
        ->and($ept->created_by)->toBe($this->manager->id)
        ->and($ept->updated_by)->toBe($this->manager->id);
});

it('lets managers update an ept and keeps the list filters', function () {
    $ept = Ept::factory()->create([
        'employee_id' => $this->employee->id,
        'period_id' => $this->period->id,
    ]);
    $listUrl = route('epts.index', ['period_id' => $this->period->id]);

    actingAs($this->manager)
        ->from($listUrl)
        ->put(route('epts.update', $ept), eptPayload(['status' => Ept::STATUS_SUBMITTED, 'points' => 55]))
        ->assertRedirect($listUrl);

    expect($ept->fresh())
        ->status->toBe(Ept::STATUS_SUBMITTED)
        ->points->toBe(55)
        ->updated_by->toBe($this->manager->id);
});

it('lets managers delete an ept', function () {
    $ept = Ept::factory()->create();

    actingAs($this->manager)
        ->delete(route('epts.destroy', $ept))
        ->assertRedirect(route('epts.index'));

    expect(Ept::count())->toBe(0);
});

it('validates the ept input', function () {
    actingAs($this->manager)
        ->post(route('epts.store'), eptPayload([
            'period_id' => null,
            'appraiser_officer_id' => test()->employee->id,
            'start' => 6,
            'end' => 3,
            'integrity' => 120,
            'performance_predicate' => 6,
            'status' => 9,
        ]))
        ->assertSessionHasErrors([
            'period_id', 'appraiser_officer_id', 'end', 'integrity', 'performance_predicate', 'status',
        ]);

    expect(Ept::count())->toBe(0);
});

it('filters the list by period, status and employee name', function () {
    $named = Employee::factory()->create(['name' => 'Ratna Sari']);

    Ept::factory()->create([
        'employee_id' => $named->id,
        'period_id' => $this->period->id,
        'status' => Ept::STATUS_VERIFIED,
    ]);
    Ept::factory()->create(['status' => Ept::STATUS_DRAFT]);

    actingAs($this->viewer)
        ->get(route('epts.index', ['period_id' => $this->period->id]))
        ->assertInertia(fn (Assert $page) => $page->has('epts.data', 1));

    actingAs($this->viewer)
        ->get(route('epts.index', ['status' => Ept::STATUS_DRAFT]))
        ->assertInertia(fn (Assert $page) => $page->has('epts.data', 1));

    actingAs($this->viewer)
        ->get(route('epts.index', ['search' => 'Ratna']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('epts.data', 1)
            ->where('epts.data.0.employee.name', 'Ratna Sari'));
});
