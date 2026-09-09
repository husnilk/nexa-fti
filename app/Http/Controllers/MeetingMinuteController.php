<?php

namespace App\Http\Controllers;

use App\Http\Requests\MeetingMinuteStoreRequest;
use App\Http\Requests\MeetingMinuteUpdateRequest;
use App\Models\MeetingMinute;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MeetingMinuteController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:meeting.view|meeting.manage')->only(['index', 'show', 'create', 'edit']);
        $this->middleware('permission:meeting.manage')->only(['store', 'update', 'destroy']);
    }

    public function index(Request $request): Response
    {
        $meetingMinutes = MeetingMinute::with(['meeting', 'preparedBy', 'approvedBy'])->get();

        return Inertia::render('meetings/minutes/index', [
            'meetingMinutes' => $meetingMinutes,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('meetings/minutes/create');
    }

    public function store(MeetingMinuteStoreRequest $request): RedirectResponse
    {
        $meetingMinute = MeetingMinute::create($request->validated());

        $request->session()->flash('meetingMinute.id', $meetingMinute->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Meeting minutes created successfully.');
        }

        return redirect()->route('meeting-minutes.index')->with('success', 'Meeting minutes created successfully.');
    }

    public function show(Request $request, MeetingMinute $meetingMinute): Response
    {
        $meetingMinute->load(['meeting', 'preparedBy', 'approvedBy']);

        return Inertia::render('meetings/minutes/show', [
            'meetingMinute' => $meetingMinute,
        ]);
    }

    public function edit(Request $request, MeetingMinute $meetingMinute): Response
    {
        return Inertia::render('meetings/minutes/edit', [
            'meetingMinute' => $meetingMinute,
        ]);
    }

    public function update(MeetingMinuteUpdateRequest $request, MeetingMinute $meetingMinute): RedirectResponse
    {
        $meetingMinute->update($request->validated());

        $request->session()->flash('meetingMinute.id', $meetingMinute->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Meeting minutes updated successfully.');
        }

        return redirect()->route('meeting-minutes.index')->with('success', 'Meeting minutes updated successfully.');
    }

    public function destroy(Request $request, MeetingMinute $meetingMinute): RedirectResponse
    {
        $meetingMinute->delete();

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Meeting minutes deleted successfully.');
        }

        return redirect()->route('meeting-minutes.index')->with('success', 'Meeting minutes deleted successfully.');
    }
}
