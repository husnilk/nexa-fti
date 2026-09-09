<?php

use App\Models\Organization;
use App\Models\OrganizationType;
use App\Models\Role;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Spatie\Permission\PermissionRegistrar;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    $this->admin = User::factory()->create();
    $this->admin->assignRole(Role::findOrCreate('super-admin', 'web'));

    $departmentType = OrganizationType::query()
        ->where('name', 'Departemen')
        ->firstOrFail();

    $this->dept = Organization::create([
        'organization_type_id' => $departmentType->id,
        'name' => 'IT Dept',
        'code' => 'IT',
    ]);
});

test('authorized user can view student list', function () {
    actingAs($this->admin)
        ->get(route('students.index'))
        ->assertOk();
});

test('authorized user can create student', function () {
    actingAs($this->admin)
        ->postJson(route('students.store'), [
            'name' => 'Alice Wonder',
            'reg_no' => '20260001',
            'reg_date' => '2026-01-01',
            'birth_place' => 'City',
            'birth_date' => '2005-01-01',
            'gender' => 'female',
            'religion' => 'Islam',
            'email' => 'alice@example.com',
            'department_id' => $this->dept->id,
            'year' => 2026,
            'status' => 'active',
        ])
        ->assertRedirect(route('students.index'));

    $this->assertDatabaseHas('students', ['reg_no' => '20260001']);
    $this->assertDatabaseHas('users', ['email' => 'alice@example.com']);
});

test('authorized user can update student', function () {
    $user = User::factory()->create();
    $student = Student::create([
        'id' => $user->id,
        'name' => 'Old Name',
        'reg_no' => 'ST-OLD',
        'reg_date' => '2020-01-01',
        'birth_place' => 'Place',
        'birth_date' => '2000-01-01',
        'gender' => 'male',
        'religion' => 'Islam',
        'email' => $user->email,
        'department_id' => $this->dept->id,
        'year' => 2020,
        'status' => 'active',
    ]);

    actingAs($this->admin)
        ->patchJson(route('students.update', $student), [
            'name' => 'New Name',
            'reg_no' => 'ST-OLD',
            'reg_date' => '2020-01-01',
            'birth_place' => 'Place',
            'birth_date' => '2000-01-01',
            'gender' => 'male',
            'religion' => 'Islam',
            'email' => 'new-email@example.com',
            'department_id' => $this->dept->id,
            'year' => 2020,
            'status' => 'inactive',
        ])
        ->assertRedirect(route('students.index'));

    $this->assertDatabaseHas('students', ['id' => $user->id, 'name' => 'New Name', 'status' => 'inactive']);
    $this->assertDatabaseHas('users', ['id' => $user->id, 'email' => 'new-email@example.com']);
});

test('authorized user can delete student', function () {
    $user = User::factory()->create();
    $student = Student::create([
        'id' => $user->id,
        'name' => 'To Delete',
        'reg_no' => 'DEL-ST',
        'reg_date' => '2020-01-01',
        'birth_place' => 'Place',
        'birth_date' => '2000-01-01',
        'gender' => 'male',
        'religion' => 'Islam',
        'email' => $user->email,
        'department_id' => $this->dept->id,
        'year' => 2020,
        'status' => 'active',
    ]);

    actingAs($this->admin)
        ->deleteJson(route('students.destroy', $student))
        ->assertRedirect(route('students.index'));

    $this->assertDatabaseMissing('students', ['id' => $user->id]);
    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});
