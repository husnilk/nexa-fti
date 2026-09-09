<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventReminderStoreRequest;
use App\Http\Requests\EventReminderUpdateRequest;
use App\Models\EventReminder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class EventReminderController extends Controller
{
    public function index(Request $request): View
    {
        $eventReminders = EventReminder::all();

        return view('eventReminder.index', [
            'eventReminders' => $eventReminders,
        ]);
    }

    public function create(Request $request): View
    {
        return view('eventReminder.create');
    }

    public function store(EventReminderStoreRequest $request): RedirectResponse
    {
        $eventReminder = EventReminder::create($request->validated());

        $request->session()->flash('eventReminder.id', $eventReminder->id);

        return redirect()->route('event-reminders.index');
    }

    public function show(Request $request, EventReminder $eventReminder): View
    {
        return view('eventReminder.show', [
            'eventReminder' => $eventReminder,
        ]);
    }

    public function edit(Request $request, EventReminder $eventReminder): View
    {
        return view('eventReminder.edit', [
            'eventReminder' => $eventReminder,
        ]);
    }

    public function update(EventReminderUpdateRequest $request, EventReminder $eventReminder): RedirectResponse
    {
        $eventReminder->update($request->validated());

        $request->session()->flash('eventReminder.id', $eventReminder->id);

        return redirect()->route('event-reminders.index');
    }

    public function destroy(Request $request, EventReminder $eventReminder): RedirectResponse
    {
        $eventReminder->delete();

        return redirect()->route('event-reminders.index');
    }
}
