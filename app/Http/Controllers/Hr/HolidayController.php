<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Http\Requests\HolidayStoreRequest;
use App\Http\Requests\HolidayUpdateRequest;
use App\Models\Holiday;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HolidayController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:hr.view')->only(['index', 'show']);
        $this->middleware('permission:hr.manage')->only(['create', 'store', 'edit', 'update', 'destroy']);
    }

    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $year = $request->input('year', now()->year);

        $holidays = Holiday::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($year, function ($query, $year) {
                $query->whereYear('date', $year);
            })
            ->orderBy('date', 'asc')
            ->get();

        return Inertia::render('holidays/index', [
            'holidays' => $holidays,
            'filters' => [
                'search' => $search,
                'year' => $year,
            ],
        ]);
    }

    public function store(HolidayStoreRequest $request): RedirectResponse
    {
        Holiday::create($request->validated());

        return redirect()->route('holidays.index')
            ->with('success', 'Holiday created successfully.');
    }

    public function show(Holiday $holiday): Response
    {
        return Inertia::render('holidays/show', [
            'holiday' => $holiday,
        ]);
    }

    public function update(HolidayUpdateRequest $request, Holiday $holiday): RedirectResponse
    {
        $holiday->update($request->validated());

        return redirect()->route('holidays.index')
            ->with('success', 'Holiday updated successfully.');
    }

    public function destroy(Holiday $holiday): RedirectResponse
    {
        $holiday->delete();

        return redirect()->route('holidays.index')
            ->with('success', 'Holiday deleted successfully.');
    }
}
