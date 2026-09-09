<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommitteeMemberStoreRequest;
use App\Http\Requests\CommitteeMemberUpdateRequest;
use App\Models\CommitteeMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommitteeMemberController extends Controller
{
    public function index(Request $request): Response
    {
        $committeeMembers = CommitteeMember::with(['committee', 'user', 'supervisor'])->get();

        return Inertia::render('committees/members/index', [
            'committeeMembers' => $committeeMembers,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('committees/members/create');
    }

    public function store(CommitteeMemberStoreRequest $request): RedirectResponse
    {
        $committeeMember = CommitteeMember::create($request->validated());

        $request->session()->flash('committeeMember.id', $committeeMember->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee member created successfully.');
        }

        return redirect()->route('committee-members.index')->with('success', 'Committee member created successfully.');
    }

    public function show(Request $request, CommitteeMember $committeeMember): Response
    {
        $committeeMember->load(['committee', 'user', 'supervisor']);

        return Inertia::render('committees/members/show', [
            'committeeMember' => $committeeMember,
        ]);
    }

    public function edit(Request $request, CommitteeMember $committeeMember): Response
    {
        return Inertia::render('committees/members/edit', [
            'committeeMember' => $committeeMember,
        ]);
    }

    public function update(CommitteeMemberUpdateRequest $request, CommitteeMember $committeeMember): RedirectResponse
    {
        $committeeMember->update($request->validated());

        $request->session()->flash('committeeMember.id', $committeeMember->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee member updated successfully.');
        }

        return redirect()->route('committee-members.index')->with('success', 'Committee member updated successfully.');
    }

    public function destroy(Request $request, CommitteeMember $committeeMember): RedirectResponse
    {
        $committeeMember->delete();

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee member deleted successfully.');
        }

        return redirect()->route('committee-members.index')->with('success', 'Committee member deleted successfully.');
    }
}
