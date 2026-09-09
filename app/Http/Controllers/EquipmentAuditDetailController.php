<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentAuditDetailStoreRequest;
use App\Http\Requests\EquipmentAuditDetailUpdateRequest;
use App\Models\EquipmentAuditDetail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class EquipmentAuditDetailController extends Controller
{
    public function index(Request $request): View
    {
        $equipmentAuditDetails = EquipmentAuditDetail::all();

        return view('equipmentAuditDetail.index', [
            'equipmentAuditDetails' => $equipmentAuditDetails,
        ]);
    }

    public function create(Request $request): View
    {
        return view('equipmentAuditDetail.create');
    }

    public function store(EquipmentAuditDetailStoreRequest $request): RedirectResponse
    {
        $equipmentAuditDetail = EquipmentAuditDetail::create($request->validated());

        $request->session()->flash('equipmentAuditDetail.id', $equipmentAuditDetail->id);

        return redirect()->route('equipmentAuditDetails.index');
    }

    public function show(Request $request, EquipmentAuditDetail $equipmentAuditDetail): View
    {
        return view('equipmentAuditDetail.show', [
            'equipmentAuditDetail' => $equipmentAuditDetail,
        ]);
    }

    public function edit(Request $request, EquipmentAuditDetail $equipmentAuditDetail): View
    {
        return view('equipmentAuditDetail.edit', [
            'equipmentAuditDetail' => $equipmentAuditDetail,
        ]);
    }

    public function update(EquipmentAuditDetailUpdateRequest $request, EquipmentAuditDetail $equipmentAuditDetail): RedirectResponse
    {
        $equipmentAuditDetail->update($request->validated());

        $request->session()->flash('equipmentAuditDetail.id', $equipmentAuditDetail->id);

        return redirect()->route('equipmentAuditDetails.index');
    }

    public function destroy(Request $request, EquipmentAuditDetail $equipmentAuditDetail): RedirectResponse
    {
        $equipmentAuditDetail->delete();

        return redirect()->route('equipmentAuditDetails.index');
    }
}
