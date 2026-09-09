<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomUsageStoreRequest;
use App\Models\Room;
use App\Models\RoomUsage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class RoomUsageController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', RoomUsage::class);

        $user = $request->user();

        $query = RoomUsage::with(['room', 'user', 'approvedBy']);

        if (! $user->hasAnyPermission(['room.view', 'room.manage'])) {
            $query->where('user_id', $user->id);
        }

        return Inertia::render('room-usages/index', [
            'roomUsages' => $query->latest()->get(),
            'filters' => $request->all('search'),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', RoomUsage::class);

        return Inertia::render('room-usages/create', [
            'rooms' => Room::where('is_public', true)->get(['id', 'name', 'code', 'capacity']),
        ]);
    }

    public function store(RoomUsageStoreRequest $request): RedirectResponse
    {
        Gate::authorize('create', RoomUsage::class);

        RoomUsage::create([
            'room_id' => $request->room_id,
            'user_id' => $request->user()->id,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'purpose' => $request->purpose,
            'status' => 'requested',
        ]);

        return redirect()->route('room-usages.index')->with('success', 'Room usage proposed successfully.');
    }

    public function show(RoomUsage $room_usage): Response
    {
        Gate::authorize('view', $room_usage);

        return Inertia::render('room-usages/show', [
            'roomUsage' => $room_usage->load(['room', 'user', 'approvedBy']),
        ]);
    }

    public function destroy(RoomUsage $room_usage): RedirectResponse
    {
        Gate::authorize('delete', $room_usage);

        if ($room_usage->status !== 'requested') {
            return back()->with('error', 'Only pending requests can be deleted.');
        }

        $room_usage->delete();

        return redirect()->route('room-usages.index')->with('success', 'Room usage proposal deleted successfully.');
    }

    public function approve(Request $request, RoomUsage $room_usage): RedirectResponse
    {
        Gate::authorize('approve', RoomUsage::class);

        $room_usage->update([
            'status' => 'approved',
            'approved_by_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Room usage approved.');
    }

    public function reject(Request $request, RoomUsage $room_usage): RedirectResponse
    {
        Gate::authorize('approve', RoomUsage::class);

        $room_usage->update([
            'status' => 'rejected',
            'approved_by_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Room usage rejected.');
    }

    public function report(Request $request): Response
    {
        $rooms = Room::where('is_public', true)->get(['id', 'name', 'code', 'capacity']);
        $selectedRoomId = $request->query('room_id', $rooms->first()?->id);

        $usages = [];
        if ($selectedRoomId) {
            $usages = RoomUsage::with(['user'])
                ->where('room_id', $selectedRoomId)
                ->whereIn('status', ['approved', 'completed'])
                ->get();
        }

        return Inertia::render('room-usages/report', [
            'rooms' => $rooms,
            'selectedRoomId' => $selectedRoomId,
            'usages' => $usages,
        ]);
    }
}
