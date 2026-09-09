<?php

namespace App\Http\Controllers;

use App\Http\Requests\MeetingActionItemStoreRequest;
use App\Http\Requests\MeetingActionItemUpdateRequest;
use App\Models\MeetingActionItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MeetingActionItemController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:meeting.view|meeting.manage')->only(['index', 'show', 'create', 'edit']);
        $this->middleware('permission:meeting.manage')->only(['store', 'update', 'destroy']);
    }

    public function index(Request $request): Response
    {
        $meetingActionItems = MeetingActionItem::with(['meeting', 'assignedTo'])->get();

        return Inertia::render('meetings/action-items/index', [
            'meetingActionItems' => $meetingActionItems,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('meetings/action-items/create');
    }

    public function store(MeetingActionItemStoreRequest $request): RedirectResponse
    {
        $meetingActionItem = MeetingActionItem::create($request->validated());

        $request->session()->flash('meetingActionItem.id', $meetingActionItem->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Action item created successfully.');
        }

        return redirect()->route('meeting-action-items.index')->with('success', 'Action item created successfully.');
    }

    public function show(Request $request, MeetingActionItem $meetingActionItem): Response
    {
        $meetingActionItem->load(['meeting', 'assignedTo']);

        return Inertia::render('meetings/action-items/show', [
            'meetingActionItem' => $meetingActionItem,
        ]);
    }

    public function edit(Request $request, MeetingActionItem $meetingActionItem): Response
    {
        return Inertia::render('meetings/action-items/edit', [
            'meetingActionItem' => $meetingActionItem,
        ]);
    }

    public function update(MeetingActionItemUpdateRequest $request, MeetingActionItem $meetingActionItem): RedirectResponse
    {
        $meetingActionItem->update($request->validated());

        $request->session()->flash('meetingActionItem.id', $meetingActionItem->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Action item updated successfully.');
        }

        return redirect()->route('meeting-action-items.index')->with('success', 'Action item updated successfully.');
    }

    public function destroy(Request $request, MeetingActionItem $meetingActionItem): RedirectResponse
    {
        $meetingActionItem->delete();

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Action item deleted successfully.');
        }

        return redirect()->route('meeting-action-items.index')->with('success', 'Action item deleted successfully.');
    }
}
