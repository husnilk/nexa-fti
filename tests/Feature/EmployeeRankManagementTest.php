<?php

use App\Models\Employee;
use App\Models\EmployeeRank;
use App\Models\EmployeeRankHistory;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Spatie\Permission\PermissionRegistrar;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    Permission::findOrCreate('hr.view', 'web');
    Permission::findOrCreate('hr.manage', 'web');

    $this->admin = User::factory()->create();
    $this->admin->assignRole(Role::findOrCreate('super-admin', 'web'));

    $this->userWithView = User::factory()->create();
    $this->userWithView->givePermissionTo('hr.view');

    $this->userWithManage = User::factory()->create();
    $this->userWithManage->givePermissionTo('hr.manage');
    $this->userWithManage->givePermissionTo('hr.view');

    $this->regularUser = User::factory()->create();

    $this->employee = Employee::factory()->create();
});

// Master Rank Data tests
test('authorized user can view employee ranks list', function () {
    EmployeeRank::factory()->create([
        'code' => 'I/a',
        'name' => 'Juru Muda',
    ]);

    actingAs($this->userWithView)
        ->get(route('employee-ranks.index'))
        ->assertOk();
});

test('unauthorized user cannot view employee ranks list', function () {
    actingAs($this->regularUser)
        ->get(route('employee-ranks.index'))
        ->assertForbidden();
});

test('user with hr.manage can create employee rank', function () {
    actingAs($this->userWithManage)
        ->postJson(route('employee-ranks.store'), [
            'code' => 'I/b',
            'name' => 'Juru Muda Tingkat I',
            'order' => 2,
            'description' => 'Second rank',
        ])
        ->assertRedirect(route('employee-ranks.index'));

    $this->assertDatabaseHas('employee_ranks', [
        'code' => 'I/b',
        'name' => 'Juru Muda Tingkat I',
        'order' => 2,
    ]);
});

test('user without hr.manage cannot create employee rank', function () {
    actingAs($this->userWithView)
        ->postJson(route('employee-ranks.store'), [
            'code' => 'I/b',
            'name' => 'Juru Muda Tingkat I',
            'order' => 2,
        ])
        ->assertForbidden();
});

test('user with hr.manage can update employee rank', function () {
    $rank = EmployeeRank::factory()->create([
        'code' => 'I/a',
        'name' => 'Juru Muda',
    ]);

    actingAs($this->userWithManage)
        ->putJson(route('employee-ranks.update', $rank), [
            'code' => 'I/a_new',
            'name' => 'Juru Muda Baru',
            'order' => 5,
            'description' => 'Updated rank desc',
        ])
        ->assertRedirect(route('employee-ranks.index'));

    $this->assertDatabaseHas('employee_ranks', [
        'id' => $rank->id,
        'code' => 'I/a_new',
        'name' => 'Juru Muda Baru',
    ]);
});

test('user with hr.manage can delete employee rank when no history exists', function () {
    $rank = EmployeeRank::factory()->create();

    actingAs($this->userWithManage)
        ->delete(route('employee-ranks.destroy', $rank))
        ->assertRedirect(route('employee-ranks.index'));

    $this->assertDatabaseMissing('employee_ranks', [
        'id' => $rank->id,
    ]);
});

test('user with hr.manage cannot delete employee rank when history exists', function () {
    $rank = EmployeeRank::factory()->create();
    EmployeeRankHistory::factory()->create([
        'employee_id' => $this->employee->id,
        'employee_rank_id' => $rank->id,
    ]);

    actingAs($this->userWithManage)
        ->delete(route('employee-ranks.destroy', $rank))
        ->assertRedirect();

    $this->assertDatabaseHas('employee_ranks', [
        'id' => $rank->id,
    ]);
});

// Rank History tests
test('user with hr.manage can add employee rank history', function () {
    $rank = EmployeeRank::factory()->create();

    actingAs($this->userWithManage)
        ->postJson(route('employee-rank-histories.store'), [
            'employee_id' => $this->employee->id,
            'employee_rank_id' => $rank->id,
            'start_date' => '2026-01-01',
            'end_date' => '2026-12-31',
            'effective_date' => '2026-01-01',
            'decree_number' => '123/SK/2026',
            'decree_date' => '2026-01-01',
            'remarks' => 'Starting rank',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('employee_rank_histories', [
        'employee_id' => $this->employee->id,
        'employee_rank_id' => $rank->id,
        'decree_number' => '123/SK/2026',
    ]);
});

test('user without hr.manage cannot add employee rank history', function () {
    $rank = EmployeeRank::factory()->create();

    actingAs($this->userWithView)
        ->postJson(route('employee-rank-histories.store'), [
            'employee_id' => $this->employee->id,
            'employee_rank_id' => $rank->id,
            'start_date' => '2026-01-01',
            'effective_date' => '2026-01-01',
            'decree_number' => '123/SK/2026',
            'decree_date' => '2026-01-01',
        ])
        ->assertForbidden();
});

test('user with hr.manage can update employee rank history', function () {
    $rank = EmployeeRank::factory()->create();
    $history = EmployeeRankHistory::factory()->create([
        'employee_id' => $this->employee->id,
        'employee_rank_id' => $rank->id,
        'decree_number' => 'Old Decree',
    ]);

    actingAs($this->userWithManage)
        ->patchJson(route('employee-rank-histories.update', $history), [
            'employee_rank_id' => $rank->id,
            'start_date' => '2026-01-01',
            'effective_date' => '2026-01-01',
            'decree_number' => 'Updated Decree',
            'decree_date' => '2026-01-01',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('employee_rank_histories', [
        'id' => $history->id,
        'decree_number' => 'Updated Decree',
    ]);
});

test('user with hr.manage can delete employee rank history', function () {
    $rank = EmployeeRank::factory()->create();
    $history = EmployeeRankHistory::factory()->create([
        'employee_id' => $this->employee->id,
        'employee_rank_id' => $rank->id,
    ]);

    actingAs($this->userWithManage)
        ->delete(route('employee-rank-histories.destroy', $history))
        ->assertRedirect();

    $this->assertDatabaseMissing('employee_rank_histories', [
        'id' => $history->id,
    ]);
});
