<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LeaveApprovalStoreRequest extends FormRequest
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
            'leave_request_id' => ['required', 'integer', 'exists:leave_requests.id,id'],
            'approver_id' => ['required', 'integer', 'exists:employees.id,id'],
            'level' => ['required', 'integer'],
            'status' => ['required', 'in:pending,approved,rejected'],
            'notes' => ['nullable', 'string'],
            'action_date' => ['nullable'],
            'employee_id' => ['required', 'integer', 'exists:employees,id'],
        ];
    }
}
