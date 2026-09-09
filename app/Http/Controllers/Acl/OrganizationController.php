<?php

namespace App\Http\Controllers\Acl;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrganizationRequest;
use App\Http\Requests\UpdateOrganizationRequest;
use App\Models\Organization;
use App\Models\OrganizationType;
use App\Models\Position;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:organization.view')->only(['index', 'show']);
        $this->middleware('permission:organization.manage')->only(['store', 'update', 'destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $search = request('search');

        return Inertia::render('organizations/index', [
            'organizations' => Organization::query()
                ->with(['parent', 'organizationType'])
                ->when($search, function ($query, $search) {
                    $query->where(function ($organizationQuery) use ($search) {
                        $organizationQuery
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('code', 'like', "%{$search}%")
                            ->orWhereHas('organizationType', function ($organizationTypeQuery) use ($search) {
                                $organizationTypeQuery->where('name', 'like', "%{$search}%");
                            });
                    });
                })
                ->latest()
                ->get(),
            'parentOrganizations' => Organization::all(),
            'organizationTypes' => OrganizationType::query()
                ->orderBy('level')
                ->orderBy('name')
                ->get(['id', 'name', 'level']),
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Organization $organization): Response
    {
        return Inertia::render('organizations/show', [
            'organization' => $organization->load([
                'parent',
                'parent.organizationType',
                'organizationType',
                'children',
                'children.organizationType',
                'organizationPositions.position',
            ]),
            'availablePositions' => Position::query()
                ->orderBy('name')
                ->get(['id', 'name', 'grade', 'job_value', 'cg', 'skp_point', 'is_active']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrganizationRequest $request): RedirectResponse
    {
        Organization::create($request->validated());

        return redirect()->route('organizations.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrganizationRequest $request, Organization $organization): RedirectResponse
    {
        $organization->update($request->validated());

        return redirect()->route('organizations.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization): RedirectResponse
    {
        $organization->delete();

        return redirect()->route('organizations.index');
    }
}
