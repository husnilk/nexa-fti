<?php

namespace App\Http\Controllers\Acl;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePositionNomenclatureRequest;
use App\Http\Requests\UpdatePositionNomenclatureRequest;
use App\Models\PositionNomenclature;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PositionNomenclatureController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:organizations.view')->only(['index', 'show']);
        $this->middleware('permission:organizations.manage')->only(['store', 'update', 'destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $search = request('search');

        return Inertia::render('position-nomenclatures/index', [
            'nomenclatures' => PositionNomenclature::query()
                ->when($search, function ($query, $search) {
                    $query->where('name', 'like', "%{$search}%");
                })
                ->latest()
                ->get(),
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePositionNomenclatureRequest $request): RedirectResponse
    {
        PositionNomenclature::create($request->validated());

        return redirect()->route('position-nomenclatures.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(PositionNomenclature $positionNomenclature): Response
    {
        return Inertia::render('position-nomenclatures/show', [
            'nomenclature' => $positionNomenclature->load(['responsibilities', 'classifications']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePositionNomenclatureRequest $request, PositionNomenclature $positionNomenclature): RedirectResponse
    {
        $positionNomenclature->update($request->validated());

        return redirect()->route('position-nomenclatures.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PositionNomenclature $positionNomenclature): RedirectResponse
    {
        $positionNomenclature->delete();

        return redirect()->route('position-nomenclatures.index');
    }
}
