<?php

namespace App\Http\Controllers\Acl;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmployeeTypeRequest;
use App\Http\Requests\UpdateEmployeeTypeRequest;
use App\Models\EmployeeType;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeTypeController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:employment.view')->only('index');
        $this->middleware('permission:employment.manage')->only(['store', 'update', 'destroy']);
    }

    public function index(): Response
    {
        $search = request('search');

        return Inertia::render('employee-types/index', [
            'employeeTypes' => EmployeeType::query()
                ->when($search, function ($query, $search) {
                    $query->where('name', 'like', "%{$search}%");
                })
                ->latest()
                ->get(),
            'filters' => ['search' => $search],
        ]);
    }

    public function store(StoreEmployeeTypeRequest $request): RedirectResponse
    {
        EmployeeType::create($request->validated());

        return redirect()->route('employee-types.index');
    }

    public function update(UpdateEmployeeTypeRequest $request, EmployeeType $employeeType): RedirectResponse
    {
        $employeeType->update($request->validated());

        return redirect()->route('employee-types.index');
    }

    public function destroy(EmployeeType $employeeType): RedirectResponse
    {
        $employeeType->delete();

        return redirect()->route('employee-types.index');
    }
}
