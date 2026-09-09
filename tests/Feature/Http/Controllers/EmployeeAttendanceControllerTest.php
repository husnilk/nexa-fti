<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\Hr\EmployeeAttendanceController;
use App\Http\Requests\EmployeeAttendanceStoreRequest;
use App\Http\Requests\EmployeeAttendanceUpdateRequest;
use App\Models\Employee;
use App\Models\EmployeeAttendance;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

/**
 * @see EmployeeAttendanceController
 */
final class EmployeeAttendanceControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(PreventRequestForgery::class);
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $this->admin = User::factory()->create();
        $this->admin->assignRole(Role::findOrCreate('super-admin', 'web'));
    }

    #[Test]
    public function index_displays_view(): void
    {
        $employeeAttendances = EmployeeAttendance::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)->get(route('employee-attendances.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('employee-attendances/index'));
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->actingAs($this->admin)->get(route('employee-attendances.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('employee-attendances/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EmployeeAttendanceController::class,
            'store',
            EmployeeAttendanceStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $employee = Employee::factory()->create();
        $date = fake()->date();
        $status = fake()->randomElement(['present', 'absent', 'leave', 'overtime', 'holiday']);

        $response = $this->actingAs($this->admin)->post(route('employee-attendances.store'), [
            'employee_id' => $employee->id,
            'date' => $date,
            'status' => $status,
        ]);

        $response->assertSessionHasNoErrors();

        $this->assertDatabaseHas('employee_attendances', [
            'employee_id' => $employee->id,
            'date' => $date,
            'status' => $status,
        ]);

        $response->assertRedirect(route('employee-attendances.index'));
    }

    #[Test]
    public function show_displays_view(): void
    {
        $employeeAttendance = EmployeeAttendance::factory()->create();

        $response = $this->actingAs($this->admin)->get(route('employee-attendances.show', $employeeAttendance));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('employee-attendances/show'));
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $employeeAttendance = EmployeeAttendance::factory()->create();

        $response = $this->actingAs($this->admin)->get(route('employee-attendances.edit', $employeeAttendance));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('employee-attendances/edit'));
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EmployeeAttendanceController::class,
            'update',
            EmployeeAttendanceUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $employeeAttendance = EmployeeAttendance::factory()->create();
        $employee = Employee::factory()->create();
        $date = fake()->date();
        $status = fake()->randomElement(['present', 'absent', 'leave', 'overtime', 'holiday']);

        $response = $this->actingAs($this->admin)->put(route('employee-attendances.update', $employeeAttendance), [
            'employee_id' => $employee->id,
            'date' => $date,
            'status' => $status,
        ]);

        $employeeAttendance->refresh();

        $response->assertRedirect(route('employee-attendances.index'));

        $this->assertEquals($employee->id, $employeeAttendance->employee_id);
        $this->assertEquals($date, $employeeAttendance->date->toDateString());
        $this->assertEquals($status, $employeeAttendance->status);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $employeeAttendance = EmployeeAttendance::factory()->create();

        $response = $this->actingAs($this->admin)->delete(route('employee-attendances.destroy', $employeeAttendance));

        $response->assertRedirect(route('employee-attendances.index'));

        $this->assertModelMissing($employeeAttendance);
    }
}
