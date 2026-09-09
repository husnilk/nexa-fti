<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentProcurementApprovalStoreRequest;
use App\Http\Requests\EquipmentProcurementApprovalUpdateRequest;
use App\Models\EquipmentProcurementApproval;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class EquipmentProcurementApprovalController extends Controller
{
    public function index(Request $request): View
    {
        $equipmentProcurementApprovals = EquipmentProcurementApproval::all();

        return view('equipmentProcurementApproval.index', [
            'equipmentProcurementApprovals' => $equipmentProcurementApprovals,
        ]);
    }

    public function create(Request $request): View
    {
        return view('equipmentProcurementApproval.create');
    }

    public function store(EquipmentProcurementApprovalStoreRequest $request): RedirectResponse
    {
        $equipmentProcurementApproval = EquipmentProcurementApproval::create($request->validated());

        $request->session()->flash('equipmentProcurementApproval.id', $equipmentProcurementApproval->id);

        return redirect()->route('equipmentProcurementApprovals.index');
    }

    public function show(Request $request, EquipmentProcurementApproval $equipmentProcurementApproval): View
    {
        return view('equipmentProcurementApproval.show', [
            'equipmentProcurementApproval' => $equipmentProcurementApproval,
        ]);
    }

    public function edit(Request $request, EquipmentProcurementApproval $equipmentProcurementApproval): View
    {
        return view('equipmentProcurementApproval.edit', [
            'equipmentProcurementApproval' => $equipmentProcurementApproval,
        ]);
    }

    public function update(EquipmentProcurementApprovalUpdateRequest $request, EquipmentProcurementApproval $equipmentProcurementApproval): RedirectResponse
    {
        $equipmentProcurementApproval->update($request->validated());

        $request->session()->flash('equipmentProcurementApproval.id', $equipmentProcurementApproval->id);

        return redirect()->route('equipmentProcurementApprovals.index');
    }

    public function destroy(Request $request, EquipmentProcurementApproval $equipmentProcurementApproval): RedirectResponse
    {
        $equipmentProcurementApproval->delete();

        return redirect()->route('equipmentProcurementApprovals.index');
    }
}
