<?php

namespace App\Http\Controllers;

use App\Http\Requests\VerifyPerformanceRequest;
use App\Models\Activity;
use App\Models\Employee;
use App\Models\Performance;
use App\Models\Period;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Verification queue: activities a user verifies, and the performances in them.
 *
 * A verifier never verifies their own performance; it is routed to their supervisor.
 */
class PerformanceVerificationController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = $request->user()->id;
        $search = $request->input('search');
        $onlyPending = $request->boolean('pending');

        $verifiable = fn (Builder $query) => $query->verifiableBy($userId);
        $pending = fn (Builder $query) => $query->verifiableBy($userId)->where(fn (Builder $q) => $q
            ->whereNull('verification_status')
            ->orWhere('verification_status', Performance::VERIFICATION_PENDING));

        $activities = Activity::query()
            ->inActivePeriod()
            ->with(['period:id,name,year', 'rubric:id,code,activity', 'organization:id,name'])
            ->where(fn (Builder $query) => $query
                ->where('verifier_id', $userId)
                ->orWhereHas('performances', $verifiable))
            ->withCount([
                'performances as verifiable_count' => $verifiable,
                'performances as pending_count' => $pending,
                'performances as approved_count' => fn (Builder $q) => $q->verifiableBy($userId)
                    ->where('verification_status', Performance::VERIFICATION_APPROVED),
                'performances as rejected_count' => fn (Builder $q) => $q->verifiableBy($userId)
                    ->where('verification_status', Performance::VERIFICATION_REJECTED),
                'performances as returned_count' => fn (Builder $q) => $q->verifiableBy($userId)
                    ->where('verification_status', Performance::VERIFICATION_RETURNED),
            ])
            ->when($search, fn (Builder $query, $search) => $query->where(fn (Builder $q) => $q
                ->where('name', 'like', "%{$search}%")
                ->orWhere('document_number', 'like', "%{$search}%")))
            ->when($onlyPending, fn (Builder $query) => $query->whereHas('performances', $pending))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('performance-verifications/index', [
            'activities' => $activities,
            'activePeriod' => Period::active()?->only(['id', 'name', 'year']),
            'filters' => [
                'search' => $search,
                'pending' => $onlyPending,
            ],
        ]);
    }

    public function show(Request $request, Activity $activity): Response
    {
        $user = $request->user();

        $performances = $activity->performances()
            ->verifiableBy($user->id)
            ->with(['employee:id,name,emp_number', 'verifier:id,name'])
            ->oldest()
            ->get();

        abort_unless($activity->isInActivePeriod(), 403, __('Only activities in the active period can be verified.'));
        abort_if($activity->verifier_id !== $user->id && $performances->isEmpty(), 403);

        // When the verifier is part of the activity, say who verifies their own row.
        $ownPerformance = null;

        if ($activity->verifier_id === $user->id) {
            $own = $activity->performances()->where('employee_id', $user->id)->first();
            $supervisor = Employee::find($user->id)?->supervisor;

            $ownPerformance = $own ? [
                'status' => $own->verification_status,
                'supervisor' => $supervisor?->only(['id', 'name']),
            ] : null;
        }

        return Inertia::render('performance-verifications/show', [
            'activity' => $activity->load([
                'period:id,name,year',
                'rubric:id,code,activity,unit',
                'organization:id,name',
                'verifier:id,name',
            ]),
            'performances' => $performances,
            'ownPerformance' => $ownPerformance,
        ]);
    }

    /**
     * Activity document or shared evidence, for the people verifying the activity.
     */
    public function activityEvidence(Request $request, Activity $activity, string $type): StreamedResponse
    {
        $this->authorizeActivity($request, $activity);

        $path = $type === 'document' ? $activity->evidence_file : $activity->performance_evidence_file;

        return $this->download($path);
    }

    public function performanceEvidence(Request $request, Performance $performance): StreamedResponse
    {
        abort_unless($performance->canBeVerifiedBy($request->user()), 403);

        return $this->download($performance->evidence_file);
    }

    public function verify(VerifyPerformanceRequest $request, Performance $performance): RedirectResponse
    {
        $status = (int) $request->validated('status');

        $performance->update([
            'verification_status' => $status,
            'verification_reason' => $status === Performance::VERIFICATION_APPROVED ? null : $request->validated('reason'),
            'verifier_id' => $request->user()->id,
        ]);

        return back()->with('success', match ($status) {
            Performance::VERIFICATION_APPROVED => __('Performance approved.'),
            Performance::VERIFICATION_REJECTED => __('Performance rejected.'),
            default => __('Performance returned for correction.'),
        });
    }

    private function authorizeActivity(Request $request, Activity $activity): void
    {
        $userId = $request->user()->id;

        abort_unless(
            $activity->isInActivePeriod()
                && ($activity->verifier_id === $userId || $activity->performances()->verifiableBy($userId)->exists()),
            403
        );
    }

    private function download(?string $path): StreamedResponse
    {
        $disk = Storage::disk(ActivityController::EVIDENCE_DISK);

        abort_unless($path && $disk->exists($path), 404);

        return $disk->download($path);
    }
}
