<?php

namespace App\Http\Controllers\Acl;

use App\Http\Controllers\Controller;
use App\Models\PositionNomenclatureResponsibility;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PositionNomenclatureResponsibilityController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:organizations.manage')->only(['store', 'update', 'destroy']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'position_nomenclature_id' => ['required', 'uuid', 'exists:position_nomenclatures,id'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        PositionNomenclatureResponsibility::create($validated);

        return redirect()->back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PositionNomenclatureResponsibility $responsibility): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $responsibility->update($validated);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PositionNomenclatureResponsibility $responsibility): RedirectResponse
    {
        $responsibility->delete();

        return redirect()->back();
    }
}
