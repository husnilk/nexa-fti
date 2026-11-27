<?php

use App\Models\Organization;
use App\Models\Period;
use App\Models\PeriodOrganization;
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

    $this->period = Period::factory()->create(['pir' => 3200]);

    $this->faculty = Organization::factory()->create(['name' => 'Fakultas TI', 'has_pagu' => true, 'is_active' => true]);
    $this->department = Organization::factory()->create(['name' => 'Departemen SI', 'has_pagu' => true, 'is_active' => true]);
    $this->noBudget = Organization::factory()->create(['has_pagu' => false, 'is_active' => true]);
    $this->inactive = Organization::factory()->create(['has_pagu' => true, 'is_active' => false]);
});

function validPeriodOrganizationPayload(array $overrides = []): array
{
    return array_merge([
        'pagu' => 150000000,
        'pir_unit' => 3100,
        'percentage' => 80,
        'sharing_method' => 1,
        'finalization_state' => 1,
        'stage' => 2,
    ], $overrides);
}

test('sync adds only active organizations that have a pagu', function () {
    actingAs($this->manager)
        ->from(route('period-organizations.index', $this->period))
        ->post(route('period-organizations.sync', $this->period))
        ->assertRedirect(route('period-organizations.index', $this->period));

    expect($this->period->organizations()->pluck('organization_id')->sort()->values()->all())
        ->toBe(collect([$this->faculty->id, $this->department->id])->sort()->values()->all());

    expect($this->period->organizations()->first())
        ->pir_unit->toBe(3200.0)
        ->pagu->toBe(0.0);
});

test('sync does not duplicate or overwrite existing rows', function () {
    $this->period->organizations()->create(['organization_id' => $this->faculty->id, 'pagu' => 5000]);

    actingAs($this->manager)->post(route('period-organizations.sync', $this->period));
    actingAs($this->manager)->post(route('period-organizations.sync', $this->period));

    expect($this->period->organizations()->count())->toBe(2)
        ->and($this->period->organizations()->where('organization_id', $this->faculty->id)->sole()->pagu)->toBe(5000.0);
});

test('index lists only organizations that have a pagu, sorted by name', function () {
    $this->period->organizations()->create(['organization_id' => $this->faculty->id]);
    $this->period->organizations()->create(['organization_id' => $this->department->id]);
    $this->period->organizations()->create(['organization_id' => $this->noBudget->id]);

    actingAs($this->manager)
        ->get(route('period-organizations.index', $this->period))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('periods/organizations')
            ->where('period.id', $this->period->id)
            ->has('periodOrganizations', 2)
            ->where('periodOrganizations.0.organization.name', 'Departemen SI')
            ->where('periodOrganizations.1.organization.name', 'Fakultas TI')
            ->where('unsyncedCount', 0)
            ->has('options.sharingMethods')
            ->has('options.finalizationStates')
            ->has('options.stages')
        );
});

test('index reports how many organizations still need syncing', function () {
    $this->period->organizations()->create(['organization_id' => $this->faculty->id]);

    actingAs($this->manager)
        ->get(route('period-organizations.index', $this->period))
        ->assertInertia(fn ($page) => $page->where('unsyncedCount', 1));
});

test('rows from other periods are not listed', function () {
    $otherPeriod = Period::factory()->create();
    $otherPeriod->organizations()->create(['organization_id' => $this->faculty->id]);

    actingAs($this->manager)
        ->get(route('period-organizations.index', $this->period))
        ->assertInertia(fn ($page) => $page->has('periodOrganizations', 0));
});

test('can update an organization in a period', function () {
    $row = $this->period->organizations()->create(['organization_id' => $this->faculty->id]);

    actingAs($this->manager)
        ->patch(route('period-organizations.update', [$this->period, $row]), validPeriodOrganizationPayload())
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect($row->fresh())
        ->pagu->toBe(150000000.0)
        ->pir_unit->toBe(3100.0)
        ->percentage->toBe(80.0)
        ->sharing_method->toBe(1)
        ->finalization_state->toBe(1)
        ->stage->toBe(2);
});

test('update validates values against the remun config', function () {
    $row = $this->period->organizations()->create(['organization_id' => $this->faculty->id]);

    actingAs($this->manager)
        ->patch(route('period-organizations.update', [$this->period, $row]), validPeriodOrganizationPayload([
            'pagu' => -1,
            'percentage' => 101,
            'sharing_method' => 9,
            'finalization_state' => 9,
            'stage' => 9,
        ]))
        ->assertSessionHasErrors(['pagu', 'percentage', 'sharing_method', 'finalization_state', 'stage']);

    expect($row->fresh()->pagu)->toBe(0.0);
});

test('a row cannot be updated through another period', function () {
    $otherPeriod = Period::factory()->create();
    $row = $otherPeriod->organizations()->create(['organization_id' => $this->faculty->id]);

    actingAs($this->manager)
        ->patch(route('period-organizations.update', [$this->period, $row]), validPeriodOrganizationPayload())
        ->assertNotFound();

    expect($row->fresh()->pagu)->toBe(0.0);
});

test('period detail summarizes only organizations that have a pagu', function () {
    $this->period->organizations()->create(['organization_id' => $this->faculty->id, 'pagu' => 1000]);
    $this->period->organizations()->create(['organization_id' => $this->department->id, 'pagu' => 2500]);
    $this->period->organizations()->create(['organization_id' => $this->noBudget->id, 'pagu' => 9999]);

    actingAs($this->manager)
        ->get(route('periods.show', $this->period))
        ->assertInertia(fn ($page) => $page
            ->where('period.organizations_count', 2)
            ->where('period.organizations_sum_pagu', fn ($sum) => (float) $sum === 3500.0)
        );
});

test('user without period.manage cannot access period organizations', function () {
    $row = $this->period->organizations()->create(['organization_id' => $this->faculty->id]);

    actingAs($this->guest)->get(route('period-organizations.index', $this->period))->assertForbidden();
    actingAs($this->guest)->post(route('period-organizations.sync', $this->period))->assertForbidden();
    actingAs($this->guest)
        ->patch(route('period-organizations.update', [$this->period, $row]), validPeriodOrganizationPayload())
        ->assertForbidden();

    expect(PeriodOrganization::count())->toBe(1)
        ->and($row->fresh()->pagu)->toBe(0.0);
});

test('organization has_pagu flag can be set from the organization form', function () {
    Permission::findOrCreate('organization.manage', 'web');
    $this->manager->givePermissionTo('organization.manage');
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    actingAs($this->manager)
        ->patch(route('organizations.update', $this->noBudget), [
            'organization_type_id' => $this->noBudget->organization_type_id,
            'name' => $this->noBudget->name,
            'code' => $this->noBudget->code,
            'is_active' => true,
            'has_pagu' => true,
        ])
        ->assertSessionHasNoErrors();

    expect($this->noBudget->fresh()->has_pagu)->toBeTrue();
});
