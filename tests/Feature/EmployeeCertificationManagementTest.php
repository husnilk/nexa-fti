<?php

use App\Models\Employee;
use App\Models\EmployeeCertification;
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

test('authorized user can add certification', function () {
    actingAs($this->admin)
        ->postJson(route('employee-certifications.store'), [
            'employee_id' => $this->employee->id,
            'name' => 'Oracle Certified Professional',
            'institution' => 'Oracle University',
            'certification_number' => 'CERT-12345',
            'issue_date' => '2023-01-15',
            'expiry_date' => '2028-01-15',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('employee_certifications', [
        'employee_id' => $this->employee->id,
        'name' => 'Oracle Certified Professional',
        'institution' => 'Oracle University',
        'certification_number' => 'CERT-12345',
        'issue_date' => '2023-01-15 00:00:00',
        'expiry_date' => '2028-01-15 00:00:00',
    ]);
});

test('authorized user can update certification', function () {
    $certification = EmployeeCertification::factory()->create([
        'employee_id' => $this->employee->id,
        'name' => 'Old Certification Name',
    ]);

    actingAs($this->admin)
        ->patchJson(route('employee-certifications.update', $certification), [
            'name' => 'New Certification Name',
            'institution' => 'Oracle University',
            'certification_number' => 'CERT-54321',
            'issue_date' => '2023-01-15',
            'expiry_date' => '2028-01-15',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('employee_certifications', [
        'id' => $certification->id,
        'name' => 'New Certification Name',
        'certification_number' => 'CERT-54321',
    ]);
});

test('authorized user can delete certification', function () {
    $certification = EmployeeCertification::factory()->create([
        'employee_id' => $this->employee->id,
    ]);

    actingAs($this->admin)
        ->deleteJson(route('employee-certifications.destroy', $certification))
        ->assertRedirect();

    $this->assertDatabaseMissing('employee_certifications', [
        'id' => $certification->id,
    ]);
});

test('unauthorized user cannot add certification', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->postJson(route('employee-certifications.store'), [
            'employee_id' => $this->employee->id,
            'name' => 'Unauthorized Cert',
            'institution' => 'Some Org',
            'issue_date' => '2023-01-15',
        ])
        ->assertForbidden();
});
