<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Models\PositionFunctionalHistory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PositionFunctionalHistoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:hr.manage')->only(['store', 'update', 'destroy']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'lecturer_id' => ['required', 'uuid', 'exists:lecturers,id'],
            'functional_position_id' => ['required', 'uuid', 'exists:functional_positions,id'],
            'start_date' => ['required', 'date'],
            'decree_number' => ['required', 'string', 'max:255'],
            'decree_date' => ['required', 'date'],
            'decree_signer' => ['required', 'string', 'max:255'],
            'certificate_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'],
        ]);

        if ($request->hasFile('certificate_file')) {
            $validated['certificate_file'] = $request->file('certificate_file')->store('lecturer/functional-histories', 'public');
        }

        PositionFunctionalHistory::create($validated);

        return redirect()->back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PositionFunctionalHistory $history): RedirectResponse
    {
        $validated = $request->validate([
            'functional_position_id' => ['required', 'uuid', 'exists:functional_positions,id'],
            'start_date' => ['required', 'date'],
            'decree_number' => ['required', 'string', 'max:255'],
            'decree_date' => ['required', 'date'],
            'decree_signer' => ['required', 'string', 'max:255'],
            'certificate_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'],
        ]);

        if ($request->hasFile('certificate_file')) {
            if ($history->certificate_file) {
                Storage::disk('public')->delete($history->certificate_file);
            }
            $validated['certificate_file'] = $request->file('certificate_file')->store('lecturer/functional-histories', 'public');
        }

        $history->update($validated);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PositionFunctionalHistory $history): RedirectResponse
    {
        if ($history->certificate_file) {
            Storage::disk('public')->delete($history->certificate_file);
        }

        $history->delete();

        return redirect()->back();
    }
}
