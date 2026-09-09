<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CommitteeProgressUpdateRequest extends FormRequest
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
            'committee_id' => ['required'],
            'progress_date' => ['required', 'date'],
            'progress_percentage' => ['required', 'numeric', 'between:-999.99,999.99'],
            'summary' => ['required', 'string'],
            'issues' => ['nullable', 'string'],
            'risks' => ['nullable', 'string'],
            'next_plan' => ['nullable', 'string'],
            'reported_by' => ['required'],
            'reported_by_id' => ['required', 'string', 'exists:employees,id'],
        ];
    }
}
