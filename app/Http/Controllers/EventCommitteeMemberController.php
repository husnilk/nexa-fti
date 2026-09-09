<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventCommitteeMemberStoreRequest;
use App\Http\Requests\EventCommitteeMemberUpdateRequest;
use App\Models\EventCommitteeMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class EventCommitteeMemberController extends Controller
{
    public function index(Request $request): View
    {
        $eventCommitteeMembers = EventCommitteeMember::all();

        return view('eventCommitteeMember.index', [
            'eventCommitteeMembers' => $eventCommitteeMembers,
        ]);
    }

    public function create(Request $request): View
    {
        return view('eventCommitteeMember.create');
    }

    public function store(EventCommitteeMemberStoreRequest $request): RedirectResponse
    {
        $eventCommitteeMember = EventCommitteeMember::create($request->validated());

        $request->session()->flash('eventCommitteeMember.id', $eventCommitteeMember->id);

        return redirect()->route('event-committee-members.index');
    }

    public function show(Request $request, EventCommitteeMember $eventCommitteeMember): View
    {
        return view('eventCommitteeMember.show', [
            'eventCommitteeMember' => $eventCommitteeMember,
        ]);
    }

    public function edit(Request $request, EventCommitteeMember $eventCommitteeMember): View
    {
        return view('eventCommitteeMember.edit', [
            'eventCommitteeMember' => $eventCommitteeMember,
        ]);
    }

    public function update(EventCommitteeMemberUpdateRequest $request, EventCommitteeMember $eventCommitteeMember): RedirectResponse
    {
        $eventCommitteeMember->update($request->validated());

        $request->session()->flash('eventCommitteeMember.id', $eventCommitteeMember->id);

        return redirect()->route('event-committee-members.index');
    }

    public function destroy(Request $request, EventCommitteeMember $eventCommitteeMember): RedirectResponse
    {
        $eventCommitteeMember->delete();

        return redirect()->route('event-committee-members.index');
    }
}
