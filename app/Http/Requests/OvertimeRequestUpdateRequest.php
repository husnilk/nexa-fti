<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OvertimeRequestUpdateRequest extends FormRequest
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
            'request_number' => ['required', 'string', 'unique:overtime_requests,request_number'],
            'title' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'request_date' => ['required', 'date'],
            'planned_start_time' => ['required'],
            'planned_end_time' => ['required'],
            'submitted_by' => ['required'],
            'approved_by' => ['nullable'],
            'status' => ['required', 'in:draft,pending,approved,rejected,completed,cancelled'],
            'submitted_at' => ['nullable'],
            'approved_at' => ['nullable'],
            'submitted_by_id' => ['required', 'integer', 'exists:Employees,id'],
            'approved_by_id' => ['required', 'integer', 'exists:Employees,id'],
        ];
    }
}
