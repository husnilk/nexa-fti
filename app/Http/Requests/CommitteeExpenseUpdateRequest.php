<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CommitteeExpenseUpdateRequest extends FormRequest
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
            'expense_number' => ['required', 'string', 'unique:committee_expenses,expense_number'],
            'expense_date' => ['required', 'date'],
            'submitted_by' => ['nullable'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:draft,submitted,approved,rejected'],
            'approved_by' => ['nullable'],
            'approved_at' => ['nullable'],
            'submitted_by_id' => ['required', 'string', 'exists:employees,id'],
            'approved_by_id' => ['required', 'string', 'exists:employees,id'],
        ];
    }
}
