<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventAttendanceStoreRequest;
use App\Http\Requests\EventAttendanceUpdateRequest;
use App\Models\EventAttendance;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class EventAttendanceController extends Controller
{
    public function index(Request $request): View
    {
        $eventAttendances = EventAttendance::all();

        return view('eventAttendance.index', [
            'eventAttendances' => $eventAttendances,
        ]);
    }

    public function create(Request $request): View
    {
        return view('eventAttendance.create');
    }

    public function store(EventAttendanceStoreRequest $request): RedirectResponse
    {
        $eventAttendance = EventAttendance::create($request->validated());

        $request->session()->flash('eventAttendance.id', $eventAttendance->id);

        return redirect()->route('event-attendances.index');
    }

    public function show(Request $request, EventAttendance $eventAttendance): View
    {
        return view('eventAttendance.show', [
            'eventAttendance' => $eventAttendance,
        ]);
    }

    public function edit(Request $request, EventAttendance $eventAttendance): View
    {
        return view('eventAttendance.edit', [
            'eventAttendance' => $eventAttendance,
        ]);
    }

    public function update(EventAttendanceUpdateRequest $request, EventAttendance $eventAttendance): RedirectResponse
    {
        $eventAttendance->update($request->validated());

        $request->session()->flash('eventAttendance.id', $eventAttendance->id);

        return redirect()->route('event-attendances.index');
    }

    public function destroy(Request $request, EventAttendance $eventAttendance): RedirectResponse
    {
        $eventAttendance->delete();

        return redirect()->route('event-attendances.index');
    }
}
