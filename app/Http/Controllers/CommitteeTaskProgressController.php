<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommitteeTaskProgressStoreRequest;
use App\Http\Requests\CommitteeTaskProgressUpdateRequest;
use App\Models\CommitteeTaskProgress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommitteeTaskProgressController extends Controller
{
    public function index(Request $request): Response
    {
        $committeeTaskProgresses = CommitteeTaskProgress::with(['committeeTask', 'createdBy'])->get();

        return Inertia::render('committees/task-progresses/index', [
            'committeeTaskProgresses' => $committeeTaskProgresses,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('committees/task-progresses/create');
    }

    public function store(CommitteeTaskProgressStoreRequest $request): RedirectResponse
    {
        $committeeTaskProgress = CommitteeTaskProgress::create($request->validated());

        $request->session()->flash('committeeTaskProgress.id', $committeeTaskProgress->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee task progress created successfully.');
        }

        return redirect()->route('committee-task-progresses.index')->with('success', 'Committee task progress created successfully.');
    }

    public function show(Request $request, CommitteeTaskProgress $committeeTaskProgress): Response
    {
        $committeeTaskProgress->load(['committeeTask', 'createdBy']);

        return Inertia::render('committees/task-progresses/show', [
            'committeeTaskProgress' => $committeeTaskProgress,
        ]);
    }

    public function edit(Request $request, CommitteeTaskProgress $committeeTaskProgress): Response
    {
        return Inertia::render('committees/task-progresses/edit', [
            'committeeTaskProgress' => $committeeTaskProgress,
        ]);
    }

    public function update(CommitteeTaskProgressUpdateRequest $request, CommitteeTaskProgress $committeeTaskProgress): RedirectResponse
    {
        $committeeTaskProgress->update($request->validated());

        $request->session()->flash('committeeTaskProgress.id', $committeeTaskProgress->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee task progress updated successfully.');
        }

        return redirect()->route('committee-task-progresses.index')->with('success', 'Committee task progress updated successfully.');
    }

    public function destroy(Request $request, CommitteeTaskProgress $committeeTaskProgress): RedirectResponse
    {
        $committeeTaskProgress->delete();

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee task progress deleted successfully.');
        }

        return redirect()->route('committee-task-progresses.index')->with('success', 'Committee task progress deleted successfully.');
    }
}
