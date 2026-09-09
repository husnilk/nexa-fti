<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentDepreciationStoreRequest;
use App\Http\Requests\EquipmentDepreciationUpdateRequest;
use App\Models\EquipmentDepreciation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class EquipmentDepreciationController extends Controller
{
    public function index(Request $request): View
    {
        $equipmentDepreciations = EquipmentDepreciation::all();

        return view('equipmentDepreciation.index', [
            'equipmentDepreciations' => $equipmentDepreciations,
        ]);
    }

    public function create(Request $request): View
    {
        return view('equipmentDepreciation.create');
    }

    public function store(EquipmentDepreciationStoreRequest $request): RedirectResponse
    {
        $equipmentDepreciation = EquipmentDepreciation::create($request->validated());

        $request->session()->flash('equipmentDepreciation.id', $equipmentDepreciation->id);

        return redirect()->route('equipmentDepreciations.index');
    }

    public function show(Request $request, EquipmentDepreciation $equipmentDepreciation): View
    {
        return view('equipmentDepreciation.show', [
            'equipmentDepreciation' => $equipmentDepreciation,
        ]);
    }

    public function edit(Request $request, EquipmentDepreciation $equipmentDepreciation): View
    {
        return view('equipmentDepreciation.edit', [
            'equipmentDepreciation' => $equipmentDepreciation,
        ]);
    }

    public function update(EquipmentDepreciationUpdateRequest $request, EquipmentDepreciation $equipmentDepreciation): RedirectResponse
    {
        $equipmentDepreciation->update($request->validated());

        $request->session()->flash('equipmentDepreciation.id', $equipmentDepreciation->id);

        return redirect()->route('equipmentDepreciations.index');
    }

    public function destroy(Request $request, EquipmentDepreciation $equipmentDepreciation): RedirectResponse
    {
        $equipmentDepreciation->delete();

        return redirect()->route('equipmentDepreciations.index');
    }
}
