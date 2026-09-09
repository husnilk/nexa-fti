<?php

use App\Models\Employee;
use App\Models\EmployeeCertification;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\PermissionRegistrar;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    // Setup roles & permissions
    Permission::findOrCreate('certification.manage');
    $superAdminRole = Role::findOrCreate('super-admin', 'web');

    // Super Admin
    $this->admin = User::factory()->create();
    $this->admin->assignRole($superAdminRole);

    // Authorized user with certification.manage permission
    $this->manager = User::factory()->create();
    $this->manager->givePermissionTo('certification.manage');

    // Unauthorized user
    $this->unauthorizedUser = User::factory()->create();

    // Sibling objects
    $this->employee = Employee::factory()->create();

    Storage::fake('public');
});

test('unauthorized user is forbidden from certification module', function () {
    actingAs($this->unauthorizedUser)
        ->get(route('certifications.index'))
        ->assertForbidden();

    actingAs($this->unauthorizedUser)
        ->get(route('certifications.create'))
        ->assertForbidden();

    actingAs($this->unauthorizedUser)
        ->post(route('certifications.store'), [])
        ->assertForbidden();
});

test('authorized manager can view certifications list', function () {
    $certification = EmployeeCertification::factory()->create([
        'employee_id' => $this->employee->id,
    ]);

    actingAs($this->manager)
        ->get(route('certifications.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('certifications/index')
            ->has('certifications')
        );
});

test('authorized manager can view create certification form', function () {
    actingAs($this->manager)
        ->get(route('certifications.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('certifications/create')
            ->has('employees')
        );
});

test('authorized manager can store a new certification', function () {
    $file = UploadedFile::fake()->create('certificate.pdf', 100);

    $response = actingAs($this->manager)
        ->post(route('certifications.store'), [
            'employee_id' => $this->employee->id,
            'name' => 'Certified Kubernetes Administrator',
            'institution' => 'The Linux Foundation',
            'certification_number' => 'CKA-999888',
            'issue_date' => '2026-01-01',
            'expiry_date' => '2029-01-01',
            'certificate_file' => $file,
        ]);

    $response->assertRedirect(route('certifications.index'));

    $certification = EmployeeCertification::where('certification_number', 'CKA-999888')->first();
    expect($certification)->not->toBeNull();
    expect($certification->certificate_file)->not->toBeNull();

    Storage::disk('public')->assertExists($certification->certificate_file);

    assertDatabaseHas('employee_certifications', [
        'employee_id' => $this->employee->id,
        'name' => 'Certified Kubernetes Administrator',
        'institution' => 'The Linux Foundation',
        'certification_number' => 'CKA-999888',
    ]);
});

test('authorized manager can view single certification detail', function () {
    $certification = EmployeeCertification::factory()->create([
        'employee_id' => $this->employee->id,
    ]);

    actingAs($this->manager)
        ->get(route('certifications.show', $certification))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('certifications/show')
            ->has('certification')
        );
});

test('authorized manager can view edit certification form', function () {
    $certification = EmployeeCertification::factory()->create([
        'employee_id' => $this->employee->id,
    ]);

    actingAs($this->manager)
        ->get(route('certifications.edit', $certification))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('certifications/edit')
            ->has('certification')
            ->has('employees')
        );
});

test('authorized manager can update certification and upload new file', function () {
    $certification = EmployeeCertification::factory()->create([
        'employee_id' => $this->employee->id,
        'name' => 'Old AWS Developer Associate',
        'institution' => 'AWS',
        'certificate_file' => 'old_path/cert.pdf',
    ]);

    $newFile = UploadedFile::fake()->create('new_certificate.jpg', 200);

    $response = actingAs($this->manager)
        ->put(route('certifications.update', $certification), [
            'employee_id' => $this->employee->id,
            'name' => 'New AWS Solutions Architect',
            'institution' => 'Amazon Web Services',
            'certification_number' => 'AWS-ARCH-888',
            'issue_date' => '2026-02-02',
            'expiry_date' => '2029-02-02',
            'certificate_file' => $newFile,
        ]);

    $response->assertRedirect(route('certifications.index'));

    $certification->refresh();
    expect($certification->name)->toBe('New AWS Solutions Architect');
    expect($certification->certification_number)->toBe('AWS-ARCH-888');
    expect($certification->certificate_file)->not->toBe('old_path/cert.pdf');

    Storage::disk('public')->assertExists($certification->certificate_file);
    Storage::disk('public')->assertMissing('old_path/cert.pdf');
});

test('authorized manager can delete certification', function () {
    $certification = EmployeeCertification::factory()->create([
        'employee_id' => $this->employee->id,
        'certificate_file' => 'temp/cert.pdf',
    ]);

    Storage::disk('public')->put('temp/cert.pdf', 'content');

    $response = actingAs($this->manager)
        ->delete(route('certifications.destroy', $certification));

    $response->assertRedirect(route('certifications.index'));

    assertDatabaseMissing('employee_certifications', [
        'id' => $certification->id,
    ]);

    Storage::disk('public')->assertMissing('temp/cert.pdf');
});
