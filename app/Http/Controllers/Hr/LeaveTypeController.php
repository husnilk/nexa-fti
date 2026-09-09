<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Models\LeaveType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaveTypeController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:leave.view')->only(['index', 'show']);
        $this->middleware('permission:leave.manage')->only(['create', 'store', 'edit', 'update', 'destroy']);
    }

    public function index(): Response
    {
        return Inertia::render('leave-types/index', [
            'leaveTypes' => LeaveType::all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('leave-types/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:leave_types,code',
            'description' => 'nullable|string',
            'default_quota' => 'required|integer|min:0',
            'requires_attachment' => 'boolean',
        ]);

        LeaveType::create($validated);

        return redirect()->route('leave-types.index')
            ->with('success', 'Leave type created successfully.');
    }

    public function edit(LeaveType $leaveType): Response
    {
        return Inertia::render('leave-types/edit', [
            'leaveType' => $leaveType,
        ]);
    }

    public function update(Request $request, LeaveType $leaveType): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:leave_types,code,'.$leaveType->id,
            'description' => 'nullable|string',
            'default_quota' => 'required|integer|min:0',
            'requires_attachment' => 'boolean',
        ]);

        $leaveType->update($validated);

        return redirect()->route('leave-types.index')
            ->with('success', 'Leave type updated successfully.');
    }

    public function destroy(LeaveType $leaveType): RedirectResponse
    {
        $leaveType->delete();

        return redirect()->route('leave-types.index')
            ->with('success', 'Leave type deleted successfully.');
    }
}
