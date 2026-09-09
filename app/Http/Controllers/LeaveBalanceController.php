<?php

namespace App\Http\Controllers;

use App\Http\Requests\LeaveBalanceStoreRequest;
use App\Http\Requests\LeaveBalanceUpdateRequest;
use App\Models\LeaveBalance;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class LeaveBalanceController extends Controller
{
    public function index(Request $request): View
    {
        $leaveBalances = LeaveBalance::all();

        return view('leaveBalance.index', [
            'leaveBalances' => $leaveBalances,
        ]);
    }

    public function create(Request $request): View
    {
        return view('leaveBalance.create');
    }

    public function store(LeaveBalanceStoreRequest $request): RedirectResponse
    {
        $leaveBalance = LeaveBalance::create($request->validated());

        $request->session()->flash('leaveBalance.id', $leaveBalance->id);

        return redirect()->route('leaveBalances.index');
    }

    public function show(Request $request, LeaveBalance $leaveBalance): View
    {
        return view('leaveBalance.show', [
            'leaveBalance' => $leaveBalance,
        ]);
    }

    public function edit(Request $request, LeaveBalance $leaveBalance): View
    {
        return view('leaveBalance.edit', [
            'leaveBalance' => $leaveBalance,
        ]);
    }

    public function update(LeaveBalanceUpdateRequest $request, LeaveBalance $leaveBalance): RedirectResponse
    {
        $leaveBalance->update($request->validated());

        $request->session()->flash('leaveBalance.id', $leaveBalance->id);

        return redirect()->route('leaveBalances.index');
    }

    public function destroy(Request $request, LeaveBalance $leaveBalance): RedirectResponse
    {
        $leaveBalance->delete();

        return redirect()->route('leaveBalances.index');
    }
}
