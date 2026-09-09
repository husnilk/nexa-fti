<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Models\NomenclatureClassificationHistory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NomenclatureClassificationHistoryController extends Controller
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
            'staff_id' => ['required', 'uuid', 'exists:staff,id'],
            'nomenclature_classification_id' => ['required', 'uuid', 'exists:position_nomenclature_classifications,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'decree_number' => ['required', 'string', 'max:255'],
            'decree_date' => ['required', 'date'],
            'decree_signer' => ['required', 'string', 'max:255'],
            'decree_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'],
        ]);

        if ($request->hasFile('decree_file')) {
            $validated['decree_file'] = $request->file('decree_file')->store('staff/classification-histories', 'public');
        }

        NomenclatureClassificationHistory::create($validated);

        return redirect()->back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, NomenclatureClassificationHistory $history): RedirectResponse
    {
        $validated = $request->validate([
            'nomenclature_classification_id' => ['required', 'uuid', 'exists:position_nomenclature_classifications,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'decree_number' => ['required', 'string', 'max:255'],
            'decree_date' => ['required', 'date'],
            'decree_signer' => ['required', 'string', 'max:255'],
            'decree_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'],
        ]);

        if ($request->hasFile('decree_file')) {
            if ($history->decree_file) {
                Storage::disk('public')->delete($history->decree_file);
            }
            $validated['decree_file'] = $request->file('decree_file')->store('staff/classification-histories', 'public');
        }

        $history->update($validated);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NomenclatureClassificationHistory $history): RedirectResponse
    {
        if ($history->decree_file) {
            Storage::disk('public')->delete($history->decree_file);
        }

        $history->delete();

        return redirect()->back();
    }
}
