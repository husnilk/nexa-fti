<?php

namespace App\Http\Controllers\Acl;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrganizationPositionRequest;
use App\Http\Requests\UpdateOrganizationPositionRequest;
use App\Models\OrganizationPosition;
use Illuminate\Http\RedirectResponse;

class OrganizationPositionController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:organization.manage');
    }

    public function store(StoreOrganizationPositionRequest $request): RedirectResponse
    {
        $organizationPosition = OrganizationPosition::create($request->validated());

        return redirect()->route('organizations.show', $organizationPosition->organization_id);
    }

    public function update(UpdateOrganizationPositionRequest $request, OrganizationPosition $organizationPosition): RedirectResponse
    {
        $organizationPosition->update($request->validated());

        return redirect()->route('organizations.show', $organizationPosition->organization_id);
    }

    public function destroy(OrganizationPosition $organizationPosition): RedirectResponse
    {
        $organizationId = $organizationPosition->organization_id;
        $organizationPosition->delete();

        return redirect()->route('organizations.show', $organizationId);
    }
}
