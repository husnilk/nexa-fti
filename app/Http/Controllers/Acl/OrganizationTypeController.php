<?php

namespace App\Http\Controllers\Acl;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrganizationTypeRequest;
use App\Http\Requests\UpdateOrganizationTypeRequest;
use App\Models\OrganizationType;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationTypeController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:organization.manage');
    }

    public function index(): Response
    {
        $search = request('search');

        return Inertia::render('organization-types/index', [
            'organizationTypes' => OrganizationType::query()
                ->when($search, function ($query, $search) {
                    $query->where('name', 'like', "%{$search}%");
                })
                ->orderBy('level')
                ->orderBy('name')
                ->get(),
            'filters' => ['search' => $search],
        ]);
    }

    public function store(StoreOrganizationTypeRequest $request): RedirectResponse
    {
        OrganizationType::query()->create($request->validated());

        return redirect()->route('organization-types.index');
    }

    public function update(UpdateOrganizationTypeRequest $request, OrganizationType $organizationType): RedirectResponse
    {
        $organizationType->update($request->validated());

        return redirect()->route('organization-types.index');
    }

    public function destroy(OrganizationType $organizationType): RedirectResponse
    {
        $organizationType->delete();

        return redirect()->route('organization-types.index');
    }
}
