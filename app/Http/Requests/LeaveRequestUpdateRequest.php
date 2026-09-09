<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LeaveRequestUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'employee_id' => ['required', 'integer', 'exists:employees.id,id'],
            'leave_type_id' => ['required', 'integer', 'exists:leave_types.id,id'],
            'approver_id' => ['nullable', 'integer', 'exists:approvers,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date'],
            'total_days' => ['required', 'integer'],
            'reason' => ['nullable', 'string'],
            'attachment' => ['nullable', 'string'],
            'address_leave' => ['nullable', 'string'],
            'contact_leave' => ['nullable', 'string'],
            'status' => ['required', 'in:pending,approved,rejected,cancelled'],
            'submitted_at' => ['required'],
            'approved_at' => ['nullable'],
            'approver_id_id' => ['required', 'integer', 'exists:Employees,id'],
        ];
    }
}
