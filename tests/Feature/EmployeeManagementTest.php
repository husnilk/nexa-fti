<?php

use App\Models\Employee;
use App\Models\EmployeeType;
use App\Models\EmploymentContract;
use App\Models\EmploymentType;
use App\Models\FunctionalPosition;
use App\Models\Lecturer;
use App\Models\Position;
use App\Models\PositionNomenclature;
use App\Models\PositionNomenclatureClassification;
use App\Models\Role;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Spatie\Permission\PermissionRegistrar;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    $this->admin = User::factory()->create();
    $this->admin->assignRole(Role::findOrCreate('super-admin', 'web'));

    $eType = EmployeeType::factory()->create();
    $contract = EmploymentContract::factory()->create();
    $this->empType = EmploymentType::factory()->create([
        'employee_type_id' => $eType->id,
        'employment_contract_id' => $contract->id,
    ]);

    $this->funcPos = FunctionalPosition::create(['name' => 'Expert', 'code' => 'EXP', 'level' => 1]);
    $this->pos = Position::create(['name' => 'Head of Dept', 'grade' => 12]);
});

test('authorized user can view employee list', function () {
    actingAs($this->admin)
        ->get(route('employees.index'))
        ->assertOk();
});

test('authorized user can create lecturer', function () {
    actingAs($this->admin)
        ->postJson(route('employees.store'), [
            'name' => 'Dr. Jane Smith',
            'email' => 'jane@example.com',
            'emp_number' => '123456',
            'id_card_number' => 'KTP-123',
            'birth_place' => 'London',
            'birth_date' => '1980-01-01',
            'gender' => 'female',
            'religion' => 'Islam',
            'marital_status' => 'Married',
            'join_date' => '2020-01-01',
            'employment_type_id' => $this->empType->id,
            'status' => 1,
            'specialization' => 'lecturer',
            'academic_rank' => 'Professor',
            'functional_position_id' => $this->funcPos->id,
            'nuptk' => 'NUP-1',
            'expertise' => 'AI',
        ])
        ->assertRedirect(route('employees.index'));

    $this->assertDatabaseHas('employees', ['name' => 'Dr. Jane Smith']);
    $this->assertDatabaseHas('users', ['email' => 'jane@example.com']);
    $this->assertDatabaseHas('lecturers', ['academic_rank' => 'Professor']);
});

test('authorized user can create staff', function () {
    actingAs($this->admin)
        ->postJson(route('employees.store'), [
            'name' => 'Bob Builder',
            'email' => 'bob@example.com',
            'emp_number' => '7890',
            'id_card_number' => 'KTP-789',
            'birth_place' => 'New York',
            'birth_date' => '1990-05-05',
            'gender' => 'male',
            'religion' => 'Kristen',
            'marital_status' => 'Single',
            'join_date' => '2021-01-01',
            'employment_type_id' => $this->empType->id,
            'status' => 1,
            'specialization' => 'staff',
            'position_id' => $this->pos->id,
            'skills' => 'Construction',
        ])
        ->assertRedirect(route('employees.index'));

    $this->assertDatabaseHas('employees', ['name' => 'Bob Builder']);
    $this->assertDatabaseHas('staff', ['skills' => 'Construction']);
});

test('authorized user can update employee', function () {
    $user = User::factory()->create();
    $emp = Employee::create([
        'id' => $user->id,
        'name' => 'Old Name',
        'email' => $user->email,
        'emp_number' => 'OLD-1',
        'id_card_number' => 'KTP-OLD',
        'birth_place' => 'City',
        'birth_date' => '1980-01-01',
        'gender' => 'male',
        'religion' => 'Islam',
        'marital_status' => 'Single',
        'join_date' => '2020-01-01',
        'employment_type_id' => $this->empType->id,
        'status' => 1,
    ]);

    actingAs($this->admin)
        ->patchJson(route('employees.update', $emp), [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'emp_number' => 'OLD-1',
            'id_card_number' => 'KTP-OLD',
            'birth_place' => 'City',
            'birth_date' => '1980-01-01',
            'gender' => 'male',
            'religion' => 'Islam',
            'marital_status' => 'Single',
            'join_date' => '2020-01-01',
            'employment_type_id' => $this->empType->id,
            'status' => 1,
        ])
        ->assertRedirect(route('employees.index'));

    $this->assertDatabaseHas('employees', ['id' => $user->id, 'name' => 'Updated Name']);
    $this->assertDatabaseHas('users', ['id' => $user->id, 'email' => 'updated@example.com']);
});

