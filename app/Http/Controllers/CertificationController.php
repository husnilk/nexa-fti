<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCertificationRequest;
use App\Http\Requests\UpdateCertificationRequest;
use App\Models\Employee;
use App\Models\EmployeeCertification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CertificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('certification.manage');

        return Inertia::render('certifications/index', [
            'certifications' => EmployeeCertification::with(['employee.user'])->get(),
            'filters' => $request->all('search'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        Gate::authorize('certification.manage');

        return Inertia::render('certifications/create', [
            'employees' => Employee::all(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCertificationRequest $request): RedirectResponse
    {
        Gate::authorize('certification.manage');

        $validated = $request->validated();

        if ($request->hasFile('certificate_file')) {
            $validated['certificate_file'] = $request->file('certificate_file')->store('employee/certification', 'public');
        }

        EmployeeCertification::create($validated);

        return redirect()->route('certifications.index')->with('success', 'Certification created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(EmployeeCertification $certification): Response
    {
        Gate::authorize('certification.manage');

        return Inertia::render('certifications/show', [
            'certification' => $certification->load(['employee.user']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EmployeeCertification $certification): Response
    {
        Gate::authorize('certification.manage');

        return Inertia::render('certifications/edit', [
            'certification' => $certification,
            'employees' => Employee::all(['id', 'name']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCertificationRequest $request, EmployeeCertification $certification): RedirectResponse
    {
        Gate::authorize('certification.manage');

        $validated = $request->validated();

        if ($request->hasFile('certificate_file')) {
            if ($certification->certificate_file) {
                Storage::disk('public')->delete($certification->certificate_file);
            }
            $validated['certificate_file'] = $request->file('certificate_file')->store('employee/certification', 'public');
        }

        $certification->update($validated);

        return redirect()->route('certifications.index')->with('success', 'Certification updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EmployeeCertification $certification): RedirectResponse
    {
        Gate::authorize('certification.manage');

        if ($certification->certificate_file) {
            Storage::disk('public')->delete($certification->certificate_file);
        }

        $certification->delete();

        return redirect()->route('certifications.index')->with('success', 'Certification deleted successfully.');
    }
}
