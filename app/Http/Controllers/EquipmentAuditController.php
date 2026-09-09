<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentAuditStoreRequest;
use App\Http\Requests\EquipmentAuditUpdateRequest;
use App\Models\EquipmentAudit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class EquipmentAuditController extends Controller
{
    public function index(Request $request): View
    {
        $equipmentAudits = EquipmentAudit::all();

        return view('equipmentAudit.index', [
            'equipmentAudits' => $equipmentAudits,
        ]);
    }

    public function create(Request $request): View
    {
        return view('equipmentAudit.create');
    }

    public function store(EquipmentAuditStoreRequest $request): RedirectResponse
    {
        $equipmentAudit = EquipmentAudit::create($request->validated());

        $request->session()->flash('equipmentAudit.id', $equipmentAudit->id);

        return redirect()->route('equipmentAudits.index');
    }

    public function show(Request $request, EquipmentAudit $equipmentAudit): View
    {
        return view('equipmentAudit.show', [
            'equipmentAudit' => $equipmentAudit,
        ]);
    }

    public function edit(Request $request, EquipmentAudit $equipmentAudit): View
    {
        return view('equipmentAudit.edit', [
            'equipmentAudit' => $equipmentAudit,
        ]);
    }

    public function update(EquipmentAuditUpdateRequest $request, EquipmentAudit $equipmentAudit): RedirectResponse
    {
        $equipmentAudit->update($request->validated());

        $request->session()->flash('equipmentAudit.id', $equipmentAudit->id);

        return redirect()->route('equipmentAudits.index');
    }

    public function destroy(Request $request, EquipmentAudit $equipmentAudit): RedirectResponse
    {
        $equipmentAudit->delete();

        return redirect()->route('equipmentAudits.index');
    }
}
