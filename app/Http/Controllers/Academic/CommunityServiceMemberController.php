<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use App\Http\Requests\CommunityServiceMemberStoreRequest;
use App\Http\Requests\CommunityServiceMemberUpdateRequest;
use App\Models\CommunityServiceMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CommunityServiceMemberController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:community_service.manage');
    }

    public function store(CommunityServiceMemberStoreRequest $request): RedirectResponse
    {
        CommunityServiceMember::create($request->validated());

        return back()->with('success', 'Member added successfully.');
    }

    public function update(CommunityServiceMemberUpdateRequest $request, CommunityServiceMember $communityServiceMember): RedirectResponse
    {
        $communityServiceMember->update($request->validated());

        return back()->with('success', 'Member updated successfully.');
    }

    public function destroy(Request $request, CommunityServiceMember $communityServiceMember): RedirectResponse
    {
        $communityServiceMember->delete();

        return back()->with('success', 'Member removed successfully.');
    }
}
