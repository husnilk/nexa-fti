<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CommitteeTaskUpdateRequest extends FormRequest
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
            'committee_id' => ['nullable'],
            'parent_id' => ['nullable'],
            'title' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'assigned_to' => ['nullable'],
            'start_date' => ['nullable', 'date'],
            'due_date' => ['nullable', 'date'],
            'priority' => ['required', 'in:low,medium,high'],
            'status' => ['required', 'in:open,in_progress,completed,cancelled'],
            'completion_percentage' => ['required', 'numeric', 'between:-999.99,999.99'],
            'parent_id_id' => ['required', 'string', 'exists:committee_tasks,id'],
            'assigned_to_id' => ['required', 'string', 'exists:committee_members,id'],
        ];
    }
}
