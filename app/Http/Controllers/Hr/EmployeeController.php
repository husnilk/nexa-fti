<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Models\EmployeeRank;
use App\Models\EmploymentType;
use App\Models\FunctionalPosition;
use App\Models\Lecturer;
use App\Models\Position;
use App\Models\PositionNomenclatureClassification;
use App\Models\Role;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:hr.view')->only(['index', 'show']);
        $this->middleware('permission:hr.manage')->only(['create', 'store', 'edit', 'update', 'destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $search = request('search');

        return Inertia::render('employees/index', [
            'employees' => Employee::query()
                ->with(['employmentType.employeeType', 'employmentType.employmentContract', 'lecturer', 'staff'])
                ->when($search, function ($query, $search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('emp_number', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })
                ->latest()
                ->get(),
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('employees/create', [
            'employmentTypes' => EmploymentType::with(['employeeType', 'employmentContract'])->get(),
            'functionalPositions' => FunctionalPosition::all(),
            'positions' => Position::all(),
            'supervisors' => Employee::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEmployeeRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make('password'), // Default password
                'is_active' => $request->status == 1,
            ]);

            $user->assignRole(Role::findOrCreate('user', 'web'));

            $employee = Employee::create([
                'id' => $user->id,
                'emp_number' => $request->emp_number,
                'id_card_number' => $request->id_card_number,
                'tax_id_number' => $request->tax_id_number,
                'name' => $request->name,
                'birth_place' => $request->birth_place,
                'birth_date' => $request->birth_date,
                'gender' => $request->gender,
                'religion' => $request->religion,
                'marital_status' => $request->marital_status,
                'address' => $request->address,
                'phone' => $request->phone,
                'email' => $request->email,
                'join_date' => $request->join_date,
                'employment_type_id' => $request->employment_type_id,
                'supervisor_id' => $request->supervisor_id,
                'status' => $request->status,
            ]);

            if ($request->specialization === 'lecturer') {
                Lecturer::create([
                    'id' => $employee->id,
                    'academic_rank' => $request->academic_rank,
                    'functional_position_id' => $request->functional_position_id,
                    'nuptk' => $request->nuptk,
                    'expertise' => $request->expertise,
                ]);
            } else {
                Staff::create([
                    'id' => $employee->id,
                    'position_id' => $request->position_id,
                    'skills' => $request->skills,
                ]);
            }
        });

        return redirect()->route('employees.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Employee $employee): Response
    {
        return Inertia::render('employees/show', [
            'employee' => $employee->load([
                'user', 'employmentType.employeeType', 'employmentType.employmentContract',
                'supervisor', 'lecturer.functionalPosition', 'staff.position',
                'positionHistories.position', 'educationHistories', 'certifications',
                'lecturer.functionalPositionHistories.functionalPosition',
                'staff.nomenclatureClassificationHistories.nomenclatureClassification',
                'familyMembers',
                'rankHistories.rank',
            ]),
            'positions' => Position::all(),
            'functionalPositions' => FunctionalPosition::all(),
            'nomenclatureClassifications' => PositionNomenclatureClassification::all(),
            'ranks' => EmployeeRank::orderBy('order')->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Employee $employee): Response
    {
        return Inertia::render('employees/edit', [
            'employee' => $employee->load(['lecturer', 'staff']),
            'employmentTypes' => EmploymentType::with(['employeeType', 'employmentContract'])->get(),
            'functionalPositions' => FunctionalPosition::all(),
            'positions' => Position::all(),
            'supervisors' => Employee::where('id', '!=', $employee->id)->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEmployeeRequest $request, Employee $employee): RedirectResponse
    {
        DB::transaction(function () use ($request, $employee) {
            $employee->update($request->validated());
            $employee->user->update([
                'name' => $request->name,
                'email' => $request->email,
                'is_active' => $request->status == 1,
            ]);

            if ($employee->lecturer) {
                $employee->lecturer->update($request->only(['academic_rank', 'functional_position_id', 'nuptk', 'expertise']));
            } elseif ($employee->staff) {
                $employee->staff->update($request->only(['position_id', 'skills']));
            }
        });

        return redirect()->route('employees.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $employee): RedirectResponse
    {
        DB::transaction(function () use ($employee) {
            // User delete will cascade to employee and specialization
            $employee->user->delete();
        });

        return redirect()->route('employees.index');
    }
}
