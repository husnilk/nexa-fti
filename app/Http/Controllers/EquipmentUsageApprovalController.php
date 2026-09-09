<?php

namespace App\Http\Controllers;

use App\Models\EquipmentUsage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EquipmentUsageApprovalController extends Controller
{
    public function approve(Request $request, EquipmentUsage $equipmentUsage): RedirectResponse
    {
        DB::transaction(function () use ($request, $equipmentUsage) {
            $equipmentUsage->update([
                'status' => 'approved',
                'approved_by' => $request->user()->id,
                'actual_start_date' => now(),
            ]);

            $equipmentUsage->equipment->update(['status' => 'in_use']);

            $equipmentUsage->equipmentUsageApprovals()->create([
                'approver_id' => $request->user()->id,
                'level' => 1,
                'status' => 'approved',
                'approved_at' => now(),
            ]);
        });

        return redirect()->back()->with('success', 'Equipment loan approved.');
    }

    public function reject(Request $request, EquipmentUsage $equipmentUsage): RedirectResponse
    {
        $request->validate(['notes' => 'required|string']);

        DB::transaction(function () use ($request, $equipmentUsage) {
            $equipmentUsage->update(['status' => 'rejected']);

            $equipmentUsage->equipmentUsageApprovals()->create([
                'approver_id' => $request->user()->id,
                'level' => 1,
                'status' => 'rejected',
                'notes' => $request->notes,
                'approved_at' => now(),
            ]);
        });

        return redirect()->back()->with('success', 'Equipment loan rejected.');
    }
}
