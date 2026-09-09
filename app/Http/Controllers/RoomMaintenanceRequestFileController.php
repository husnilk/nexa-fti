<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomMaintenanceRequestFileStoreRequest;
use App\Http\Requests\RoomMaintenanceRequestFileUpdateRequest;
use App\Models\RoomMaintenanceRequestFile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class RoomMaintenanceRequestFileController extends Controller
{
    public function index(Request $request): View
    {
        $roomMaintenanceRequestFiles = RoomMaintenanceRequestFile::all();

        return view('roomMaintenanceRequestFile.index', [
            'roomMaintenanceRequestFiles' => $roomMaintenanceRequestFiles,
        ]);
    }

    public function create(Request $request): View
    {
        return view('roomMaintenanceRequestFile.create');
    }

    public function store(RoomMaintenanceRequestFileStoreRequest $request): RedirectResponse
    {
        $roomMaintenanceRequestFile = RoomMaintenanceRequestFile::create($request->validated());

        $request->session()->flash('roomMaintenanceRequestFile.id', $roomMaintenanceRequestFile->id);

        return redirect()->route('roomMaintenanceRequestFiles.index');
    }

    public function show(Request $request, RoomMaintenanceRequestFile $roomMaintenanceRequestFile): View
    {
        return view('roomMaintenanceRequestFile.show', [
            'roomMaintenanceRequestFile' => $roomMaintenanceRequestFile,
        ]);
    }

    public function edit(Request $request, RoomMaintenanceRequestFile $roomMaintenanceRequestFile): View
    {
        return view('roomMaintenanceRequestFile.edit', [
            'roomMaintenanceRequestFile' => $roomMaintenanceRequestFile,
        ]);
    }

    public function update(RoomMaintenanceRequestFileUpdateRequest $request, RoomMaintenanceRequestFile $roomMaintenanceRequestFile): RedirectResponse
    {
        $roomMaintenanceRequestFile->update($request->validated());

        $request->session()->flash('roomMaintenanceRequestFile.id', $roomMaintenanceRequestFile->id);

        return redirect()->route('roomMaintenanceRequestFiles.index');
    }

    public function destroy(Request $request, RoomMaintenanceRequestFile $roomMaintenanceRequestFile): RedirectResponse
    {
        $roomMaintenanceRequestFile->delete();

        return redirect()->route('roomMaintenanceRequestFiles.index');
    }
}
