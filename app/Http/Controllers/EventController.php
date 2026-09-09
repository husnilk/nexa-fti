<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\EventStoreRequest;
use App\Http\Requests\EventUpdateRequest;
use App\Models\Employee;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:event.view|event.manage')->only(['index', 'show', 'create', 'edit']);
        $this->middleware('permission:event.manage')->only(['store', 'update', 'destroy', 'publish']);
    }

    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $events = Event::with(['createdBy', 'publishedBy'])
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('venue', 'like', "%{$search}%");
            })
            ->latest()
            ->get();

        return Inertia::render('events/index', [
            'events' => $events,
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        $employees = Employee::orderBy('name')->get(['id', 'name']);

        return Inertia::render('events/create', [
            'employees' => $employees,
        ]);
    }

    public function store(EventStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if (empty($data['slug'])) {
            $data['slug'] = str($data['title'])->slug()->toString();
        }

        $event = Event::create($data);

        return redirect()->route('events.index')->with('success', 'Event created successfully.');
    }

    public function show(Request $request, Event $event): Response
    {
        $event->load(['createdBy', 'publishedBy']);

        return Inertia::render('events/show', [
            'event' => $event,
        ]);
    }

    public function edit(Request $request, Event $event): Response
    {
        $employees = Employee::orderBy('name')->get(['id', 'name']);

        return Inertia::render('events/edit', [
            'event' => $event,
            'employees' => $employees,
        ]);
    }

    public function update(EventUpdateRequest $request, Event $event): RedirectResponse
    {
        $data = $request->validated();

        if (empty($data['slug'])) {
            $data['slug'] = str($data['title'])->slug()->toString();
        }

        $event->update($data);

        return redirect()->route('events.index')->with('success', 'Event updated successfully.');
    }

    public function destroy(Request $request, Event $event): RedirectResponse
    {
        $event->delete();

        return redirect()->route('events.index')->with('success', 'Event deleted successfully.');
    }

    public function publish(Request $request, Event $event): RedirectResponse
    {
        $user = $request->user();
        $employeeId = $user->id;

        $event->update([
            'status' => 'published',
            'published_by' => $employeeId,
            'published_by_id' => $employeeId,
            'published_at' => now(),
        ]);

        if ($request->hasHeader('X-Inertia')) {
            return back()->with('success', 'Event published successfully.');
        }

        return redirect()->route('events.index')->with('success', 'Event published successfully.');
    }
}
