<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRubricRequest;
use App\Http\Requests\UpdateRubricRequest;
use App\Models\EmploymentType;
use App\Models\Organization;
use App\Models\Rubric;
use App\Models\RubricCategory;
use App\Models\RubricRegulation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class RubricController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $showAllRegulations = $request->query('regulation_status') === 'all';

        return Inertia::render('rubrics/index', [
            'rubrics' => Rubric::query()
                ->unless($showAllRegulations, fn ($query) => $query->withActiveRegulation())
                ->with(['category', 'regulation'])
                ->withCount(['details', 'organizations', 'employmentTypes'])
                ->orderBy('code')
                ->get(),
            'categories' => RubricCategory::orderBy('name')->get(['id', 'name', 'code']),
            'regulations' => RubricRegulation::query()
                ->unless($showAllRegulations, fn ($query) => $query->active())
                ->orderBy('name')
                ->get(['id', 'name', 'regulation_number', 'regulation_year', 'is_active']),
            'filters' => [
                'regulation_status' => $showAllRegulations ? 'all' : 'active',
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('rubrics/create', $this->formData());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRubricRequest $request): RedirectResponse
    {
        $rubric = DB::transaction(function () use ($request) {
            $rubric = Rubric::create($this->rubricAttributes($request->validated()));
            $this->syncRelations($rubric, $request->validated());

            return $rubric;
        });

        return redirect()->route('rubrics.show', $rubric);
    }

    /**
     * Display the specified resource.
     */
    public function show(Rubric $rubric): Response
    {
        return Inertia::render('rubrics/show', [
            'rubric' => $rubric->load([
                'category',
                'regulation',
                'details' => fn ($query) => $query->orderByDesc('poin'),
                'organizations.organization',
                'employmentTypes.employmentType.employeeType',
                'employmentTypes.employmentType.employmentContract',
            ]),
            'options' => $this->options(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Rubric $rubric): Response
    {
        return Inertia::render('rubrics/edit', [
            'rubric' => $rubric->load([
                'details' => fn ($query) => $query->orderByDesc('poin'),
                'organizations',
                'employmentTypes',
            ]),
            ...$this->formData($rubric),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRubricRequest $request, Rubric $rubric): RedirectResponse
    {
        DB::transaction(function () use ($request, $rubric) {
            $rubric->update($this->rubricAttributes($request->validated()));
            $this->syncRelations($rubric, $request->validated());
        });

        return redirect()->route('rubrics.show', $rubric);
    }

    /**
     * Activate or deactivate the specified resource.
     */
    public function toggleStatus(Rubric $rubric): RedirectResponse
    {
        $rubric->update([
            'is_active' => $rubric->isActive() ? Rubric::STATUS_INACTIVE : Rubric::STATUS_ACTIVE,
        ]);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rubric $rubric): RedirectResponse
    {
        $rubric->delete();

        return redirect()->route('rubrics.index');
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function rubricAttributes(array $validated): array
    {
        return Arr::except($validated, ['details', 'organization_ids', 'employment_type_ids']);
    }

    /**
     * Sync details, organization restrictions and employment types. Existing
     * detail rows keep their ids so later references to them stay valid.
     *
     * @param  array<string, mixed>  $validated
     */
    private function syncRelations(Rubric $rubric, array $validated): void
    {
        $keptDetailIds = [];

        foreach ($validated['details'] as $detail) {
            $attributes = Arr::only($detail, ['position', 'poin', 'is_fixed_poin', 'is_active']);
            $existing = filled($detail['id'] ?? null)
                ? $rubric->details()->whereKey($detail['id'])->first()
                : null;

            if ($existing) {
                $existing->update($attributes);
                $keptDetailIds[] = $existing->id;
            } else {
                $keptDetailIds[] = $rubric->details()->create($attributes)->id;
            }
        }

        $rubric->details()->whereNotIn('id', $keptDetailIds)->delete();

        $this->syncAssignments($rubric, 'organizations', 'organization_id', $validated['organization_ids'] ?? []);
        $this->syncAssignments($rubric, 'employmentTypes', 'employment_type_id', $validated['employment_type_ids']);
    }

    /**
     * @param  list<string>  $ids
     */
    private function syncAssignments(Rubric $rubric, string $relation, string $column, array $ids): void
    {
        $rubric->{$relation}()->whereNotIn($column, $ids)->delete();

        $existing = $rubric->{$relation}()->pluck($column)->all();

        foreach (array_diff($ids, $existing) as $id) {
            $rubric->{$relation}()->create([$column => $id]);
        }
    }

    /**
     * Lookup data for the create and edit forms.
     *
     * @return array<string, mixed>
     */
    private function formData(?Rubric $rubric = null): array
    {
        return [
            'categories' => RubricCategory::orderBy('name')->get(['id', 'name', 'code']),
            // Only active regulations can be chosen; an edited rubric keeps its current one.
            'regulations' => RubricRegulation::query()
                ->where(fn ($query) => $query
                    ->active()
                    ->when($rubric, fn ($query) => $query->orWhere('id', $rubric->rubric_regulation_id)))
                ->orderBy('name')
                ->get(['id', 'name', 'regulation_number', 'regulation_year', 'is_active']),
            'organizations' => Organization::orderBy('name')->get(['id', 'name', 'code']),
            'employmentTypes' => EmploymentType::with(['employeeType', 'employmentContract'])->get(),
            'options' => $this->options(),
        ];
    }

    /**
     * Selectable values for the rubric form, read from config/remun.php.
     *
     * @return array<string, list<array{value: int|string, label: string}>>
     */
    private function options(): array
    {
        return [
            'formTypes' => collect(config('remun.rubric_form_types'))
                ->map(fn (string $label, int|string $value) => ['value' => $value, 'label' => __($label)])
                ->values()
                ->all(),
        ];
    }
}
