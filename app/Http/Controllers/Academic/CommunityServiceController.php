<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use App\Http\Requests\CommunityServiceStoreRequest;
use App\Http\Requests\CommunityServiceUpdateRequest;
use App\Models\CommunityService;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommunityServiceController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:community_service.view')->only(['index', 'show']);
        $this->middleware('permission:community_service.manage')->only(['create', 'store', 'edit', 'update', 'destroy']);
    }

    public function index(Request $request): Response
    {
        $communityServices = CommunityService::withCount('communityServiceMembers')->get();

        return Inertia::render('community-service/index', [
            'communityServices' => $communityServices,
        ]);
    }

    public function store(CommunityServiceStoreRequest $request): RedirectResponse
    {
        CommunityService::create($request->validated());

        return redirect()->route('community-services.index')->with('success', 'Community service created successfully.');
    }

    public function show(Request $request, CommunityService $communityService): Response
    {
        $communityService->load(['communityServiceMembers.user']);
        $users = User::all(['id', 'name']);

        return Inertia::render('community-service/show', [
            'communityService' => $communityService,
            'users' => $users,
        ]);
    }

    public function update(CommunityServiceUpdateRequest $request, CommunityService $communityService): RedirectResponse
    {
        $communityService->update($request->validated());

        return redirect()->route('community-services.index')->with('success', 'Community service updated successfully.');
    }

    public function destroy(Request $request, CommunityService $communityService): RedirectResponse
    {
        $communityService->delete();

        return redirect()->route('community-services.index')->with('success', 'Community service deleted successfully.');
    }
}
