<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Models\EmployeeEducationHistory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EmployeeEducationHistoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:hr.manage')->only(['store', 'update', 'destroy']);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'employee_id' => ['required', 'uuid', 'exists:employees,id'],
            'degree' => ['required', 'string', 'in:S3,S2,S1,D4,D3,D1,SLTA,SMP,SD,TK'],
            'institution' => ['required', 'string', 'max:255'],
            'major' => ['nullable', 'string', 'max:255'],
            'start_year' => ['required', 'integer', 'min:1900', 'max:'.date('Y')],
            'end_year' => ['required', 'integer', 'min:1900', 'after_or_equal:start_year'],
            'gpa' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'certificate_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'],
        ]);

        if ($request->hasFile('certificate_file')) {
            $validated['certificate_file'] = $request->file('certificate_file')->store('employee/education', 'public');
        }

        EmployeeEducationHistory::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, EmployeeEducationHistory $history): RedirectResponse
    {
        $validated = $request->validate([
            'degree' => ['required', 'string', 'in:S3,S2,S1,D4,D3,D1,SLTA,SMP,SD,TK'],
            'institution' => ['required', 'string', 'max:255'],
            'major' => ['nullable', 'string', 'max:255'],
            'start_year' => ['required', 'integer', 'min:1900', 'max:'.date('Y')],
            'end_year' => ['required', 'integer', 'min:1900', 'after_or_equal:start_year'],
            'gpa' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'certificate_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'],
        ]);

        if ($request->hasFile('certificate_file')) {
            if ($history->certificate_file) {
                Storage::disk('public')->delete($history->certificate_file);
            }
            $validated['certificate_file'] = $request->file('certificate_file')->store('employee/education', 'public');
        }

        $history->update($validated);

        return redirect()->back();
    }

    public function destroy(EmployeeEducationHistory $history): RedirectResponse
    {
        if ($history->certificate_file) {
            Storage::disk('public')->delete($history->certificate_file);
        }

        $history->delete();

        return redirect()->back();
    }
}
