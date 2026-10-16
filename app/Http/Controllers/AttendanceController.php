<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAttendanceRequest;
use App\Http\Requests\UpdateAttendanceRequest;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Period;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $periodId = $request->input('period_id');
        $month = $request->input('month');

        $attendances = Attendance::with(['employee:id,name,emp_number', 'period:id,name,year'])
            ->when($search, function ($query, $search) {
                $query->whereHas('employee', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('emp_number', 'like', "%{$search}%");
                });
            })
            ->when($periodId, fn ($query, $periodId) => $query->where('period_id', $periodId))
            ->when($month, fn ($query, $month) => $query->where('month', $month))
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('attendances/index', [
            'attendances' => $attendances,
            'periods' => $this->periods(),
            'filters' => [
                'search' => $search,
                'period_id' => $periodId,
                'month' => $month,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('attendances/create', [
            'employees' => $this->employees(),
            'periods' => $this->periods(),
        ]);
    }

    public function store(StoreAttendanceRequest $request): RedirectResponse
    {
        Attendance::create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
        ]);

        return redirect()->route('attendances.index')
            ->with('success', __('Attendance record created successfully.'));
    }

    public function show(Attendance $attendance): Response
    {
        return Inertia::render('attendances/show', [
            'attendance' => $attendance->load([
                'employee:id,name,emp_number',
                'period:id,name,year',
                'creator:id,name',
            ]),
        ]);
    }

    public function edit(Attendance $attendance): Response
    {
        return Inertia::render('attendances/edit', [
            'attendance' => $attendance,
            'employees' => $this->employees(),
            'periods' => $this->periods(),
        ]);
    }

    public function update(UpdateAttendanceRequest $request, Attendance $attendance): RedirectResponse
    {
        $attendance->update($request->validated());

        return redirect()->route('attendances.index')
            ->with('success', __('Attendance record updated successfully.'));
    }

    public function destroy(Attendance $attendance): RedirectResponse
    {
        $attendance->delete();

        return redirect()->route('attendances.index')
            ->with('success', __('Attendance record deleted successfully.'));
    }

    /**
     * @return Collection<int, Employee>
     */
    private function employees(): Collection
    {
        return Employee::orderBy('name')->get(['id', 'name', 'emp_number']);
    }

    /**
     * @return Collection<int, Period>
     */
    private function periods(): Collection
    {
        return Period::with('months:id,period_id,month')
            ->orderByDesc('year')
            ->orderByDesc('no')
            ->get(['id', 'name', 'year']);
    }
}
