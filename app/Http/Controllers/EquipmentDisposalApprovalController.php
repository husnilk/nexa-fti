<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentDisposalApprovalStoreRequest;
use App\Http\Requests\EquipmentDisposalApprovalUpdateRequest;
use App\Models\EquipmentDisposalApproval;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class EquipmentDisposalApprovalController extends Controller
{
    public function index(Request $request): View
    {
        $equipmentDisposalApprovals = EquipmentDisposalApproval::all();

        return view('equipmentDisposalApproval.index', [
            'equipmentDisposalApprovals' => $equipmentDisposalApprovals,
        ]);
    }

    public function create(Request $request): View
    {
        return view('equipmentDisposalApproval.create');
    }

    public function store(EquipmentDisposalApprovalStoreRequest $request): RedirectResponse
    {
        $equipmentDisposalApproval = EquipmentDisposalApproval::create($request->validated());

        $request->session()->flash('equipmentDisposalApproval.id', $equipmentDisposalApproval->id);

        return redirect()->route('equipmentDisposalApprovals.index');
    }

    public function show(Request $request, EquipmentDisposalApproval $equipmentDisposalApproval): View
    {
        return view('equipmentDisposalApproval.show', [
            'equipmentDisposalApproval' => $equipmentDisposalApproval,
        ]);
    }

    public function edit(Request $request, EquipmentDisposalApproval $equipmentDisposalApproval): View
    {
        return view('equipmentDisposalApproval.edit', [
            'equipmentDisposalApproval' => $equipmentDisposalApproval,
        ]);
    }

    public function update(EquipmentDisposalApprovalUpdateRequest $request, EquipmentDisposalApproval $equipmentDisposalApproval): RedirectResponse
    {
        $equipmentDisposalApproval->update($request->validated());

        $request->session()->flash('equipmentDisposalApproval.id', $equipmentDisposalApproval->id);

        return redirect()->route('equipmentDisposalApprovals.index');
    }

    public function destroy(Request $request, EquipmentDisposalApproval $equipmentDisposalApproval): RedirectResponse
    {
        $equipmentDisposalApproval->delete();

        return redirect()->route('equipmentDisposalApprovals.index');
    }
}
