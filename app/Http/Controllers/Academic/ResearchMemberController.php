<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use App\Http\Requests\ResearchMemberStoreRequest;
use App\Http\Requests\ResearchMemberUpdateRequest;
use App\Models\ResearchMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ResearchMemberController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:research.manage');
    }

    public function index(Request $request): Response
    {
        return Inertia::render('research/members/index', [
            'researchMembers' => ResearchMember::with(['research', 'user'])->get(),
        ]);
    }

    public function store(ResearchMemberStoreRequest $request): RedirectResponse
    {
        ResearchMember::create($request->validated());

        return back()->with('success', 'Member added successfully.');
    }

    public function update(ResearchMemberUpdateRequest $request, ResearchMember $researchMember): RedirectResponse
    {
        $researchMember->update($request->validated());

        return back()->with('success', 'Member updated successfully.');
    }

    public function destroy(Request $request, ResearchMember $researchMember): RedirectResponse
    {
        $researchMember->delete();

        return back()->with('success', 'Member removed successfully.');
    }
}
