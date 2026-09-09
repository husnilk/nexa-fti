<?php

namespace App\Http\Controllers\Acl;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePositionResponsibilityRequest;
use App\Http\Requests\UpdatePositionResponsibilityRequest;
use App\Models\PositionResponsibility;
use Illuminate\Http\RedirectResponse;

class PositionResponsibilityController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:organizations.manage')->only(['store', 'update', 'destroy']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePositionResponsibilityRequest $request): RedirectResponse
    {
        PositionResponsibility::create($request->validated());

        return redirect()->back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePositionResponsibilityRequest $request, PositionResponsibility $responsibility): RedirectResponse
    {
        $responsibility->update($request->validated());

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PositionResponsibility $responsibility): RedirectResponse
    {
        $responsibility->delete();

        return redirect()->back();
    }
}
