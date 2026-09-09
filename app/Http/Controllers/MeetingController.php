<?php

namespace App\Http\Controllers;

use App\Http\Requests\MeetingStoreRequest;
use App\Http\Requests\MeetingUpdateRequest;
use App\Models\Committee;
use App\Models\Employee;
use App\Models\Meeting;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MeetingController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:meeting.view|meeting.manage')->only(['index', 'show', 'create', 'edit']);
        $this->middleware('permission:meeting.manage')->only(['store', 'update', 'destroy']);
    }

    public function index(Request $request): Response
    {
        $meetings = Meeting::with(['committee', 'organizer', 'chairman', 'room'])->get();
        $employees = Employee::all(['id', 'name']);
        $rooms = Room::all(['id', 'name']);
        $committees = Committee::all(['id', 'title']);
        $users = User::all(['id', 'name', 'email']);

        return Inertia::render('meetings/index', [
            'meetings' => $meetings,
            'employees' => $employees,
            'rooms' => $rooms,
            'committees' => $committees,
            'users' => $users,
        ]);
    }

    public function create(Request $request): Response
    {
        $employees = Employee::all(['id', 'name']);
        $rooms = Room::all(['id', 'name']);
        $committees = Committee::all(['id', 'title']);
        $users = User::all(['id', 'name', 'email']);

        return Inertia::render('meetings/create', [
            'employees' => $employees,
            'rooms' => $rooms,
            'committees' => $committees,
            'users' => $users,
        ]);
    }

    public function store(MeetingStoreRequest $request): RedirectResponse
    {
        $meeting = Meeting::create($request->validated());

        $request->session()->flash('meeting.id', $meeting->id);

        return redirect()->route('meetings.index')->with('success', 'Meeting created successfully.');
    }

    public function show(Request $request, Meeting $meeting): Response
    {
        $meeting->load([
            'committee',
            'organizer',
            'chairman',
            'room',
            'meetingParticipants.user',
            'meetingExternalParticipants',
            'meetingMinutes.preparedBy',
            'meetingMinutes.approvedBy',
            'meetingDocuments.uploadedBy',
            'meetingRefreshmentRequests.meetingRefreshmentItems',
            'meetingActionItems.assignedTo',
        ]);

        $employees = Employee::all(['id', 'name']);
        $rooms = Room::all(['id', 'name']);
        $committees = Committee::all(['id', 'title']);
        $users = User::all(['id', 'name', 'email']);

        return Inertia::render('meetings/show', [
            'meeting' => $meeting,
            'employees' => $employees,
            'rooms' => $rooms,
            'committees' => $committees,
            'users' => $users,
        ]);
    }

    public function edit(Request $request, Meeting $meeting): Response
    {
        $employees = Employee::all(['id', 'name']);
        $rooms = Room::all(['id', 'name']);
        $committees = Committee::all(['id', 'title']);
        $users = User::all(['id', 'name', 'email']);

        return Inertia::render('meetings/edit', [
            'meeting' => $meeting,
            'employees' => $employees,
            'rooms' => $rooms,
            'committees' => $committees,
            'users' => $users,
        ]);
    }

    public function update(MeetingUpdateRequest $request, Meeting $meeting): RedirectResponse
    {
        $meeting->update($request->validated());

        $request->session()->flash('meeting.id', $meeting->id);

        return redirect()->route('meetings.index')->with('success', 'Meeting updated successfully.');
    }

    public function destroy(Request $request, Meeting $meeting): RedirectResponse
    {
        $meeting->delete();

        return redirect()->route('meetings.index')->with('success', 'Meeting deleted successfully.');
    }
}
