<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomMaintenanceRequestLogStoreRequest;
use App\Http\Requests\RoomMaintenanceRequestLogUpdateRequest;
use App\Models\RoomMaintenanceRequestLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class RoomMaintenanceRequestLogController extends Controller
{
    public function index(Request $request): View
    {
        $roomMaintenanceRequestLogs = RoomMaintenanceRequestLog::all();

        return view('roomMaintenanceRequestLog.index', [
            'roomMaintenanceRequestLogs' => $roomMaintenanceRequestLogs,
        ]);
    }

    public function create(Request $request): View
    {
        return view('roomMaintenanceRequestLog.create');
    }

    public function store(RoomMaintenanceRequestLogStoreRequest $request): RedirectResponse
    {
        $roomMaintenanceRequestLog = RoomMaintenanceRequestLog::create($request->validated());

        $request->session()->flash('roomMaintenanceRequestLog.id', $roomMaintenanceRequestLog->id);

        return redirect()->route('roomMaintenanceRequestLogs.index');
    }

    public function show(Request $request, RoomMaintenanceRequestLog $roomMaintenanceRequestLog): View
    {
        return view('roomMaintenanceRequestLog.show', [
            'roomMaintenanceRequestLog' => $roomMaintenanceRequestLog,
        ]);
    }

    public function edit(Request $request, RoomMaintenanceRequestLog $roomMaintenanceRequestLog): View
    {
        return view('roomMaintenanceRequestLog.edit', [
            'roomMaintenanceRequestLog' => $roomMaintenanceRequestLog,
        ]);
    }

    public function update(RoomMaintenanceRequestLogUpdateRequest $request, RoomMaintenanceRequestLog $roomMaintenanceRequestLog): RedirectResponse
    {
        $roomMaintenanceRequestLog->update($request->validated());

        $request->session()->flash('roomMaintenanceRequestLog.id', $roomMaintenanceRequestLog->id);

        return redirect()->route('roomMaintenanceRequestLogs.index');
    }

    public function destroy(Request $request, RoomMaintenanceRequestLog $roomMaintenanceRequestLog): RedirectResponse
    {
        $roomMaintenanceRequestLog->delete();

        return redirect()->route('roomMaintenanceRequestLogs.index');
    }
}
