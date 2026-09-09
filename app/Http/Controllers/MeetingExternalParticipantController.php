<?php

namespace App\Http\Controllers;

use App\Http\Requests\MeetingExternalParticipantStoreRequest;
use App\Http\Requests\MeetingExternalParticipantUpdateRequest;
use App\Models\MeetingExternalParticipant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MeetingExternalParticipantController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:meeting.view|meeting.manage')->only(['index', 'show', 'create', 'edit']);
        $this->middleware('permission:meeting.manage')->only(['store', 'update', 'destroy']);
    }

    public function index(Request $request): Response
    {
        $meetingExternalParticipants = MeetingExternalParticipant::with(['meeting'])->get();

        return Inertia::render('meetings/external-participants/index', [
            'meetingExternalParticipants' => $meetingExternalParticipants,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('meetings/external-participants/create');
    }

    public function store(MeetingExternalParticipantStoreRequest $request): RedirectResponse
    {
        $meetingExternalParticipant = MeetingExternalParticipant::create($request->validated());

        $request->session()->flash('meetingExternalParticipant.id', $meetingExternalParticipant->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'External participant added successfully.');
        }

        return redirect()->route('meeting-external-participants.index')->with('success', 'External participant added successfully.');
    }

    public function show(Request $request, MeetingExternalParticipant $meetingExternalParticipant): Response
    {
        $meetingExternalParticipant->load(['meeting']);

        return Inertia::render('meetings/external-participants/show', [
            'meetingExternalParticipant' => $meetingExternalParticipant,
        ]);
    }

    public function edit(Request $request, MeetingExternalParticipant $meetingExternalParticipant): Response
    {
        return Inertia::render('meetings/external-participants/edit', [
            'meetingExternalParticipant' => $meetingExternalParticipant,
        ]);
    }

    public function update(MeetingExternalParticipantUpdateRequest $request, MeetingExternalParticipant $meetingExternalParticipant): RedirectResponse
    {
        $meetingExternalParticipant->update($request->validated());

        $request->session()->flash('meetingExternalParticipant.id', $meetingExternalParticipant->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'External participant updated successfully.');
        }

        return redirect()->route('meeting-external-participants.index')->with('success', 'External participant updated successfully.');
    }

    public function destroy(Request $request, MeetingExternalParticipant $meetingExternalParticipant): RedirectResponse
    {
        $meetingExternalParticipant->delete();

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'External participant removed successfully.');
        }

        return redirect()->route('meeting-external-participants.index')->with('success', 'External participant removed successfully.');
    }
}
