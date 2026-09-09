<?php

namespace App\Http\Controllers;

use App\Http\Requests\BuildingStoreRequest;
use App\Http\Requests\BuildingUpdateRequest;
use App\Models\Building;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class BuildingController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('building.view');

        return Inertia::render('buildings/index', [
            'buildings' => Building::all(),
            'filters' => $request->all('search'),
        ]);
    }

    public function store(BuildingStoreRequest $request): RedirectResponse
    {
        Building::create($request->validated());

        return redirect()->route('buildings.index')->with('success', 'Building created successfully.');
    }

    public function show(Building $building): Response
    {
        Gate::authorize('building.view');

        return Inertia::render('buildings/show', [
            'building' => $building->load('rooms'),
        ]);
    }

    public function update(BuildingUpdateRequest $request, Building $building): RedirectResponse
    {
        $building->update($request->validated());

        return redirect()->route('buildings.index')->with('success', 'Building updated successfully.');
    }

    public function destroy(Building $building): RedirectResponse
    {
        Gate::authorize('building.manage');

        $building->delete();

        return redirect()->route('buildings.index')->with('success', 'Building deleted successfully.');
    }
}
