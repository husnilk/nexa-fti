<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePeriodMonthRequest;
use App\Http\Requests\UpdatePeriodMonthRequest;
use App\Models\Period;
use App\Models\PeriodMonth;
use Illuminate\Http\RedirectResponse;

class PeriodMonthController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePeriodMonthRequest $request, Period $period): RedirectResponse
    {
        $period->months()->create($request->validated());

        return back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePeriodMonthRequest $request, Period $period, PeriodMonth $month): RedirectResponse
    {
        $month->update($request->validated());

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Period $period, PeriodMonth $month): RedirectResponse
    {
        $month->delete();

        return back();
    }
}
