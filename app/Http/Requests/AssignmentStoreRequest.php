<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class AssignmentStoreRequest extends FormRequest
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
     *
     * @return array<string, list<string|Rule>>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'assigned_by' => ['required', 'string', 'exists:employees,id'],
            'assigned_to' => ['required', 'string', 'exists:employees,id'],
            'parent_id' => ['nullable', 'integer', 'exists:assignments,id'],
            'start_date' => ['nullable', 'date'],
            'due_date' => ['nullable', 'date'],
            'status' => ['required', 'in:assigned,in_progress,completed,delegated,cancelled'],
            'priority' => ['required', 'in:low,medium,high'],
        ];
    }
}
