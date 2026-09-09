<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EmployeeAttendance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeAttendanceReportController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:hr.view')->only(['index', 'show']);
    }

    /**
     * Display the monthly attendance report summary for all employees.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $month = $request->input('month', now()->format('Y-m'));

        if (! preg_match('/^\d{4}-\d{2}$/', $month)) {
            $month = now()->format('Y-m');
        }

        [$year, $m] = explode('-', $month);

        $report = Employee::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('emp_number', 'like', "%{$search}%");
            })
            ->with(['attendances' => function ($query) use ($year, $m) {
                $query->whereYear('date', $year)
                    ->whereMonth('date', $m);
            }])
            ->get()
            ->map(function ($employee) {
                $attendances = $employee->attendances;

                return [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'emp_number' => $employee->emp_number,
                    'present_count' => $attendances->where('status', 'present')->count(),
                    'absent_count' => $attendances->where('status', 'absent')->count(),
                    'leave_count' => $attendances->where('status', 'leave')->count(),
                    'overtime_count' => $attendances->where('status', 'overtime')->count(),
                    'holiday_count' => $attendances->where('status', 'holiday')->count(),
                ];
            });

        return Inertia::render('employee-attendances/reports/index', [
            'report' => $report,
            'filters' => [
                'search' => $search,
                'month' => $month,
            ],
        ]);
    }

    /**
     * Display the detailed daily attendance list of a specific employee for a given month.
     */
    public function show(Request $request, Employee $employee): Response
    {
        $month = $request->input('month', now()->format('Y-m'));

        if (! preg_match('/^\d{4}-\d{2}$/', $month)) {
            $month = now()->format('Y-m');
        }

        [$year, $m] = explode('-', $month);

        $attendances = EmployeeAttendance::where('employee_id', $employee->id)
            ->whereYear('date', $year)
            ->whereMonth('date', $m)
            ->orderBy('date', 'asc')
            ->get();

        return Inertia::render('employee-attendances/reports/show', [
            'employee' => $employee->only(['id', 'name', 'emp_number']),
            'attendances' => $attendances,
            'filters' => [
                'month' => $month,
            ],
        ]);
    }
}
