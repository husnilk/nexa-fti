<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreValidatorRequest;
use App\Http\Requests\UpdateValidatorRequest;
use App\Models\Employee;
use App\Models\Organization;
use App\Models\Period;
use App\Models\Validator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Validators for the currently active period. The period is never chosen by the user.
 */
class ValidatorController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $organizationId = $request->input('organization_id');
        $period = Period::active();

        $validators = Validator::with(['employee:id,name,emp_number', 'organization:id,name'])
            ->where('period_id', $period?->id)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->whereHas('employee', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('emp_number', 'like', "%{$search}%");
                    })->orWhereHas('organization', fn ($q) => $q->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($organizationId, fn ($query, $organizationId) => $query->where('organization_id', $organizationId))
            ->orderBy('position')
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('validators/index', [
            'activePeriod' => $period?->only(['id', 'name', 'year']),
            'validators' => $validators,
            'employees' => Employee::orderBy('name')->get(['id', 'name', 'emp_number']),
            'organizations' => Organization::orderBy('name')->get(['id', 'name']),
            'filters' => [
                'search' => $search,
                'organization_id' => $organizationId,
            ],
        ]);
    }

    public function store(StoreValidatorRequest $request): RedirectResponse
    {
        $period = Period::active();

        if (! $period) {
            return back()->withErrors(['period' => __('There is no active period. Activate a period before adding validators.')]);
        }

        Validator::create([
            ...$request->validated(),
            'is_active' => $request->boolean('is_active', true),
            'period_id' => $period->id,
        ]);

        return back()->with('success', __('Validator added successfully.'));
    }

    public function update(UpdateValidatorRequest $request, Validator $validator): RedirectResponse
    {
        $validator->update([
            ...$request->validated(),
            'is_active' => $request->boolean('is_active'),
        ]);

        return back()->with('success', __('Validator updated successfully.'));
    }

    public function destroy(Validator $validator): RedirectResponse
    {
        $validator->delete();

        return back()->with('success', __('Validator removed successfully.'));
    }
}
