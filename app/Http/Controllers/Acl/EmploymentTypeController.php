<?php

namespace App\Http\Controllers\Acl;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmploymentTypeRequest;
use App\Http\Requests\UpdateEmploymentTypeRequest;
use App\Models\EmployeeType;
use App\Models\EmploymentContract;
use App\Models\EmploymentType;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EmploymentTypeController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:employment.view')->only('index');
        $this->middleware('permission:employment.manage')->only(['store', 'update', 'destroy']);
    }

    public function index(): Response
    {
        $search = request('search');

        return Inertia::render('employment-types/index', [
            'employmentTypes' => EmploymentType::with(['employeeType', 'employmentContract'])
                ->when($search, function ($query, $search) {
                    $query->whereHas('employeeType', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })->orWhereHas('employmentContract', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
                })
                ->latest()
                ->get(),
            'employeeTypes' => EmployeeType::all(),
            'employmentContracts' => EmploymentContract::all(),
            'filters' => ['search' => $search],
        ]);
    }

    public function store(StoreEmploymentTypeRequest $request): RedirectResponse
    {
        EmploymentType::create($request->validated());

        return redirect()->route('employment-types.index');
    }

    public function update(UpdateEmploymentTypeRequest $request, EmploymentType $employmentType): RedirectResponse
    {
        $employmentType->update($request->validated());

        return redirect()->route('employment-types.index');
    }

    public function destroy(EmploymentType $employmentType): RedirectResponse
    {
        $employmentType->delete();

        return redirect()->route('employment-types.index');
    }
}
