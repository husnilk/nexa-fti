<?php

namespace App\Http\Controllers\Acl;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePositionRequest;
use App\Http\Requests\UpdatePositionRequest;
use App\Models\Position;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PositionController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:organizations.view')->only(['index', 'show', 'organizationPositions']);
        $this->middleware('permission:organizations.manage')->only(['store', 'update', 'destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $search = request('search');

        return Inertia::render('positions/index', [
            'positions' => Position::with('parent')
                ->when($search, function ($query, $search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('grade', 'like', "%{$search}%")
                        ->orWhere('job_value', 'like', "%{$search}%")
                        ->orWhere('cg', 'like', "%{$search}%")
                        ->orWhere('skp_point', 'like', "%{$search}%");
                })
                ->latest()
                ->get(),
            'parentPositions' => Position::all(),
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Position $position): Response
    {
        return Inertia::render('positions/show', [
            'position' => $position->load(['parent', 'children', 'responsibilities']),
        ]);
    }

    public function organizationPositions(): Response
    {
        return Inertia::render('positions/organization-positions', [
            'positions' => Position::query()
                ->with([
                    'organizationPositions.organization:id,name,code,is_active',
                ])
                ->withCount('organizationPositions')
                ->latest()
                ->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePositionRequest $request): RedirectResponse
    {
        Position::create($request->validated());

        return redirect()->route('positions.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePositionRequest $request, Position $position): RedirectResponse
    {
        $position->update($request->validated());

        return redirect()->route('positions.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Position $position): RedirectResponse
    {
        $position->delete();

        return redirect()->route('positions.index');
    }
}
