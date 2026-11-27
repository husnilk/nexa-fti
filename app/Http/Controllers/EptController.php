<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEptRequest;
use App\Http\Requests\UpdateEptRequest;
use App\Models\Employee;
use App\Models\Ept;
use App\Models\Period;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EptController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $periodId = $request->input('period_id');
        $status = $request->input('status');

        $epts = Ept::with([
            'employee:id,name,emp_number',
            'period:id,name,year',
            'appraiser:id,name',
        ])
            ->when($search, function ($query, $search) {
                $query->whereHas('employee', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('emp_number', 'like', "%{$search}%");
                });
            })
            ->when($periodId, fn ($query, $periodId) => $query->where('period_id', $periodId))
            ->when($status !== null && $status !== '', fn ($query) => $query->where('status', $status))
            ->orderByDesc('year')
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('epts/index', [
            'epts' => $epts,
            'employees' => Employee::orderBy('name')->get(['id', 'name', 'emp_number']),
            'periods' => Period::orderByDesc('year')->orderByDesc('no')->get(['id', 'name', 'year']),
            'filters' => [
                'search' => $search,
                'period_id' => $periodId,
                'status' => $status,
            ],
        ]);
    }

    public function store(StoreEptRequest $request): RedirectResponse
    {
        Ept::create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
            'updated_by' => $request->user()->id,
        ]);

        return back()->with('success', __('Performance target created successfully.'));
    }

    public function show(Ept $ept): Response
    {
        return Inertia::render('epts/show', [
            'ept' => $ept->load([
                'employee:id,name,emp_number',
                'period:id,name,year',
                'appraiser:id,name,emp_number',
                'superiorAppraiser:id,name,emp_number',
                'creator:id,name',
                'updater:id,name',
            ]),
        ]);
    }

    public function update(UpdateEptRequest $request, Ept $ept): RedirectResponse
    {
        $ept->update([
            ...$request->validated(),
            'updated_by' => $request->user()->id,
        ]);

        return back()->with('success', __('Performance target updated successfully.'));
    }

    public function destroy(Ept $ept): RedirectResponse
    {
        $ept->delete();

        return redirect()->route('epts.index')
            ->with('success', __('Performance target deleted successfully.'));
    }
}
