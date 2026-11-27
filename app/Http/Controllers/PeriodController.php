<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePeriodRequest;
use App\Http\Requests\UpdatePeriodRequest;
use App\Models\Period;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PeriodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('periods/index', [
            'periods' => Period::query()
                ->orderByDesc('year')
                ->orderByDesc('no')
                ->get(),
            'options' => $this->options(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePeriodRequest $request): RedirectResponse
    {
        Period::create($request->validated());

        return redirect()->route('periods.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Period $period): Response
    {
        return Inertia::render('periods/show', [
            'period' => $period
                ->load(['months' => fn ($query) => $query->orderBy('month')])
                ->loadCount(['organizations as organizations_count' => fn ($query) => $query->withPagu(), 'months'])
                ->loadSum(['organizations as organizations_sum_pagu' => fn ($query) => $query->withPagu()], 'pagu'),
            'options' => $this->options(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePeriodRequest $request, Period $period): RedirectResponse
    {
        $period->update($request->validated());

        return back();
    }

    /**
     * Activate or deactivate the specified resource.
     */
    public function toggleStatus(Period $period): RedirectResponse
    {
        $period->update([
            'status' => $period->isActive() ? Period::STATUS_INACTIVE : Period::STATUS_ACTIVE,
        ]);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Period $period): RedirectResponse
    {
        $period->delete();

        return redirect()->route('periods.index');
    }

    /**
     * Selectable values for the period form, read from config/remun.php.
     *
     * @return array<string, list<array{value: int|string, label: string}>>
     */
    private function options(): array
    {
        $toList = fn (array $options): array => collect($options)
            ->map(fn (string $label, int|string $value) => ['value' => $value, 'label' => __($label)])
            ->values()
            ->all();

        return [
            'skpFormats' => $toList(config('remun.skp_formats')),
            'calcMethods' => $toList(config('remun.calc_methods')),
            'bkdSemesters' => $toList(config('remun.bkd_semesters')),
        ];
    }
}
