<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmployeeCertificationRequest;
use App\Http\Requests\UpdateEmployeeCertificationRequest;
use App\Models\EmployeeCertification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class EmployeeCertificationController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:hr.manage')->only(['store', 'update', 'destroy']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEmployeeCertificationRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('certificate_file')) {
            $validated['certificate_file'] = $request->file('certificate_file')->store('employee/certification', 'public');
        }

        EmployeeCertification::create($validated);

        return redirect()->back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEmployeeCertificationRequest $request, EmployeeCertification $employeeCertification): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('certificate_file')) {
            if ($employeeCertification->certificate_file) {
                Storage::disk('public')->delete($employeeCertification->certificate_file);
            }
            $validated['certificate_file'] = $request->file('certificate_file')->store('employee/certification', 'public');
        }

        $employeeCertification->update($validated);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EmployeeCertification $employeeCertification): RedirectResponse
    {
        if ($employeeCertification->certificate_file) {
            Storage::disk('public')->delete($employeeCertification->certificate_file);
        }

        $employeeCertification->delete();

        return redirect()->back();
    }
}
