<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\EventRegistrationStoreRequest;
use App\Http\Requests\EventRegistrationUpdateRequest;
use App\Models\Employee;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventRegistrationController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:event.manage');
    }

    public function index(Request $request): Response
    {
        $eventId = $request->query('event_id');

        $eventRegistrations = EventRegistration::with(['event', 'user', 'generatedBy'])
            ->when($eventId, function ($query, $eventId) {
                $query->where('event_id', $eventId);
            })
            ->latest()
            ->get();

        $events = Event::select('id', 'title')->get();

        return Inertia::render('event-registrations/index', [
            'eventRegistrations' => $eventRegistrations,
            'events' => $events,
            'filters' => [
                'event_id' => $eventId ? (int) $eventId : '',
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        $events = Event::select('id', 'title')->get();
        $users = User::select('id', 'name', 'email')->get();
        $employees = Employee::select('id', 'name')->get();

        $eventId = $request->query('event_id');

        return Inertia::render('event-registrations/create', [
            'events' => $events,
            'users' => $users,
            'employees' => $employees,
            'selected_event_id' => $eventId ? (int) $eventId : null,
        ]);
    }

    public function store(EventRegistrationStoreRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        if (empty($validated['registered_at'])) {
            $validated['registered_at'] = now();
        }
        if (empty($validated['issued_at'])) {
            $validated['issued_at'] = now();
        }

        $eventRegistration = EventRegistration::create($validated);

        $request->session()->push('eventRegistration.id', $eventRegistration->id);

        return redirect()->route('event-registrations.index', ['event_id' => $eventRegistration->event_id])
            ->with('success', 'Participant registered successfully.');
    }

    public function show(Request $request, EventRegistration $eventRegistration): Response
    {
        $eventRegistration->load(['event', 'user', 'generatedBy']);

        return Inertia::render('event-registrations/show', [
            'eventRegistration' => $eventRegistration,
        ]);
    }

    public function edit(Request $request, EventRegistration $eventRegistration): Response
    {
        $events = Event::select('id', 'title')->get();
        $users = User::select('id', 'name', 'email')->get();
        $employees = Employee::select('id', 'name')->get();

        return Inertia::render('event-registrations/edit', [
            'eventRegistration' => $eventRegistration,
            'events' => $events,
            'users' => $users,
            'employees' => $employees,
        ]);
    }

    public function update(EventRegistrationUpdateRequest $request, EventRegistration $eventRegistration): RedirectResponse
    {
        $eventRegistration->update($request->validated());

        $request->session()->push('eventRegistration.id', $eventRegistration->id);

        return redirect()->route('event-registrations.index', ['event_id' => $eventRegistration->event_id])
            ->with('success', 'Participant registration updated successfully.');
    }

    public function destroy(Request $request, EventRegistration $eventRegistration): RedirectResponse
    {
        $eventId = $eventRegistration->event_id;
        $eventRegistration->delete();

        return redirect()->route('event-registrations.index', ['event_id' => $eventId])
            ->with('success', 'Participant removed successfully.');
    }
}
