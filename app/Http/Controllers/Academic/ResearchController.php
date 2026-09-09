<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use App\Http\Requests\ResearchStoreRequest;
use App\Http\Requests\ResearchUpdateRequest;
use App\Models\Research;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ResearchController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:research.view')->only(['index', 'show']);
        $this->middleware('permission:research.manage')->only(['create', 'store', 'edit', 'update', 'destroy']);
    }

    public function index(Request $request): Response
    {
        $research = Research::withCount('researchMembers')->get();
        $users = User::all(['id', 'name']);

        return Inertia::render('research/index', [
            'research' => $research,
            'users' => $users,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('research/create');
    }

    public function store(ResearchStoreRequest $request): RedirectResponse
    {
        $research = Research::create($request->validated());

        return redirect()->route('research.index')->with('success', 'Research created successfully.');
    }

    public function show(Request $request, Research $research): Response
    {
        $research->load(['researchMembers.user', 'publications']);
        $users = User::all(['id', 'name']);

        return Inertia::render('research/show', [
            'research' => $research,
            'users' => $users,
        ]);
    }

    public function edit(Request $request, Research $research): Response
    {
        $research->load('researchMembers.user');

        return Inertia::render('research/edit', [
            'research' => $research,
        ]);
    }

    public function update(ResearchUpdateRequest $request, Research $research): RedirectResponse
    {
        $research->update($request->validated());

        return redirect()->route('research.index')->with('success', 'Research updated successfully.');
    }

    public function destroy(Request $request, Research $research): RedirectResponse
    {
        $research->delete();

        return redirect()->route('research.index')->with('success', 'Research deleted successfully.');
    }
}
