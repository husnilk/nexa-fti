<?php

namespace App\Http\Controllers;

use App\Http\Requests\MeetingParticipantStoreRequest;
use App\Http\Requests\MeetingParticipantUpdateRequest;
use App\Models\MeetingParticipant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MeetingParticipantController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:meeting.view|meeting.manage')->only(['index', 'show', 'create', 'edit']);
        $this->middleware('permission:meeting.manage')->only(['store', 'update', 'destroy']);
    }

    public function index(Request $request): Response
    {
        $meetingParticipants = MeetingParticipant::with(['meeting', 'user'])->get();

        return Inertia::render('meetings/participants/index', [
            'meetingParticipants' => $meetingParticipants,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('meetings/participants/create');
    }

    public function store(MeetingParticipantStoreRequest $request): RedirectResponse
    {
        $meetingParticipant = MeetingParticipant::create($request->validated());

        $request->session()->flash('meetingParticipant.id', $meetingParticipant->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Participant added successfully.');
        }

        return redirect()->route('meeting-participants.index')->with('success', 'Participant added successfully.');
    }

    public function show(Request $request, MeetingParticipant $meetingParticipant): Response
    {
        $meetingParticipant->load(['meeting', 'user']);

        return Inertia::render('meetings/participants/show', [
            'meetingParticipant' => $meetingParticipant,
        ]);
    }

    public function edit(Request $request, MeetingParticipant $meetingParticipant): Response
    {
        return Inertia::render('meetings/participants/edit', [
            'meetingParticipant' => $meetingParticipant,
        ]);
    }

    public function update(MeetingParticipantUpdateRequest $request, MeetingParticipant $meetingParticipant): RedirectResponse
    {
        $meetingParticipant->update($request->validated());

        $request->session()->flash('meetingParticipant.id', $meetingParticipant->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Participant updated successfully.');
        }

        return redirect()->route('meeting-participants.index')->with('success', 'Participant updated successfully.');
    }

    public function destroy(Request $request, MeetingParticipant $meetingParticipant): RedirectResponse
    {
        $meetingParticipant->delete();

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Participant removed successfully.');
        }

        return redirect()->route('meeting-participants.index')->with('success', 'Participant removed successfully.');
    }
}
