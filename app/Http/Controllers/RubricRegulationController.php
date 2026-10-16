<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRubricRegulationRequest;
use App\Http\Requests\UpdateRubricRegulationRequest;
use App\Models\RubricRegulation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class RubricRegulationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('rubric-regulations/index', [
            'regulations' => RubricRegulation::query()
                ->withCount('rubrics')
                ->orderByDesc('regulation_year')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRubricRegulationRequest $request): RedirectResponse
    {
        $attributes = Arr::except($request->validated(), ['file', 'remove_file']);

        if ($request->hasFile('file')) {
            $attributes['file_path'] = $request->file('file')->store('rubric/regulations', 'public');
        }

        RubricRegulation::create($attributes);

        return back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRubricRegulationRequest $request, RubricRegulation $rubricRegulation): RedirectResponse
    {
        $attributes = Arr::except($request->validated(), ['file', 'remove_file']);

        if ($request->hasFile('file') || $request->boolean('remove_file')) {
            $this->deleteFile($rubricRegulation);
            $attributes['file_path'] = $request->hasFile('file')
                ? $request->file('file')->store('rubric/regulations', 'public')
                : null;
        }

        $rubricRegulation->update($attributes);

        return back();
    }

    /**
     * Activate or deactivate the specified resource.
     */
    public function toggleStatus(RubricRegulation $rubricRegulation): RedirectResponse
    {
        $rubricRegulation->update([
            'is_active' => $rubricRegulation->isActive()
                ? RubricRegulation::STATUS_INACTIVE
                : RubricRegulation::STATUS_ACTIVE,
        ]);

        return back();
    }

    /**
     * Remove the specified resource from storage. Regulations still used by
     * rubrics are kept, because deleting them would cascade to those rubrics.
     */
    public function destroy(RubricRegulation $rubricRegulation): RedirectResponse
    {
        if ($rubricRegulation->rubrics()->exists()) {
            return back()->withErrors([
                'regulation' => __('This regulation is still used by rubrics and cannot be deleted.'),
            ]);
        }

        $this->deleteFile($rubricRegulation);
        $rubricRegulation->delete();

        return back();
    }

    private function deleteFile(RubricRegulation $regulation): void
    {
        if ($regulation->file_path) {
            Storage::disk('public')->delete($regulation->file_path);
        }
    }
}
