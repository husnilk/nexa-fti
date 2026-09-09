<?php

use App\Models\Employee;
use App\Models\EmployeeFamilyMember;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Spatie\Permission\PermissionRegistrar;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    $this->admin = User::factory()->create();
    $this->admin->assignRole(Role::findOrCreate('super-admin', 'web'));

    $this->employee = Employee::factory()->create();
});

test('authorized user can add family member', function () {
    actingAs($this->admin)
        ->postJson(route('employee-family-members.store'), [
            'employee_id' => $this->employee->id,
            'name' => 'John Doe',
            'relationship' => 'spouse',
            'gender' => 'male',
            'birth_place' => 'New York',
            'birth_date' => '1985-05-15',
            'id_card_number' => '1234567890',
            'occupation' => 'Engineer',
            'phone' => '12345678',
            'is_dependent' => true,
            'notes' => 'Some notes',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('employee_family_members', [
        'employee_id' => $this->employee->id,
        'name' => 'John Doe',
        'relationship' => 'spouse',
    ]);
});

test('authorized user can update family member', function () {
    $familyMember = EmployeeFamilyMember::factory()->create([
        'employee_id' => $this->employee->id,
        'name' => 'Old Name',
    ]);

    actingAs($this->admin)
        ->patchJson(route('employee-family-members.update', $familyMember), [
            'name' => 'Updated Name',
            'relationship' => 'spouse',
            'gender' => 'male',
            'birth_place' => 'New York',
            'birth_date' => '1985-05-15',
            'id_card_number' => '1234567890',
            'occupation' => 'Engineer',
            'phone' => '12345678',
            'is_dependent' => true,
            'notes' => 'Some notes',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('employee_family_members', [
        'id' => $familyMember->id,
        'name' => 'Updated Name',
    ]);
});

test('authorized user can delete family member', function () {
    $familyMember = EmployeeFamilyMember::factory()->create([
        'employee_id' => $this->employee->id,
    ]);

    actingAs($this->admin)
        ->deleteJson(route('employee-family-members.destroy', $familyMember))
        ->assertRedirect();

    $this->assertDatabaseMissing('employee_family_members', [
        'id' => $familyMember->id,
    ]);
});

test('unauthorized user cannot add family member', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->postJson(route('employee-family-members.store'), [
            'employee_id' => $this->employee->id,
            'name' => 'Unauthorized Member',
            'relationship' => 'spouse',
            'gender' => 'male',
        ])
        ->assertForbidden();
});
