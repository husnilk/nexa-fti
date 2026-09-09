<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Models\EmployeeRank;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeRankController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:hr.view')->only(['index']);
        $this->middleware('permission:hr.manage')->only(['store', 'update', 'destroy']);
    }

    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $ranks = EmployeeRank::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            })
            ->orderBy('order', 'asc')
            ->get();

        return Inertia::render('hr/employee-ranks/index', [
            'ranks' => $ranks,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:employee_ranks,code'],
            'name' => ['required', 'string', 'max:255'],
            'order' => ['required', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
        ]);

        EmployeeRank::create($validated);

        return redirect()->route('employee-ranks.index')
            ->with('success', 'Employee rank created successfully.');
    }

    public function update(Request $request, EmployeeRank $employeeRank): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:employee_ranks,code,'.$employeeRank->id],
            'name' => ['required', 'string', 'max:255'],
            'order' => ['required', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
        ]);

        $employeeRank->update($validated);

        return redirect()->route('employee-ranks.index')
            ->with('success', 'Employee rank updated successfully.');
    }

    public function destroy(EmployeeRank $employeeRank): RedirectResponse
    {
        if ($employeeRank->histories()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete employee rank because it has rank histories associated.');
        }

        $employeeRank->delete();

        return redirect()->route('employee-ranks.index')
            ->with('success', 'Employee rank deleted successfully.');
    }
}
