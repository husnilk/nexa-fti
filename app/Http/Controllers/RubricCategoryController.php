<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRubricCategoryRequest;
use App\Http\Requests\UpdateRubricCategoryRequest;
use App\Models\RubricCategory;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RubricCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('rubric-categories/index', [
            'categories' => RubricCategory::query()
                ->withCount('rubrics')
                ->orderBy('code')
                ->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRubricCategoryRequest $request): RedirectResponse
    {
        RubricCategory::create($request->validated());

        return back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRubricCategoryRequest $request, RubricCategory $rubricCategory): RedirectResponse
    {
        $rubricCategory->update($request->validated());

        return back();
    }

    /**
     * Remove the specified resource from storage. Categories still used by
     * rubrics are kept, because deleting them would cascade to those rubrics.
     */
    public function destroy(RubricCategory $rubricCategory): RedirectResponse
    {
        if ($rubricCategory->rubrics()->exists()) {
            return back()->withErrors([
                'category' => __('This category is still used by rubrics and cannot be deleted.'),
            ]);
        }

        $rubricCategory->delete();

        return back();
    }
}
