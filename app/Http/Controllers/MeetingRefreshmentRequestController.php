<?php

namespace App\Http\Controllers;

use App\Http\Requests\MeetingRefreshmentRequestStoreRequest;
use App\Http\Requests\MeetingRefreshmentRequestUpdateRequest;
use App\Models\MeetingRefreshmentRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MeetingRefreshmentRequestController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:meeting.view|meeting.manage')->only(['index', 'show', 'create', 'edit']);
        $this->middleware('permission:meeting.manage')->only(['store', 'update', 'destroy']);
    }

    public function index(Request $request): Response
    {
        $meetingRefreshmentRequests = MeetingRefreshmentRequest::with(['meeting', 'requestedBy', 'approvedBy', 'meetingRefreshmentItems'])->get();

        return Inertia::render('meetings/refreshment-requests/index', [
            'meetingRefreshmentRequests' => $meetingRefreshmentRequests,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('meetings/refreshment-requests/create');
    }

    public function store(MeetingRefreshmentRequestStoreRequest $request): RedirectResponse
    {
        $meetingRefreshmentRequest = MeetingRefreshmentRequest::create($request->validated());

        $request->session()->flash('meetingRefreshmentRequest.id', $meetingRefreshmentRequest->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Refreshment request created successfully.');
        }

        return redirect()->route('meeting-refreshment-requests.index')->with('success', 'Refreshment request created successfully.');
    }

    public function show(Request $request, MeetingRefreshmentRequest $meetingRefreshmentRequest): Response
    {
        $meetingRefreshmentRequest->load(['meeting', 'requestedBy', 'approvedBy', 'meetingRefreshmentItems']);

        return Inertia::render('meetings/refreshment-requests/show', [
            'meetingRefreshmentRequest' => $meetingRefreshmentRequest,
        ]);
    }

    public function edit(Request $request, MeetingRefreshmentRequest $meetingRefreshmentRequest): Response
    {
        return Inertia::render('meetings/refreshment-requests/edit', [
            'meetingRefreshmentRequest' => $meetingRefreshmentRequest,
        ]);
    }

    public function update(MeetingRefreshmentRequestUpdateRequest $request, MeetingRefreshmentRequest $meetingRefreshmentRequest): RedirectResponse
    {
        $meetingRefreshmentRequest->update($request->validated());

        $request->session()->flash('meetingRefreshmentRequest.id', $meetingRefreshmentRequest->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Refreshment request updated successfully.');
        }

        return redirect()->route('meeting-refreshment-requests.index')->with('success', 'Refreshment request updated successfully.');
    }

    public function destroy(Request $request, MeetingRefreshmentRequest $meetingRefreshmentRequest): RedirectResponse
    {
        $meetingRefreshmentRequest->delete();

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Refreshment request deleted successfully.');
        }

        return redirect()->route('meeting-refreshment-requests.index')->with('success', 'Refreshment request deleted successfully.');
    }
}
