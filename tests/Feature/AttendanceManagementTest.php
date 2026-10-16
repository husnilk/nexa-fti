<?php

use App\Models\Attendance;
use App\Models\Employee;
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

    Permission::findOrCreate('attendance.view', 'web');
    Permission::findOrCreate('attendance.manage', 'web');

    $this->manager = User::factory()->create();
    $this->manager->givePermissionTo('attendance.manage');

    $this->viewer = User::factory()->create();
    $this->viewer->givePermissionTo('attendance.view');

    $this->admin = User::factory()->create();
    $this->admin->assignRole(Role::findOrCreate('super-admin', 'web'));

    $this->guest = User::factory()->create();

    $this->period = Period::factory()->create();
    $this->employee = Employee::factory()->create();
});

function attendancePayload(array $overrides = []): array
{
    return array_merge([
        'period_id' => test()->period->id,
        'employee_id' => test()->employee->id,
        'year' => 2026,
        'month' => 9,
        'present' => 19,
        'absent' => 1,
        'sick_leave' => 2,
        'late_01' => 3,
        'early_departure_02' => 1,
    ], $overrides);
}

it('lets viewers and managers see the list and details', function (string $user) {
    $attendance = Attendance::factory()->create([
        'period_id' => $this->period->id,
        'employee_id' => $this->employee->id,
    ]);

    actingAs($this->{$user})
        ->get(route('attendances.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('attendances/index')
            ->has('attendances.data', 1)
            ->has('periods', 1));

    actingAs($this->{$user})
        ->get(route('attendances.show', $attendance))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('attendances/show')
            ->where('attendance.employee.id', $this->employee->id));
})->with(['viewer', 'manager', 'admin']);

it('forbids users without attendance permissions', function () {
    $attendance = Attendance::factory()->create();

    actingAs($this->guest)->get(route('attendances.index'))->assertForbidden();
    actingAs($this->guest)->get(route('attendances.show', $attendance))->assertForbidden();
});

it('prevents viewers from changing attendance', function () {
    $attendance = Attendance::factory()->create();

    actingAs($this->viewer)->get(route('attendances.create'))->assertForbidden();
    actingAs($this->viewer)->post(route('attendances.store'), attendancePayload())->assertForbidden();
    actingAs($this->viewer)->get(route('attendances.edit', $attendance))->assertForbidden();
    actingAs($this->viewer)->put(route('attendances.update', $attendance), attendancePayload())->assertForbidden();
    actingAs($this->viewer)->delete(route('attendances.destroy', $attendance))->assertForbidden();

    expect(Attendance::count())->toBe(1);
});

it('lets managers create attendance records', function () {
    actingAs($this->manager)
        ->get(route('attendances.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('attendances/create')
            ->has('employees')
            ->has('periods'));

    actingAs($this->manager)
        ->post(route('attendances.store'), attendancePayload())
        ->assertRedirect(route('attendances.index'));

    $attendance = Attendance::sole();

    expect($attendance->employee_id)->toBe($this->employee->id)
        ->and($attendance->present)->toBe(19)
        ->and($attendance->late_01)->toBe(3)
        ->and($attendance->created_by)->toBe($this->manager->id);
});

it('lets managers update attendance records', function () {
    $attendance = Attendance::factory()->create([
        'period_id' => $this->period->id,
        'employee_id' => $this->employee->id,
        'year' => 2026,
        'month' => 9,
    ]);

    actingAs($this->manager)->get(route('attendances.edit', $attendance))->assertOk();

    actingAs($this->manager)
        ->put(route('attendances.update', $attendance), attendancePayload(['present' => 21, 'absent' => 0]))
        ->assertRedirect(route('attendances.index'));

    expect($attendance->fresh())
        ->present->toBe(21)
        ->absent->toBe(0);
});

it('lets managers delete attendance records', function () {
    $attendance = Attendance::factory()->create();

    actingAs($this->manager)
        ->delete(route('attendances.destroy', $attendance))
        ->assertRedirect(route('attendances.index'));

    expect(Attendance::count())->toBe(0);
});

it('rejects a second record for the same employee, period and month', function () {
    Attendance::factory()->create([
        'period_id' => $this->period->id,
        'employee_id' => $this->employee->id,
        'year' => 2026,
        'month' => 9,
    ]);

    actingAs($this->manager)
        ->post(route('attendances.store'), attendancePayload())
        ->assertSessionHasErrors('employee_id');

    expect(Attendance::count())->toBe(1);
});

it('validates the attendance input', function () {
    actingAs($this->manager)
        ->post(route('attendances.store'), attendancePayload([
            'period_id' => null,
            'month' => 13,
            'present' => -1,
            'late_01' => 40,
        ]))
        ->assertSessionHasErrors(['period_id', 'month', 'present', 'late_01']);
});

it('filters the list by period and employee name', function () {
    $otherPeriod = Period::factory()->create();
    $named = Employee::factory()->create(['name' => 'Ratna Sari']);

    Attendance::factory()->create(['period_id' => $this->period->id, 'employee_id' => $named->id]);
    Attendance::factory()->create(['period_id' => $otherPeriod->id]);

    actingAs($this->viewer)
        ->get(route('attendances.index', ['period_id' => $this->period->id]))
        ->assertInertia(fn (Assert $page) => $page->has('attendances.data', 1));

    actingAs($this->viewer)
        ->get(route('attendances.index', ['search' => 'Ratna']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('attendances.data', 1)
            ->where('attendances.data.0.employee.name', 'Ratna Sari'));
});
