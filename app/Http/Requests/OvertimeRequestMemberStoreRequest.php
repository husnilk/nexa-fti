<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OvertimeRequestMemberStoreRequest extends FormRequest
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
            'employee_id' => ['required', 'integer', 'exists:employees.id,id'],
            'role' => ['nullable', 'string'],
            'job_desc' => ['nullable', 'string'],
            'planned_hours' => ['required', 'numeric', 'between:-999.99,999.99'],
            'actual_start_time' => ['required'],
            'actual_end_time' => ['required'],
            'actual_hours' => ['required', 'numeric', 'between:-999.99,999.99'],
        ];
    }
}
