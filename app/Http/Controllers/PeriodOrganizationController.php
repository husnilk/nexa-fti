<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdatePeriodOrganizationRequest;
use App\Models\Organization;
use App\Models\Period;
use App\Models\PeriodOrganization;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PeriodOrganizationController extends Controller
{
    /**
     * Display the budget-holding organizations of a period.
     */
    public function index(Period $period): Response
    {
        return Inertia::render('periods/organizations', [
            'period' => $period->only(['id', 'name', 'year', 'no', 'status', 'pir']),
            'periodOrganizations' => $period->organizations()
                ->withPagu()
                ->with(['organization:id,name,code,organization_type_id', 'organization.organizationType:id,name'])
                ->get()
                ->sortBy('organization.name')
                ->values(),
            'unsyncedCount' => $this->unsyncedOrganizations($period)->count(),
            'options' => [
                'sharingMethods' => $this->toOptions(config('remun.sharing_methods')),
                'finalizationStates' => $this->toOptions(config('remun.finalization_states')),
                'stages' => $this->toOptions(config('remun.stages')),
            ],
        ]);
    }

    /**
     * Add every active budget-holding organization that is not yet in the period.
     */
    public function sync(Period $period): RedirectResponse
    {
        $this->unsyncedOrganizations($period)
            ->pluck('id')
            ->each(fn (string $organizationId) => $period->organizations()->create([
                'organization_id' => $organizationId,
                'pir_unit' => $period->pir,
            ]));

        return back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePeriodOrganizationRequest $request, Period $period, PeriodOrganization $organization): RedirectResponse
    {
        $organization->update($request->validated());

        return back();
    }

    /**
     * @return Builder<Organization>
     */
    private function unsyncedOrganizations(Period $period): Builder
    {
        return Organization::query()
            ->where('has_pagu', true)
            ->where('is_active', true)
            ->whereDoesntHave('periodOrganizations', fn (Builder $query) => $query->where('period_id', $period->id));
    }

    /**
     * @param  array<int|string, string>  $options
     * @return list<array{value: int|string, label: string}>
     */
    private function toOptions(array $options): array
    {
        return collect($options)
            ->map(fn (string $label, int|string $value) => ['value' => $value, 'label' => __($label)])
            ->values()
            ->all();
    }
}
