<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Models\EmployeeFamilyMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmployeeFamilyMemberController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:hr.manage')->only(['store', 'update', 'destroy']);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'employee_id' => ['required', 'uuid', 'exists:employees,id'],
            'name' => ['required', 'string', 'max:255'],
            'relationship' => ['required', 'in:spouse,child,parent,sibling,other'],
            'gender' => ['required', 'in:male,female'],
            'birth_place' => ['nullable', 'string', 'max:255'],
            'birth_date' => ['nullable', 'date'],
            'id_card_number' => ['nullable', 'string', 'max:50'],
            'occupation' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'is_dependent' => ['boolean'],
            'notes' => ['nullable', 'string'],
        ]);

        EmployeeFamilyMember::create($validated);

        return redirect()->back()->with('success', 'Family member added successfully.');
    }

    public function update(Request $request, EmployeeFamilyMember $familyMember): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'relationship' => ['required', 'in:spouse,child,parent,sibling,other'],
            'gender' => ['required', 'in:male,female'],
            'birth_place' => ['nullable', 'string', 'max:255'],
            'birth_date' => ['nullable', 'date'],
            'id_card_number' => ['nullable', 'string', 'max:50'],
            'occupation' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'is_dependent' => ['boolean'],
            'notes' => ['nullable', 'string'],
        ]);

        $familyMember->update($validated);

        return redirect()->back()->with('success', 'Family member updated successfully.');
    }

    public function destroy(EmployeeFamilyMember $familyMember): RedirectResponse
    {
        $familyMember->delete();

        return redirect()->back()->with('success', 'Family member removed successfully.');
    }
}
