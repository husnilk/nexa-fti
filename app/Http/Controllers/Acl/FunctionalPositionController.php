<?php

namespace App\Http\Controllers\Acl;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFunctionalPositionRequest;
use App\Http\Requests\UpdateFunctionalPositionRequest;
use App\Models\FunctionalPosition;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FunctionalPositionController extends Controller
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

        return Inertia::render('functional-positions/index', [
            'functionalPositions' => FunctionalPosition::query()
                ->when($search, function ($query, $search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%")
                        ->orWhere('grade', 'like', "%{$search}%")
                        ->orWhere('job_value', 'like', "%{$search}%");
                })
                ->latest()
                ->get(),
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFunctionalPositionRequest $request): RedirectResponse
    {
        FunctionalPosition::create($request->validated());

        return redirect()->route('functional-positions.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(FunctionalPosition $functionalPosition): Response
    {
        return Inertia::render('functional-positions/show', [
            'functionalPosition' => $functionalPosition,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFunctionalPositionRequest $request, FunctionalPosition $functionalPosition): RedirectResponse
    {
        $functionalPosition->update($request->validated());

        return redirect()->route('functional-positions.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FunctionalPosition $functionalPosition): RedirectResponse
    {
        $functionalPosition->delete();

        return redirect()->route('functional-positions.index');
    }
}
