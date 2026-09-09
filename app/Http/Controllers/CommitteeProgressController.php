<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommitteeProgressStoreRequest;
use App\Http\Requests\CommitteeProgressUpdateRequest;
use App\Models\CommitteeProgress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommitteeProgressController extends Controller
{
    public function index(Request $request): Response
    {
        $committeeProgresses = CommitteeProgress::with(['committee', 'reportedBy'])->get();

        return Inertia::render('committees/progresses/index', [
            'committeeProgresses' => $committeeProgresses,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('committees/progresses/create');
    }

    public function store(CommitteeProgressStoreRequest $request): RedirectResponse
    {
        $committeeProgress = CommitteeProgress::create($request->validated());

        $request->session()->flash('committeeProgress.id', $committeeProgress->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee progress created successfully.');
        }

        return redirect()->route('committee-progresses.index')->with('success', 'Committee progress created successfully.');
    }

    public function show(Request $request, CommitteeProgress $committeeProgress): Response
    {
        $committeeProgress->load(['committee', 'reportedBy']);

        return Inertia::render('committees/progresses/show', [
            'committeeProgress' => $committeeProgress,
        ]);
    }

    public function edit(Request $request, CommitteeProgress $committeeProgress): Response
    {
        return Inertia::render('committees/progresses/edit', [
            'committeeProgress' => $committeeProgress,
        ]);
    }

    public function update(CommitteeProgressUpdateRequest $request, CommitteeProgress $committeeProgress): RedirectResponse
    {
        $committeeProgress->update($request->validated());

        $request->session()->flash('committeeProgress.id', $committeeProgress->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee progress updated successfully.');
        }

        return redirect()->route('committee-progresses.index')->with('success', 'Committee progress updated successfully.');
    }

    public function destroy(Request $request, CommitteeProgress $committeeProgress): RedirectResponse
    {
        $committeeProgress->delete();

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee progress deleted successfully.');
        }

        return redirect()->route('committee-progresses.index')->with('success', 'Committee progress deleted successfully.');
    }
}
