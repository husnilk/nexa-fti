<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommitteeTaskStoreRequest;
use App\Http\Requests\CommitteeTaskUpdateRequest;
use App\Models\CommitteeTask;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommitteeTaskController extends Controller
{
    public function index(Request $request): Response
    {
        $committeeTasks = CommitteeTask::with(['committee', 'parent', 'assignedTo'])->get();

        return Inertia::render('committees/tasks/index', [
            'committeeTasks' => $committeeTasks,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('committees/tasks/create');
    }

    public function store(CommitteeTaskStoreRequest $request): RedirectResponse
    {
        $committeeTask = CommitteeTask::create($request->validated());

        $request->session()->flash('committeeTask.id', $committeeTask->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee task created successfully.');
        }

        return redirect()->route('committee-tasks.index')->with('success', 'Committee task created successfully.');
    }

    public function show(Request $request, CommitteeTask $committeeTask): Response
    {
        $committeeTask->load(['committee', 'parent', 'assignedTo', 'committeeTaskProgresses']);

        return Inertia::render('committees/tasks/show', [
            'committeeTask' => $committeeTask,
        ]);
    }

    public function edit(Request $request, CommitteeTask $committeeTask): Response
    {
        return Inertia::render('committees/tasks/edit', [
            'committeeTask' => $committeeTask,
        ]);
    }

    public function update(CommitteeTaskUpdateRequest $request, CommitteeTask $committeeTask): RedirectResponse
    {
        $committeeTask->update($request->validated());

        $request->session()->flash('committeeTask.id', $committeeTask->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee task updated successfully.');
        }

        return redirect()->route('committee-tasks.index')->with('success', 'Committee task updated successfully.');
    }

    public function destroy(Request $request, CommitteeTask $committeeTask): RedirectResponse
    {
        $committeeTask->delete();

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee task deleted successfully.');
        }

        return redirect()->route('committee-tasks.index')->with('success', 'Committee task deleted successfully.');
    }
}