test('authorized user can delete employee', function () {
    $user = User::factory()->create();
    $emp = Employee::create([
        'id' => $user->id,
        'name' => 'To Delete',
        'email' => $user->email,
        'emp_number' => 'DEL-1',
        'id_card_number' => 'KTP-DEL',
        'birth_place' => 'City',
        'birth_date' => '1980-01-01',
        'gender' => 'male',
        'religion' => 'Islam',
        'marital_status' => 'Single',
        'join_date' => '2020-01-01',
        'employment_type_id' => $this->empType->id,
        'status' => 1,
    ]);

    actingAs($this->admin)
        ->deleteJson(route('employees.destroy', $emp))
        ->assertRedirect(route('employees.index'));

    $this->assertDatabaseMissing('employees', ['id' => $user->id]);
    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});

test('authorized user can manage position history', function () {
    $user = User::factory()->create();
    $emp = Employee::create([
        'id' => $user->id,
        'name' => 'John',
        'email' => $user->email,
        'emp_number' => 'E1',
        'id_card_number' => 'C1',
        'birth_place' => 'P1',
        'birth_date' => '1990-01-01',
        'gender' => 'male',
        'religion' => 'Islam',
        'marital_status' => 'Single',
        'join_date' => '2020-01-01',
        'employment_type_id' => $this->empType->id,
    ]);

    actingAs($this->admin)
        ->postJson(route('employee-position-histories.store'), [
            'employee_id' => $emp->id,
            'position_id' => $this->pos->id,
            'start_date' => '2021-01-01',
            'decree_number' => 'DEC-01',
            'decree_date' => '2021-01-01',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('employee_position_histories', [
        'employee_id' => $emp->id,
        'decree_number' => 'DEC-01',
    ]);
});

test('authorized user can manage education history', function () {
    $user = User::factory()->create();
    $emp = Employee::create([
        'id' => $user->id,
        'name' => 'John',
        'email' => $user->email,
        'emp_number' => 'E2',
        'id_card_number' => 'C2',
        'birth_place' => 'P1',
        'birth_date' => '1990-01-01',
        'gender' => 'male',
        'religion' => 'Islam',
        'marital_status' => 'Single',
        'join_date' => '2020-01-01',
        'employment_type_id' => $this->empType->id,
    ]);

    actingAs($this->admin)
        ->postJson(route('employee-education-histories.store'), [
            'employee_id' => $emp->id,
            'degree' => 'S1',
            'institution' => 'University A',
            'major' => 'Computer Science',
            'start_year' => 2010,
            'end_year' => 2014,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('employee_education_histories', [
        'employee_id' => $emp->id,
        'institution' => 'University A',
    ]);
});

test('authorized user can manage functional position history', function () {
    $user = User::factory()->create();
    $emp = Employee::create([
        'id' => $user->id,
        'name' => 'John',
        'email' => $user->email,
        'emp_number' => 'E3',
        'id_card_number' => 'C3',
        'birth_place' => 'P1',
        'birth_date' => '1990-01-01',
        'gender' => 'male',
        'religion' => 'Islam',
        'marital_status' => 'Single',
        'join_date' => '2020-01-01',
        'employment_type_id' => $this->empType->id,
    ]);

    $lecturer = Lecturer::create([
        'id' => $emp->id,
        'academic_rank' => 'Asisten Ahli',
        'functional_position_id' => $this->funcPos->id,
    ]);

    actingAs($this->admin)
        ->postJson(route('position-functional-histories.store'), [
            'lecturer_id' => $lecturer->id,
            'functional_position_id' => $this->funcPos->id,
            'start_date' => '2021-01-01',
            'decree_number' => 'FUNC-01',
            'decree_date' => '2021-01-01',
            'decree_signer' => 'Rector',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('position_functional_histories', [
        'lecturer_id' => $lecturer->id,
        'decree_number' => 'FUNC-01',
    ]);
});

test('authorized user can manage nomenclature classification history', function () {
    $user = User::factory()->create();
    $emp = Employee::create([
        'id' => $user->id,
        'name' => 'John Staff',
        'email' => $user->email,
        'emp_number' => 'E4',
        'id_card_number' => 'C4',
        'birth_place' => 'P1',
        'birth_date' => '1990-01-01',
        'gender' => 'male',
        'religion' => 'Islam',
        'marital_status' => 'Single',
        'join_date' => '2020-01-01',
        'employment_type_id' => $this->empType->id,
    ]);

    $staff = Staff::create([
        'id' => $emp->id,
        'position_id' => $this->pos->id,
    ]);

    $nom = PositionNomenclature::create(['name' => 'Admin', 'grade' => 5]);
    $class = PositionNomenclatureClassification::create([
        'position_nomenclature_id' => $nom->id,
        'name' => 'Staff Classification',
    ]);

    actingAs($this->admin)
        ->postJson(route('nomenclature-classification-histories.store'), [
            'staff_id' => $staff->id,
            'nomenclature_classification_id' => $class->id,
            'start_date' => '2021-01-01',
            'decree_number' => 'CLASS-01',
            'decree_date' => '2021-01-01',
            'decree_signer' => 'Manager',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('nomenclature_classification_histories', [
        'staff_id' => $staff->id,
        'decree_number' => 'CLASS-01',
    ]);
});
