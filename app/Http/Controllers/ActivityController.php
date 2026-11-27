<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreActivityRequest;
use App\Http\Requests\UpdateActivityRequest;
use App\Models\Activity;
use App\Models\Employee;
use App\Models\Organization;
use App\Models\Performance;
use App\Models\Period;
use App\Models\Rubric;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ActivityController extends Controller
{
    public const EVIDENCE_DISK = 'local';

    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $periodId = $request->input('period_id');

        $activities = Activity::with([
            'period:id,name,year',
            'rubric:id,code,activity',
            'organization:id,name',
        ])
            ->withCount('performances')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('document_number', 'like', "%{$search}%");
                });
            })
            ->when($periodId, fn ($query, $periodId) => $query->where('period_id', $periodId))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('activities/index', [
            'activities' => $activities,
            'periods' => $this->periods(),
            'filters' => [
                'search' => $search,
                'period_id' => $periodId,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('activities/create', $this->formOptions());
    }

    public function store(StoreActivityRequest $request): RedirectResponse
    {
        $activity = new Activity($this->attributes($request));
        $activity->form_type = Rubric::find($activity->rubric_id)?->form_type;
        $activity->created_by_id = $request->user()->id;
        $activity->save();

        $this->storeEvidence($request, $activity);

        return redirect()->route('activities.show', $activity)
            ->with('success', __('Activity created. Now add the employees involved.'));
    }

    /**
     * The activity detail doubles as the page for managing its performances.
     */
    public function show(Activity $activity): Response
    {
        $activity->load([
            'period:id,name,year',
            'rubric:id,code,activity,unit,rule_max_employee',
            'rubric.details' => fn ($query) => $query->where('is_active', 1)->orderByDesc('poin'),
            'organization:id,name',
            'creator:id,name',
            'verifier:id,name',
            'performances' => fn ($query) => $query->oldest(),
            'performances.employee:id,name,emp_number',
            'performances.rubricDetail:id,position,poin,is_fixed_poin',
        ]);

        return Inertia::render('activities/show', [
            'activity' => $activity,
            'employees' => Employee::orderBy('name')->get(['id', 'name', 'emp_number']),
        ]);
    }

    public function edit(Activity $activity): Response
    {
        return Inertia::render('activities/edit', [
            'activity' => $activity->loadCount('performances'),
            ...$this->formOptions(),
        ]);
    }

    public function update(UpdateActivityRequest $request, Activity $activity): RedirectResponse
    {
        $activity->fill($this->attributes($request));
        $activity->form_type = Rubric::find($activity->rubric_id)?->form_type;

        if (! $activity->shared_performance_evidence) {
            $this->deleteFile($activity->performance_evidence_file);
            $activity->performance_evidence_file = null;
            $activity->performance_evidence_link = null;
        }

        $activity->save();

        $this->storeEvidence($request, $activity);

        return redirect()->route('activities.show', $activity)
            ->with('success', __('Activity updated successfully.'));
    }

    public function destroy(Activity $activity): RedirectResponse
    {
        $hasDecisions = $activity->performances()
            ->whereIn('verification_status', [Performance::VERIFICATION_APPROVED, Performance::VERIFICATION_REJECTED])
            ->exists();

        if ($hasDecisions) {
            return back()->withErrors(['activity' => __('This activity has verified performances and can no longer be deleted.')]);
        }

        $activity->delete();

        return redirect()->route('activities.index')
            ->with('success', __('Activity deleted successfully.'));
    }

    /**
     * Download the activity document or its shared performance evidence.
     */
    public function evidence(Activity $activity, string $type): StreamedResponse
    {
        $path = match ($type) {
            'document' => $activity->evidence_file,
            'performance' => $activity->performance_evidence_file,
            default => null,
        };

        abort_unless($path && Storage::disk(self::EVIDENCE_DISK)->exists($path), 404);

        return Storage::disk(self::EVIDENCE_DISK)->download($path);
    }

    /**
     * @return array<string, mixed>
     */
    private function attributes(StoreActivityRequest $request): array
    {
        $attributes = $request->safe()->except(['evidence_file', 'performance_evidence_file']);
        $attributes['shared_performance_evidence'] = $request->boolean('shared_performance_evidence');

        if (! $attributes['shared_performance_evidence']) {
            $attributes['performance_evidence_link'] = null;
        }

        return $attributes;
    }

    private function storeEvidence(StoreActivityRequest $request, Activity $activity): void
    {
        $columns = ['evidence_file'];

        if ($activity->shared_performance_evidence) {
            $columns[] = 'performance_evidence_file';
        }

        foreach ($columns as $column) {
            if ($request->hasFile($column)) {
                $this->deleteFile($activity->{$column});
                $activity->{$column} = $request->file($column)->store("activities/{$activity->id}", self::EVIDENCE_DISK);
            }
        }

        $activity->save();
    }

    private function deleteFile(?string $path): void
    {
        if ($path) {
            Storage::disk(self::EVIDENCE_DISK)->delete($path);
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'periods' => $this->periods(),
            'rubrics' => Rubric::where('is_active', Rubric::STATUS_ACTIVE)
                ->orderBy('code')
                ->get(['id', 'code', 'activity']),
            'organizations' => Organization::orderBy('name')->get(['id', 'name']),
            'verifiers' => Employee::orderBy('name')->get(['id', 'name', 'emp_number']),
        ];
    }

    /**
     * @return Collection<int, Period>
     */
    private function periods(): Collection
    {
        return Period::orderByDesc('year')->orderByDesc('no')->get(['id', 'name', 'year']);
    }
}
