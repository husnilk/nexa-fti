<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CommitteeBudgetStoreRequest extends FormRequest
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
            'budget_number' => ['required', 'string', 'unique:committee_budgets,budget_number'],
            'title' => ['required', 'string'],
            'prepared_by' => ['nullable'],
            'prepared_at' => ['required', 'date'],
            'status' => ['required', 'in:draft,submitted,approved,rejected'],
            'approved_by' => ['nullable'],
            'approved_at' => ['nullable'],
            'prepared_by_id' => ['required', 'string', 'exists:employees,id'],
            'approved_by_id' => ['required', 'string', 'exists:employees,id'],
        ];
    }
}
