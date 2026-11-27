<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePerformanceRequest;
use App\Http\Requests\UpdatePerformanceRequest;
use App\Models\Activity;
use App\Models\Performance;
use App\Models\RubricDetail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Employees involved in an activity. Managed from the activity detail page.
 */
class PerformanceController extends Controller
{
    public function store(StorePerformanceRequest $request, Activity $activity): RedirectResponse
    {
        $performance = $activity->performances()->make();
        $this->save($request, $activity, $performance);

        return back()->with('success', __('Employee added to the activity.'));
    }

    public function update(UpdatePerformanceRequest $request, Activity $activity, Performance $performance): RedirectResponse
    {
        if ($performance->isLocked()) {
            return back()->withErrors(['performance' => __('This performance has been verified and can no longer be changed.')]);
        }

        // A returned performance goes back into the verifier's queue once corrected.
        if ($performance->verification_status === Performance::VERIFICATION_RETURNED) {
            $performance->verification_status = Performance::VERIFICATION_PENDING;
        }

        $this->save($request, $activity, $performance);

        return back()->with('success', __('Employee involvement updated.'));
    }

    public function destroy(Activity $activity, Performance $performance): RedirectResponse
    {
        if ($performance->isLocked()) {
            return back()->withErrors(['performance' => __('This performance has been verified and can no longer be removed.')]);
        }

        $performance->delete();

        return back()->with('success', __('Employee removed from the activity.'));
    }

    public function evidence(Activity $activity, Performance $performance): StreamedResponse
    {
        $disk = Storage::disk(ActivityController::EVIDENCE_DISK);

        abort_unless($performance->evidence_file && $disk->exists($performance->evidence_file), 404);

        return $disk->download($performance->evidence_file);
    }

    private function save(StorePerformanceRequest $request, Activity $activity, Performance $performance): void
    {
        $detail = RubricDetail::findOrFail($request->validated('rubric_detail_id'));
        $quantity = (float) $request->validated('quantity');
        $points = $request->validated('points');

        $performance->fill([
            'verification_status' => $performance->verification_status ?? Performance::VERIFICATION_PENDING,
            'employee_id' => $request->validated('employee_id'),
            'rubric_detail_id' => $detail->id,
            'period_id' => $activity->period_id,
            'name' => $activity->name,
            'position' => $detail->position,
            'quantity' => $quantity,
            // Fixed-point positions always use the rubric value; others accept a manual override.
            'points' => $detail->is_fixed_poin || $points === null ? $detail->poin * $quantity : (float) $points,
            'operator_id' => $request->user()->id,
        ]);

        // Evidence is per employee only when the activity does not share one.
        if ($activity->shared_performance_evidence) {
            $performance->evidence_link = null;
        } else {
            $performance->evidence_link = $request->validated('evidence_link');
        }

        $performance->save();

        if (! $activity->shared_performance_evidence && $request->hasFile('evidence_file')) {
            $disk = Storage::disk(ActivityController::EVIDENCE_DISK);

            if ($performance->evidence_file) {
                $disk->delete($performance->evidence_file);
            }

            $performance->update([
                'evidence_file' => $request->file('evidence_file')
                    ->store("activities/{$activity->id}/performances", ActivityController::EVIDENCE_DISK),
            ]);
        }
    }
}
