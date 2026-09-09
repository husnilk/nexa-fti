<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTrainingRequest;
use App\Http\Requests\UpdateTrainingRequest;
use App\Models\Employee;
use App\Models\Training;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TrainingController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:training.view')->only(['index', 'show']);
        $this->middleware('permission:training.manage')->except(['index', 'show']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $trainings = Training::with('employees')->latest()->get();

        return Inertia::render('trainings/index', [
            'trainings' => $trainings,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $employees = Employee::orderBy('name')->get(['id', 'name']);

        return Inertia::render('trainings/create', [
            'employees' => $employees,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTrainingRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('certificate_file')) {
            $validated['certificate_file'] = $request->file('certificate_file')->store('training/certificates', 'public');
        }

        $training = Training::create($validated);

        if ($request->has('employee_ids')) {
            $training->employees()->sync($request->employee_ids);
        }

        return redirect()->route('trainings.index')->with('success', 'Training created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Training $training): Response
    {
        $training->load('employees');

        return Inertia::render('trainings/show', [
            'training' => $training,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Training $training): Response
    {
        $training->load('employees');
        $employees = Employee::orderBy('name')->get(['id', 'name']);

        return Inertia::render('trainings/edit', [
            'training' => $training,
            'employees' => $employees,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTrainingRequest $request, Training $training): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('certificate_file')) {
            if ($training->certificate_file) {
                Storage::disk('public')->delete($training->certificate_file);
            }
            $validated['certificate_file'] = $request->file('certificate_file')->store('training/certificates', 'public');
        }

        $training->update($validated);

        if ($request->has('employee_ids')) {
            $training->employees()->sync($request->employee_ids);
        }

        return redirect()->route('trainings.index')->with('success', 'Training updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Training $training): RedirectResponse
    {
        if ($training->certificate_file) {
            Storage::disk('public')->delete($training->certificate_file);
        }

        $training->delete();

        return redirect()->back()->with('success', 'Training deleted successfully.');
    }
}
