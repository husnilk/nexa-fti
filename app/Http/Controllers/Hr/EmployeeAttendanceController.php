<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Http\Requests\EmployeeAttendanceStoreRequest;
use App\Http\Requests\EmployeeAttendanceUpdateRequest;
use App\Models\Employee;
use App\Models\EmployeeAttendance;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeAttendanceController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:hr.view')->only(['index', 'show']);
        $this->middleware('permission:hr.manage')->only(['create', 'store', 'edit', 'update', 'destroy']);
    }

    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $date = $request->input('date', now()->toDateString());

        $employeeAttendances = EmployeeAttendance::with('employee')
            ->when($search, function ($query, $search) {
                $query->whereHas('employee', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('emp_number', 'like', "%{$search}%");
                });
            })
            ->when($date, function ($query, $date) {
                $query->whereDate('date', $date);
            })
            ->latest()
            ->get();

        return Inertia::render('employee-attendances/index', [
            'attendances' => $employeeAttendances,
            'filters' => [
                'search' => $search,
                'date' => $date,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('employee-attendances/create', [
            'employees' => Employee::all(['id', 'name', 'emp_number']),
        ]);
    }

    public function store(EmployeeAttendanceStoreRequest $request): RedirectResponse
    {
        EmployeeAttendance::create($request->validated());

        return redirect()->route('employee-attendances.index')
            ->with('success', 'Attendance record created successfully.');
    }

    public function show(EmployeeAttendance $employeeAttendance): Response
    {
        return Inertia::render('employee-attendances/show', [
            'attendance' => $employeeAttendance->load('employee'),
        ]);
    }

    public function edit(EmployeeAttendance $employeeAttendance): Response
    {
        return Inertia::render('employee-attendances/edit', [
            'attendance' => $employeeAttendance,
            'employees' => Employee::all(['id', 'name', 'emp_number']),
        ]);
    }

    public function update(EmployeeAttendanceUpdateRequest $request, EmployeeAttendance $employeeAttendance): RedirectResponse
    {
        $employeeAttendance->update($request->validated());

        return redirect()->route('employee-attendances.index')
            ->with('success', 'Attendance record updated successfully.');
    }

    public function destroy(EmployeeAttendance $employeeAttendance): RedirectResponse
    {
        $employeeAttendance->delete();

        return redirect()->route('employee-attendances.index')
            ->with('success', 'Attendance record deleted successfully.');
    }
}
