<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomMaintenanceRequestStoreRequest;
use App\Models\Room;
use App\Models\RoomMaintenanceRequest;
use App\Models\RoomMaintenanceRequestLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class RoomMaintenanceRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $query = RoomMaintenanceRequest::with(['room', 'reportedBy.user']);

        if (! $user->can('maintenance.view') && ! $user->can('room.approval')) {
            $query->where('reported_by_id', $user->id);
        }

        return Inertia::render('room-maintenance-requests/index', [
            'requests' => $query->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', RoomMaintenanceRequest::class);

        return Inertia::render('room-maintenance-requests/create', [
            'rooms' => Room::all(['id', 'name', 'code']),
        ]);
    }

    public function store(RoomMaintenanceRequestStoreRequest $request): RedirectResponse
    {
        Gate::authorize('create', RoomMaintenanceRequest::class);

        $maintenanceRequest = RoomMaintenanceRequest::create([
            'room_id' => $request->room_id,
            'reported_by_id' => $request->user()->id,
            'issue_description' => $request->issue_description,
            'status' => 'reported',
            'reported_at' => now(),
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('room-maintenance', 'public');
            $maintenanceRequest->roomMaintenanceRequestFiles()->create([
                'file' => $path,
                'description' => 'Room maintenance request photo',
            ]);
        }

        return redirect()->route('room-maintenance-requests.index')->with('success', 'Maintenance request submitted.');
    }

    public function show(RoomMaintenanceRequest $room_maintenance_request): Response
    {
        Gate::authorize('view', $room_maintenance_request);

        return Inertia::render('room-maintenance-requests/show', [
            'maintenanceRequest' => $room_maintenance_request->load(['room', 'reportedBy.user', 'roomMaintenanceRequestLogs.loggedBy.user', 'roomMaintenanceRequestFiles']),
        ]);
    }

    public function respond(Request $request, RoomMaintenanceRequest $room_maintenance_request): RedirectResponse
    {
        Gate::authorize('respond', RoomMaintenanceRequest::class);

        $request->validate([
            'status' => ['required', 'in:accepted,rejected'],
        ]);

        $room_maintenance_request->update([
            'status' => $request->status,
        ]);

        return back()->with('success', 'Request status updated to '.$request->status.'.');
    }

    public function addLog(Request $request, RoomMaintenanceRequest $room_maintenance_request): RedirectResponse
    {
        Gate::authorize('addLog', $room_maintenance_request);

        $request->validate([
            'log' => ['required', 'string'],
            'status' => ['required', 'in:in_progress,resolved'],
        ]);

        RoomMaintenanceRequestLog::create([
            'room_maintenance_request_id' => $room_maintenance_request->id,
            'log' => $request->log,
            'logged_by_id' => $request->user()->id,
            'logged_at' => now(),
            'status' => $request->status,
        ]);

        $room_maintenance_request->update([
            'status' => $request->status,
        ]);

        return back()->with('success', 'Log added and status updated.');
    }

    public function verify(Request $request, RoomMaintenanceRequest $room_maintenance_request): RedirectResponse
    {
        Gate::authorize('verify', $room_maintenance_request);

        $room_maintenance_request->update([
            'status' => 'verified',
            'resolved_at' => now(),
        ]);

        // Also update the latest log if exists
        $lastLog = $room_maintenance_request->roomMaintenanceRequestLogs()->latest()->first();
        if ($lastLog) {
            $lastLog->update([
                'status' => 'verified',
                'verified_by_id' => $request->user()->id,
                'verified_at' => now(),
            ]);
        }

        return back()->with('success', 'Maintenance verified and completed.');
    }

    public function destroy(RoomMaintenanceRequest $room_maintenance_request): RedirectResponse
    {
        Gate::authorize('delete', $room_maintenance_request);

        $room_maintenance_request->delete();

        return redirect()->route('room-maintenance-requests.index')->with('success', 'Maintenance request deleted.');
    }
}
