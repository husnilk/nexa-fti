<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\Hr\EmployeeAttendanceReportController;
use App\Models\EmployeeAttendance;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

/**
 * @see EmployeeAttendanceReportController
 */
final class EmployeeAttendanceReportControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

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
        EmployeeAttendance::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)->get(route('employee-attendances.reports.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('employee-attendances/reports/index'));
    }

    #[Test]
    public function show_displays_view(): void
    {
        $attendance = EmployeeAttendance::factory()->create();
        $employee = $attendance->employee;

        $response = $this->actingAs($this->admin)->get(route('employee-attendances.reports.show', $employee));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('employee-attendances/reports/show'));
    }
}
