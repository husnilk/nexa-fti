<?php

namespace App\Http\Controllers\Acl;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmploymentContractRequest;
use App\Http\Requests\UpdateEmploymentContractRequest;
use App\Models\EmploymentContract;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EmploymentContractController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:employment.view')->only('index');
        $this->middleware('permission:employment.manage')->only(['store', 'update', 'destroy']);
    }

    public function index(): Response
    {
        $search = request('search');

        return Inertia::render('employment-contracts/index', [
            'employmentContracts' => EmploymentContract::query()
                ->when($search, function ($query, $search) {
                    $query->where('name', 'like', "%{$search}%");
                })
                ->latest()
                ->get(),
            'filters' => ['search' => $search],
        ]);
    }

    public function store(StoreEmploymentContractRequest $request): RedirectResponse
    {
        EmploymentContract::create($request->validated());

        return redirect()->route('employment-contracts.index');
    }

    public function update(UpdateEmploymentContractRequest $request, EmploymentContract $employmentContract): RedirectResponse
    {
        $employmentContract->update($request->validated());

        return redirect()->route('employment-contracts.index');
    }

    public function destroy(EmploymentContract $employmentContract): RedirectResponse
    {
        $employmentContract->delete();

        return redirect()->route('employment-contracts.index');
    }
}
