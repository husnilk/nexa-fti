<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AssignmentProgressUpdateRequest extends FormRequest
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
            'assignment_id' => ['required', 'integer', 'exists:assignments,id'],
            'description' => ['nullable', 'string'],
            'progress_date' => ['required', 'date'],
            'status' => ['required', 'in:in_progress,completed'],
            'attachment' => ['nullable', 'string'],
            'created_by' => ['required'],
            'employee_id' => ['required', 'string', 'exists:employees,id'],
        ];
    }
}
