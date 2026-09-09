<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomStoreRequest;
use App\Http\Requests\RoomUpdateRequest;
use App\Models\Asset;
use App\Models\Building;
use App\Models\Employee;
use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('room.view');

        return Inertia::render('rooms/index', [
            'rooms' => Room::with(['building', 'responsibleEmployee', 'asset'])->get(),
            'filters' => $request->all('search'),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('room.manage');

        return Inertia::render('rooms/create', [
            'buildings' => Building::all(),
            'employees' => Employee::all(['id', 'name']),
        ]);
    }

    public function store(RoomStoreRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $asset = Asset::create([
                'name' => $request->asset_name,
                'code' => $request->asset_code,
                'type' => 'room',
                'acquisition_type' => $request->acquisition_type,
                'acquisition_date' => $request->acquisition_date,
                'acquisition_cost' => $request->acquisition_cost,
                'condition' => $request->condition,
                'status' => $request->status,
            ]);

            Room::create([
                'id' => $asset->id,
                'building_id' => $request->building_id,
                'name' => $request->name,
                'code' => $request->code,
                'floor' => $request->floor,
                'capacity' => $request->capacity,
                'is_public' => $request->is_public,
                'responsible_employee_id' => $request->responsible_employee_id,
            ]);
        });

        return redirect()->route('rooms.index')->with('success', 'Room created successfully.');
    }

    public function show(Room $room): Response
    {
        Gate::authorize('room.view');

        return Inertia::render('rooms/show', [
            'room' => $room->load(['building', 'responsibleEmployee', 'asset']),
        ]);
    }

    public function edit(Room $room): Response
    {
        Gate::authorize('room.manage');

        return Inertia::render('rooms/edit', [
            'room' => $room->load('asset'),
            'buildings' => Building::all(),
            'employees' => Employee::all(['id', 'name']),
        ]);
    }

    public function update(RoomUpdateRequest $request, Room $room): RedirectResponse
    {
        DB::transaction(function () use ($request, $room) {
            $room->asset->update([
                'name' => $request->asset_name,
                'code' => $request->asset_code,
                'acquisition_type' => $request->acquisition_type,
                'acquisition_date' => $request->acquisition_date,
                'acquisition_cost' => $request->acquisition_cost,
                'condition' => $request->condition,
                'status' => $request->status,
            ]);

            $room->update([
                'building_id' => $request->building_id,
                'name' => $request->name,
                'code' => $request->code,
                'floor' => $request->floor,
                'capacity' => $request->capacity,
                'is_public' => $request->is_public,
                'responsible_employee_id' => $request->responsible_employee_id,
            ]);
        });

        return redirect()->route('rooms.index')->with('success', 'Room updated successfully.');
    }

    public function destroy(Room $room): RedirectResponse
    {
        Gate::authorize('room.manage');

        DB::transaction(function () use ($room) {
            $asset = $room->asset;
            $room->delete();
            $asset->delete();
        });

        return redirect()->route('rooms.index')->with('success', 'Room deleted successfully.');
    }
}
