<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CommitteeTaskProgressStoreRequest extends FormRequest
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
            'committee_task_id' => ['required'],
            'progress_date' => ['required'],
            'progress_percentage' => ['required', 'numeric', 'between:-999.99,999.99'],
            'description' => ['required', 'string'],
            'attachment' => ['nullable', 'string'],
            'created_by' => ['required'],
            'created_by_id' => ['required', 'string', 'exists:employees,id'],
        ];
    }
}
