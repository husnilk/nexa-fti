<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Models\EmployeeRankHistory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EmployeeRankHistoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:hr.manage')->only(['store', 'update', 'destroy']);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'employee_id' => ['required', 'uuid', 'exists:employees,id'],
            'employee_rank_id' => ['required', 'uuid', 'exists:employee_ranks,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'effective_date' => ['required', 'date'],
            'decree_number' => ['required', 'string', 'max:255'],
            'decree_date' => ['required', 'date'],
            'decree_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'],
            'remarks' => ['nullable', 'string'],
        ]);

        if ($request->hasFile('decree_file')) {
            $validated['decree_file'] = $request->file('decree_file')->store('employee/ranks', 'public');
        }

        EmployeeRankHistory::create($validated);

        return redirect()->back()->with('success', 'Rank history added successfully.');
    }

    public function update(Request $request, EmployeeRankHistory $rankHistory): RedirectResponse
    {
        $validated = $request->validate([
            'employee_rank_id' => ['required', 'uuid', 'exists:employee_ranks,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'effective_date' => ['required', 'date'],
            'decree_number' => ['required', 'string', 'max:255'],
            'decree_date' => ['required', 'date'],
            'decree_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'],
            'remarks' => ['nullable', 'string'],
        ]);

        if ($request->hasFile('decree_file')) {
            if ($rankHistory->decree_file) {
                Storage::disk('public')->delete($rankHistory->decree_file);
            }
            $validated['decree_file'] = $request->file('decree_file')->store('employee/ranks', 'public');
        }

        $rankHistory->update($validated);

        return redirect()->back()->with('success', 'Rank history updated successfully.');
    }

    public function destroy(EmployeeRankHistory $rankHistory): RedirectResponse
    {
        if ($rankHistory->decree_file) {
            Storage::disk('public')->delete($rankHistory->decree_file);
        }

        $rankHistory->delete();

        return redirect()->back()->with('success', 'Rank history removed successfully.');
    }
}
