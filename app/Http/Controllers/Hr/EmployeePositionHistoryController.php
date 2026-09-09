<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Models\EmployeePositionHistory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EmployeePositionHistoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:hr.manage')->only(['store', 'update', 'destroy']);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'employee_id' => ['required', 'uuid', 'exists:employees,id'],
            'position_id' => ['required', 'uuid', 'exists:positions,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'decree_number' => ['required', 'string', 'max:255'],
            'decree_date' => ['required', 'date'],
            'document' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'],
        ]);

        if ($request->hasFile('document')) {
            $validated['document'] = $request->file('document')->store('employee/positions', 'public');
        }

        EmployeePositionHistory::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, EmployeePositionHistory $history): RedirectResponse
    {
        $validated = $request->validate([
            'position_id' => ['required', 'uuid', 'exists:positions,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'decree_number' => ['required', 'string', 'max:255'],
            'decree_date' => ['required', 'date'],
            'document' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'],
        ]);

        if ($request->hasFile('document')) {
            if ($history->document) {
                Storage::disk('public')->delete($history->document);
            }
            $validated['document'] = $request->file('document')->store('employee/positions', 'public');
        }

        $history->update($validated);

        return redirect()->back();
    }

    public function destroy(EmployeePositionHistory $history): RedirectResponse
    {
        if ($history->document) {
            Storage::disk('public')->delete($history->document);
        }

        $history->delete();

        return redirect()->back();
    }
}
