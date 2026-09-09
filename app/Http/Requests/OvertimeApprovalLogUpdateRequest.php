<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OvertimeApprovalLogUpdateRequest extends FormRequest
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
            'overtime_request_id' => ['required', 'integer', 'exists:overtime_requests.id,id'],
            'approver_id' => ['required', 'integer', 'exists:employees.id,id'],
            'status' => ['required', 'in:approved,rejected'],
            'notes' => ['nullable', 'string'],
            'action_date' => ['required'],
            'employee_id' => ['required', 'integer', 'exists:employees,id'],
        ];
    }
}
