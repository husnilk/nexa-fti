<?php

namespace App\Http\Controllers;

use App\Http\Requests\MeetingRefreshmentItemStoreRequest;
use App\Http\Requests\MeetingRefreshmentItemUpdateRequest;
use App\Models\MeetingRefreshmentItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MeetingRefreshmentItemController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:meeting.view|meeting.manage')->only(['index', 'show', 'create', 'edit']);
        $this->middleware('permission:meeting.manage')->only(['store', 'update', 'destroy']);
    }

    public function index(Request $request): Response
    {
        $meetingRefreshmentItems = MeetingRefreshmentItem::with(['meetingRefreshmentRequest'])->get();

        return Inertia::render('meetings/refreshment-items/index', [
            'meetingRefreshmentItems' => $meetingRefreshmentItems,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('meetings/refreshment-items/create');
    }

    public function store(MeetingRefreshmentItemStoreRequest $request): RedirectResponse
    {
        $meetingRefreshmentItem = MeetingRefreshmentItem::create($request->validated());

        $request->session()->flash('meetingRefreshmentItem.id', $meetingRefreshmentItem->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Refreshment item added successfully.');
        }

        return redirect()->route('meeting-refreshment-items.index')->with('success', 'Refreshment item added successfully.');
    }

    public function show(Request $request, MeetingRefreshmentItem $meetingRefreshmentItem): Response
    {
        $meetingRefreshmentItem->load(['meetingRefreshmentRequest']);

        return Inertia::render('meetings/refreshment-items/show', [
            'meetingRefreshmentItem' => $meetingRefreshmentItem,
        ]);
    }

    public function edit(Request $request, MeetingRefreshmentItem $meetingRefreshmentItem): Response
    {
        return Inertia::render('meetings/refreshment-items/edit', [
            'meetingRefreshmentItem' => $meetingRefreshmentItem,
        ]);
    }

    public function update(MeetingRefreshmentItemUpdateRequest $request, MeetingRefreshmentItem $meetingRefreshmentItem): RedirectResponse
    {
        $meetingRefreshmentItem->update($request->validated());

        $request->session()->flash('meetingRefreshmentItem.id', $meetingRefreshmentItem->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Refreshment item updated successfully.');
        }

        return redirect()->route('meeting-refreshment-items.index')->with('success', 'Refreshment item updated successfully.');
    }

    public function destroy(Request $request, MeetingRefreshmentItem $meetingRefreshmentItem): RedirectResponse
    {
        $meetingRefreshmentItem->delete();

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Refreshment item deleted successfully.');
        }

        return redirect()->route('meeting-refreshment-items.index')->with('success', 'Refreshment item deleted successfully.');
    }
}
