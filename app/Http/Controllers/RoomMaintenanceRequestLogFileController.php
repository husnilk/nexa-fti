<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomMaintenanceRequestLogFileStoreRequest;
use App\Http\Requests\RoomMaintenanceRequestLogFileUpdateRequest;
use App\Models\RoomMaintenanceRequestLogFile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class RoomMaintenanceRequestLogFileController extends Controller
{
    public function index(Request $request): View
    {
        $roomMaintenanceRequestLogFiles = RoomMaintenanceRequestLogFile::all();

        return view('roomMaintenanceRequestLogFile.index', [
            'roomMaintenanceRequestLogFiles' => $roomMaintenanceRequestLogFiles,
        ]);
    }

    public function create(Request $request): View
    {
        return view('roomMaintenanceRequestLogFile.create');
    }

    public function store(RoomMaintenanceRequestLogFileStoreRequest $request): RedirectResponse
    {
        $roomMaintenanceRequestLogFile = RoomMaintenanceRequestLogFile::create($request->validated());

        $request->session()->flash('roomMaintenanceRequestLogFile.id', $roomMaintenanceRequestLogFile->id);

        return redirect()->route('roomMaintenanceRequestLogFiles.index');
    }

    public function show(Request $request, RoomMaintenanceRequestLogFile $roomMaintenanceRequestLogFile): View
    {
        return view('roomMaintenanceRequestLogFile.show', [
            'roomMaintenanceRequestLogFile' => $roomMaintenanceRequestLogFile,
        ]);
    }

    public function edit(Request $request, RoomMaintenanceRequestLogFile $roomMaintenanceRequestLogFile): View
    {
        return view('roomMaintenanceRequestLogFile.edit', [
            'roomMaintenanceRequestLogFile' => $roomMaintenanceRequestLogFile,
        ]);
    }

    public function update(RoomMaintenanceRequestLogFileUpdateRequest $request, RoomMaintenanceRequestLogFile $roomMaintenanceRequestLogFile): RedirectResponse
    {
        $roomMaintenanceRequestLogFile->update($request->validated());

        $request->session()->flash('roomMaintenanceRequestLogFile.id', $roomMaintenanceRequestLogFile->id);

        return redirect()->route('roomMaintenanceRequestLogFiles.index');
    }

    public function destroy(Request $request, RoomMaintenanceRequestLogFile $roomMaintenanceRequestLogFile): RedirectResponse
    {
        $roomMaintenanceRequestLogFile->delete();

        return redirect()->route('roomMaintenanceRequestLogFiles.index');
    }
}
